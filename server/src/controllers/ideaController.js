const mongoose = require('mongoose');
const StartupIdea = require('../models/StartupIdea');
const IdeaAssignment = require('../models/IdeaAssignment');
const Team = require('../models/Team');
const { successResponse, errorResponse } = require('../utils/response');

const ObjectId = mongoose.Types.ObjectId;

const MAX_ATTEMPTS = 2;
const RESERVATION_TTL_MS = Number(process.env.RESERVATION_TTL_MS) || 10 * 60 * 1000;
const TEAM_ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;

async function resolveTeam(req) {
  const userId = req.user?.id || req.user?._id;
  const teamId = req.user?.teamId;

  let team = null;
  if (teamId && mongoose.isValidObjectId(teamId)) {
    team = await Team.findById(teamId);
  }
  if (!team && userId && mongoose.isValidObjectId(userId)) {
    team = await Team.findOne({
      $or: [{ leaderId: userId }, { 'members.userId': userId }],
    });
  }
  if (!team) {
    const rawHeader = req.get('x-team-id') || req.query.team;
    if (rawHeader) {
      if (mongoose.isValidObjectId(rawHeader)) {
        team = await Team.findById(rawHeader);
      }
      if (!team) {
        team = await Team.findOne({
          $or: [{ teamCode: rawHeader }, { name: rawHeader }],
        });
      }
    }
  }
  return team;
}

function getTeamKey(team, req) {
  if (team && team._id) return team._id.toString();
  const raw = req.get('x-team-id') || req.query.team || req.user?.id || '';
  const cleaned = String(raw).trim();
  return cleaned || 'default_team';
}

function teamIdOf(req, res) {
  const raw = req.get('x-team-id') || req.query.team || req.user?.teamId || req.user?.id || '';
  const teamId = String(raw).trim();
  if (!teamId) {
    errorResponse(res, 'Missing team identity. Please log in or provide team header.', 400);
    return null;
  }
  return teamId;
}

function toJSON(idea) {
  if (!idea) return null;
  const obj = idea.toJSON ? idea.toJSON() : { ...idea };
  if (!obj.id && obj._id) {
    obj.id = obj._id.toString();
  }
  return obj;
}

/**
 * Release rolled-but-abandoned reservations back into the pool.
 */
async function releaseExpiredReservations() {
  const ago = new Date(Date.now() - RESERVATION_TTL_MS);
  await StartupIdea.updateMany(
    { assignedTeamId: /:ROLLED$/, reservedAt: { $lt: ago } },
    { $set: { assignedTeamId: null, reservedAt: null } }
  );
}

/* ------------------------------------------------------------------ */
/* 3-Option Problem Selection & Own Idea Endpoints                    */
/* ------------------------------------------------------------------ */

/**
 * GET /api/ideas/options
 * Returns 3 candidate problem statement options with full content visible upfront,
 * or the team's locked idea if already selected.
 * Guarantees that only unassigned ideas are offered as options.
 */
exports.getTeamIdeaOptions = async (req, res) => {
  try {
    await releaseExpiredReservations();

    const team = await resolveTeam(req);
    const teamKey = getTeamKey(team, req);

    // 1. Check if team already has a locked idea
    let lockedIdeaId = null;
    if (team?.ideaAssignment?.ideaId && (team.ideaAssignment.isRevealed || team.ideaAssignment.assignedAt)) {
      lockedIdeaId = team.ideaAssignment.ideaId;
    }
    if (!lockedIdeaId) {
      const assignment = await IdeaAssignment.findOne({ teamId: teamKey, status: 'LOCKED' }).lean();
      if (assignment?.ideaId) lockedIdeaId = assignment.ideaId;
    }

    if (lockedIdeaId) {
      const lockedIdea = await StartupIdea.findById(lockedIdeaId).lean();
      if (lockedIdea) {
        return successResponse(res, {
          status: 'LOCKED',
          selectedIdea: toJSON(lockedIdea),
          options: [],
          teamName: team ? team.name : '',
        }, 'Your problem statement is already locked');
      }
    }

    // 2. Fetch existing candidates if any
    let candidateIds = [];
    if (team?.ideaAssignment?.candidateIdeaIds?.length) {
      candidateIds = team.ideaAssignment.candidateIdeaIds;
    } else {
      const assignment = await IdeaAssignment.findOne({ teamId: teamKey }).lean();
      if (assignment?.candidateIdeaIds?.length) {
        candidateIds = assignment.candidateIdeaIds;
      }
    }

    // Check which of the candidates are still available (unassigned to anyone)
    let validCandidates = [];
    if (candidateIds.length > 0) {
      validCandidates = await StartupIdea.find({
        _id: { $in: candidateIds },
        isActive: true,
        isAssigned: false,
        assignedTeamId: null,
      }).lean();
    }

    // If fewer than 3 valid candidates, fill from the available pool
    const needed = Math.max(0, 3 - validCandidates.length);
    if (needed > 0) {
      const excludeIds = validCandidates.map((c) => c._id);
      const availablePool = await StartupIdea.aggregate([
        {
          $match: {
            isActive: true,
            isAssigned: false,
            assignedTeamId: null,
            _id: { $nin: excludeIds },
          },
        },
        { $sample: { size: needed } },
      ]);

      validCandidates = [...validCandidates, ...availablePool];
    }

    // Exactly up to 3 options
    const finalCandidates = validCandidates.slice(0, 3).map(toJSON);
    const finalIds = finalCandidates.map((c) => c.id || c._id);

    // Persist the candidate set so page reloads remain stable for this team
    if (team) {
      if (!team.ideaAssignment) team.ideaAssignment = {};
      team.ideaAssignment.candidateIdeaIds = finalIds;
      await team.save();
    }
    await IdeaAssignment.findOneAndUpdate(
      { teamId: teamKey },
      {
        $set: {
          candidateIdeaIds: finalIds,
          status: 'SELECTING',
        },
      },
      { upsert: true }
    );

    return successResponse(res, {
      status: 'SELECTING',
      options: finalCandidates,
      selectedIdea: null,
      teamName: team ? team.name : '',
    }, 'Problem statement options retrieved');
  } catch (error) {
    console.error('[getTeamIdeaOptions Error]:', error);
    return errorResponse(res, error.message || 'Server error loading problem options', 500);
  }
};

/**
 * POST /api/ideas/select
 * Select and lock one of the 3 problem statement options.
 * Enforces atomic exclusivity: no two teams can ever select the same idea.
 */
exports.selectIdea = async (req, res) => {
  try {
    const { ideaId } = req.body;
    if (!ideaId || !mongoose.isValidObjectId(ideaId)) {
      return errorResponse(res, 'Valid ideaId is required to select a problem statement', 400);
    }

    const team = await resolveTeam(req);
    const teamKey = getTeamKey(team, req);

    // Check if team already has a locked idea
    if (team?.ideaAssignment?.ideaId && (team.ideaAssignment.isRevealed || team.ideaAssignment.assignedAt)) {
      const existing = await StartupIdea.findById(team.ideaAssignment.ideaId).lean();
      return successResponse(res, { status: 'LOCKED', idea: toJSON(existing) }, 'Idea is already locked for your team');
    }

    // Atomic claim: only succeeds if the idea is unassigned and assignedTeamId is null
    const claimed = await StartupIdea.findOneAndUpdate(
      {
        _id: ideaId,
        isActive: true,
        isAssigned: false,
        assignedTeamId: null,
      },
      {
        $set: {
          isAssigned: true,
          assignedTeamId: teamKey,
          reservedAt: null,
        },
      },
      { new: true }
    );

    if (!claimed) {
      return errorResponse(
        res,
        'This problem statement has already been selected by another team. Please choose another option or submit your own idea.',
        409
      );
    }

    // Update Team model
    if (team) {
      team.ideaAssignment = {
        ideaId: claimed._id,
        ideaTitle: claimed.title,
        industry: claimed.category || claimed.industry || '',
        assignedAt: new Date(),
        isRevealed: true,
        revealTime: new Date(),
        candidateIdeaIds: [],
      };
      await team.save();
    }

    // Update IdeaAssignment model
    await IdeaAssignment.findOneAndUpdate(
      { teamId: teamKey },
      {
        $set: {
          ideaId: claimed._id,
          candidateIdeaIds: [],
          status: 'LOCKED',
          selectedAt: new Date(),
          attemptsUsed: 1,
        },
      },
      { upsert: true, new: true }
    );

    return successResponse(
      res,
      { status: 'LOCKED', idea: toJSON(claimed) },
      'Problem statement locked successfully for your team'
    );
  } catch (error) {
    console.error('[selectIdea Error]:', error);
    return errorResponse(res, error.message || 'Server error selecting problem statement', 500);
  }
};

/**
 * POST /api/ideas/own-idea
 * Submit a team's own startup idea with mandatory fields and immediately lock it.
 */
exports.submitOwnIdea = async (req, res) => {
  try {
    const {
      title,
      industry,
      problemStatement,
      targetAudience,
      revenueModel,
      keyFeatures,
      complexityLevel,
    } = req.body;

    // Validate mandatory fields
    if (!title || !String(title).trim()) {
      return errorResponse(res, 'Startup / Idea Title is mandatory', 400);
    }
    if (!industry || !String(industry).trim()) {
      return errorResponse(res, 'Industry / Domain Track is mandatory', 400);
    }
    if (!problemStatement || String(problemStatement).trim().length < 10) {
      return errorResponse(res, 'Problem Statement is mandatory (minimum 10 characters)', 400);
    }
    if (!targetAudience || !String(targetAudience).trim()) {
      return errorResponse(res, 'Target Audience is mandatory', 400);
    }
    if (!revenueModel || !String(revenueModel).trim()) {
      return errorResponse(res, 'Revenue Model / Monetization is mandatory', 400);
    }

    const team = await resolveTeam(req);
    const teamKey = getTeamKey(team, req);

    // Check if team already has a locked idea
    if (team?.ideaAssignment?.ideaId && (team.ideaAssignment.isRevealed || team.ideaAssignment.assignedAt)) {
      return errorResponse(res, 'Your team has already locked a problem statement. Changes are not allowed.', 409);
    }

    // Ensure title uniqueness in database
    let cleanTitle = String(title).trim();
    const existing = await StartupIdea.findOne({ title: cleanTitle });
    if (existing) {
      cleanTitle = `${cleanTitle} (${team?.teamCode || teamKey.slice(0, 6)})`;
    }

    const features = Array.isArray(keyFeatures)
      ? keyFeatures.map((f) => String(f).trim()).filter(Boolean)
      : typeof keyFeatures === 'string' && keyFeatures.trim()
      ? keyFeatures.split('\n').map((f) => f.trim()).filter(Boolean)
      : [];

    // Create the custom startup idea directly locked to this team
    const newIdea = await StartupIdea.create({
      title: cleanTitle,
      shortDescription: String(problemStatement).trim().slice(0, 160),
      category: String(industry).trim(),
      industry: String(industry).trim(),
      problemStatement: String(problemStatement).trim(),
      targetAudience: String(targetAudience).trim(),
      revenueModel: String(revenueModel).trim(),
      keyFeatures: features,
      complexityLevel: ['beginner', 'intermediate', 'advanced'].includes(complexityLevel)
        ? complexityLevel
        : 'intermediate',
      isActive: true,
      isAssigned: true,
      assignedTeamId: teamKey,
    });

    // Update Team record
    if (team) {
      team.ideaAssignment = {
        ideaId: newIdea._id,
        ideaTitle: newIdea.title,
        industry: newIdea.industry,
        assignedAt: new Date(),
        isRevealed: true,
        revealTime: new Date(),
        candidateIdeaIds: [],
      };
      await team.save();
    }

    // Update IdeaAssignment record
    await IdeaAssignment.findOneAndUpdate(
      { teamId: teamKey },
      {
        $set: {
          ideaId: newIdea._id,
          candidateIdeaIds: [],
          status: 'LOCKED',
          selectedAt: new Date(),
          attemptsUsed: 1,
        },
      },
      { upsert: true, new: true }
    );

    return successResponse(
      res,
      { status: 'LOCKED', idea: toJSON(newIdea) },
      'Your own startup idea has been submitted and locked successfully'
    );
  } catch (error) {
    console.error('[submitOwnIdea Error]:', error);
    return errorResponse(res, error.message || 'Server error submitting own idea', 500);
  }
};

/* ------------------------------------------------------------------ */
/* Dice / roll-flow legacy compatibility endpoints                    */
/* ------------------------------------------------------------------ */

/** GET /api/ideas/available */
exports.getAvailable = async (req, res) => {
  await releaseExpiredReservations();
  const ideas = await StartupIdea.find(
    { isActive: true, isAssigned: false, assignedTeamId: null },
    'title shortDescription category industry revenueModel complexityLevel'
  ).sort({ createdAt: 1 });
  return successResponse(res, { count: ideas.length, ideas: ideas.map(toJSON) }, 'Idea vault retrieved');
};

/** GET /api/ideas/my-idea */
exports.getMyIdea = async (req, res) => {
  const team = await resolveTeam(req);
  const teamKey = getTeamKey(team, req);

  let ideaId = team?.ideaAssignment?.ideaId;
  let status = team?.ideaAssignment?.isRevealed ? 'LOCKED' : null;

  const assignment = await IdeaAssignment.findOne({ teamId: teamKey }).lean();
  if (assignment) {
    if (assignment.ideaId) ideaId = assignment.ideaId;
    status = assignment.status;
  }

  if (!ideaId) {
    return successResponse(res, {
      status: null,
      attemptsUsed: 0,
      attemptsRemaining: MAX_ATTEMPTS,
      idea: null,
    });
  }

  const idea = await StartupIdea.findById(ideaId).lean();
  return successResponse(res, {
    status: status || 'LOCKED',
    attemptsUsed: assignment ? assignment.attemptsUsed : 1,
    attemptsRemaining: 0,
    idea: toJSON(idea),
  });
};

/** POST /api/ideas/roll (legacy) */
exports.rollIdea = async (req, res) => {
  const teamId = teamIdOf(req, res);
  if (!teamId) return;

  await releaseExpiredReservations();

  const candidate = await StartupIdea.findOne({
    isActive: true,
    isAssigned: false,
    assignedTeamId: null,
  }).lean();

  if (!candidate) {
    return errorResponse(res, 'All ideas have been claimed by other teams.', 409);
  }

  return successResponse(res, {
    attempt: 1,
    attemptsRemaining: 1,
    idea: toJSON(candidate),
  });
};

/** POST /api/ideas/lock (legacy) */
exports.lockIdea = async (req, res) => {
  const team = await resolveTeam(req);
  const teamKey = getTeamKey(team, req);

  const assignment = await IdeaAssignment.findOne({ teamId: teamKey }).lean();
  if (!assignment || !assignment.ideaId) {
    return errorResponse(res, 'No idea selected to lock.', 400);
  }

  const locked = await StartupIdea.findOneAndUpdate(
    { _id: assignment.ideaId, isAssigned: false },
    { $set: { isAssigned: true, assignedTeamId: teamKey } },
    { new: true }
  );

  return successResponse(res, { status: 'LOCKED', idea: toJSON(locked || (await StartupIdea.findById(assignment.ideaId))) });
};

/* ------------------------------------------------------------------ */
/* General idea endpoints                                             */
/* ------------------------------------------------------------------ */

exports.getAllIdeas = async (req, res) => {
  const ideas = await StartupIdea.find({ isActive: true }).sort({ createdAt: 1 });
  return successResponse(res, ideas.map(toJSON), 'Startup ideas retrieved');
};

exports.getIdeaById = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return errorResponse(res, 'Invalid idea id', 400);
  }
  const idea = await StartupIdea.findById(req.params.id);
  if (!idea) {
    return errorResponse(res, 'Idea not found', 404);
  }
  return successResponse(res, toJSON(idea), 'Idea details retrieved');
};

module.exports.MAX_ATTEMPTS = MAX_ATTEMPTS;