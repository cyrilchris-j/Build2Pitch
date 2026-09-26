const mongoose = require('mongoose');
const StartupIdea = require('../models/StartupIdea');
const IdeaAssignment = require('../models/IdeaAssignment');
const Team = require('../models/Team');
const { successResponse, errorResponse } = require('../utils/response');

const MAX_ATTEMPTS = 3;
const RESERVATION_TTL_MS = Number(process.env.RESERVATION_TTL_MS) || 10 * 60 * 1000;

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
/* 3-Option Problem Selection & Direct Select Endpoints               */
/* ------------------------------------------------------------------ */

/**
 * GET /api/ideas/options
 */
exports.getTeamIdeaOptions = async (req, res) => {
  try {
    await releaseExpiredReservations();

    const team = await resolveTeam(req);
    const teamKey = getTeamKey(team, req);

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
        return successResponse(
          res,
          {
            status: 'LOCKED',
            selectedIdea: toJSON(lockedIdea),
            options: [],
            teamName: team ? team.name : '',
          },
          'Your problem statement is already locked'
        );
      }
    }

    const options = await StartupIdea.aggregate([
      { $match: { isActive: true, isAssigned: false, assignedTeamId: null } },
      { $sample: { size: 3 } },
    ]);

    return successResponse(
      res,
      {
        status: 'SELECTING',
        options: options.map(toJSON),
        selectedIdea: null,
        teamName: team ? team.name : '',
      },
      'Problem options retrieved'
    );
  } catch (err) {
    console.error('[getTeamIdeaOptions Error]:', err);
    return errorResponse(res, err.message, 500);
  }
};

/**
 * POST /api/ideas/select
 */
exports.selectIdea = async (req, res) => {
  try {
    const { ideaId } = req.body;
    if (!ideaId || !mongoose.isValidObjectId(ideaId)) {
      return errorResponse(res, 'Valid ideaId is required', 400);
    }
    const team = await resolveTeam(req);
    const teamKey = getTeamKey(team, req);

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

    if (team) {
      team.ideaAssignment = {
        ideaId: claimed._id,
        ideaTitle: claimed.title,
        industry: claimed.category || claimed.industry || '',
        assignedAt: new Date(),
        isRevealed: true,
        revealTime: new Date(),
      };
      await team.save();
    }

    await IdeaAssignment.findOneAndUpdate(
      { teamId: teamKey },
      {
        $set: {
          ideaId: claimed._id,
          status: 'LOCKED',
          selectedAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );

    return successResponse(res, { status: 'LOCKED', idea: toJSON(claimed) }, 'Idea locked successfully');
  } catch (err) {
    console.error('[selectIdea Error]:', err);
    return errorResponse(res, err.message, 500);
  }
};

/* ------------------------------------------------------------------ */
/* 3-Attempt Dice Roll Flow Endpoints                                 */
/* ------------------------------------------------------------------ */

/**
 * GET /api/ideas/my-idea
 * Returns the authenticated team's current idea status (ROLLED, LOCKED, or null).
 */
exports.getMyIdea = async (req, res) => {
  try {
    await releaseExpiredReservations();

    const team = await resolveTeam(req);
    const teamKey = getTeamKey(team, req);

    let assignment = await IdeaAssignment.findOne({ teamId: teamKey }).lean();
    let ideaId = assignment?.ideaId;
    let status = assignment?.status;

    // Check team model fallback
    if (!ideaId && team?.ideaAssignment?.ideaId) {
      ideaId = team.ideaAssignment.ideaId;
      status = team.ideaAssignment.isRevealed ? 'LOCKED' : 'ROLLED';
    }

    if (!ideaId) {
      return successResponse(res, {
        status: null,
        attemptsUsed: 0,
        attemptsRemaining: MAX_ATTEMPTS,
        maxAttempts: MAX_ATTEMPTS,
        idea: null,
      });
    }

    const idea = await StartupIdea.findById(ideaId).lean();
    const attemptsUsed = assignment ? assignment.attemptsUsed : 1;

    return successResponse(res, {
      status: status || 'LOCKED',
      attemptsUsed,
      attemptsRemaining: status === 'LOCKED' ? 0 : Math.max(0, MAX_ATTEMPTS - attemptsUsed),
      maxAttempts: MAX_ATTEMPTS,
      idea: toJSON(idea),
    });
  } catch (err) {
    console.error('[getMyIdea Error]:', err);
    return errorResponse(res, err.message || 'Server error retrieving current idea', 500);
  }
};

/**
 * POST /api/ideas/roll
 * Roll the dice for a startup problem statement (up to 3 attempts).
 * Truly random uniform selection using MongoDB $sample.
 * Excludes all previously seen ideas for this team so EVERY ROLL IS DIFFERENT.
 * Excludes all assigned / locked ideas so NO OTHER TEAM EVER SEES THEM.
 */
exports.rollIdea = async (req, res) => {
  try {
    await releaseExpiredReservations();

    const team = await resolveTeam(req);
    const teamKey = getTeamKey(team, req);

    const assignment = await IdeaAssignment.findOne({ teamId: teamKey }).lean();

    // If already locked, disallow rolling
    if (assignment && assignment.status === 'LOCKED') {
      return errorResponse(res, 'Your idea is already locked. No more rolls allowed.', 409);
    }
    if (team?.ideaAssignment?.ideaId && (team.ideaAssignment.isRevealed || team.ideaAssignment.assignedAt)) {
      return errorResponse(res, 'Your idea is already locked. No more rolls allowed.', 409);
    }

    // Check attempts limit (3 max)
    if (assignment && assignment.attemptsUsed >= MAX_ATTEMPTS) {
      return errorResponse(
        res,
        `You have used all ${MAX_ATTEMPTS} rolls. Please lock your current problem or submit your own idea.`,
        409
      );
    }

    // Rolling again? Give the previous reserved idea back to the pool
    if (assignment && assignment.ideaId) {
      await StartupIdea.findOneAndUpdate(
        { _id: assignment.ideaId, assignedTeamId: `${teamKey}:ROLLED` },
        { $set: { assignedTeamId: null, reservedAt: null } }
      );
    }

    // Collect all ideas this team has already seen so we never repeat
    const seenIds = (assignment?.seenIdeaIds || []).map((id) => id.toString());
    if (assignment?.ideaId && !seenIds.includes(assignment.ideaId.toString())) {
      seenIds.push(assignment.ideaId.toString());
    }

    const excludeObjectIds = seenIds
      .filter((id) => mongoose.isValidObjectId(id))
      .map((id) => new mongoose.Types.ObjectId(id));

    // Truly random sampling from unassigned pool, excluding seen ideas
    let sampled = await StartupIdea.aggregate([
      {
        $match: {
          isActive: true,
          isAssigned: false,
          assignedTeamId: null,
          _id: { $nin: excludeObjectIds },
        },
      },
      { $sample: { size: 1 } },
    ]);

    // Fallback if all unassigned ideas were already seen by this team
    if (!sampled || sampled.length === 0) {
      sampled = await StartupIdea.aggregate([
        {
          $match: {
            isActive: true,
            isAssigned: false,
            assignedTeamId: null,
          },
        },
        { $sample: { size: 1 } },
      ]);
    }

    if (!sampled || sampled.length === 0) {
      return errorResponse(
        res,
        'All available problem statements have been claimed by other teams. You can submit your own idea below!',
        409
      );
    }

    const candidate = sampled[0];

    // Atomically claim a reservation: document must be strictly unassigned
    const claimed = await StartupIdea.findOneAndUpdate(
      {
        _id: candidate._id,
        isActive: true,
        isAssigned: false,
        assignedTeamId: null,
      },
      {
        $set: {
          assignedTeamId: `${teamKey}:ROLLED`,
          reservedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!claimed) {
      // Race condition with another team grabbing candidate doc at the exact millisecond -> retry
      return exports.rollIdea(req, res);
    }

    const nextAttempts = (assignment ? assignment.attemptsUsed : 0) + 1;
    const updatedSeen = [...new Set([...seenIds, claimed._id.toString()])].map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    await IdeaAssignment.findOneAndUpdate(
      { teamId: teamKey },
      {
        $set: {
          ideaId: claimed._id,
          seenIdeaIds: updatedSeen,
          attemptsUsed: nextAttempts,
          status: 'ROLLED',
          selectedAt: null,
        },
      },
      { upsert: true, new: true }
    );

    return successResponse(res, {
      attempt: nextAttempts,
      attemptsUsed: nextAttempts,
      attemptsRemaining: Math.max(0, MAX_ATTEMPTS - nextAttempts),
      maxAttempts: MAX_ATTEMPTS,
      idea: toJSON(claimed),
    }, `Idea rolled successfully (Roll ${nextAttempts} of ${MAX_ATTEMPTS})`);
  } catch (err) {
    console.error('[rollIdea Error]:', err);
    return errorResponse(res, err.message || 'Server error rolling idea', 500);
  }
};

/**
 * POST /api/ideas/lock
 * Lock the team's current rolled idea permanently.
 * Converts reservation into an exclusive permanent lock.
 * No other team can ever see or roll this idea.
 */
exports.lockIdea = async (req, res) => {
  try {
    const team = await resolveTeam(req);
    const teamKey = getTeamKey(team, req);

    const assignment = await IdeaAssignment.findOne({ teamId: teamKey }).lean();
    if (!assignment || !assignment.ideaId) {
      return errorResponse(res, 'Roll the dice before locking an idea.', 400);
    }

    // Already locked -> idempotently return the locked idea
    if (assignment.status === 'LOCKED') {
      const existing = await StartupIdea.findById(assignment.ideaId).lean();
      return successResponse(res, { status: 'LOCKED', idea: toJSON(existing) }, 'Idea is already locked');
    }

    // Atomically convert :ROLLED reservation to permanent lock
    const locked = await StartupIdea.findOneAndUpdate(
      {
        _id: assignment.ideaId,
        $or: [
          { assignedTeamId: `${teamKey}:ROLLED` },
          { assignedTeamId: teamKey },
        ],
      },
      {
        $set: {
          assignedTeamId: teamKey,
          isAssigned: true,
          reservedAt: null,
        },
      },
      { new: true }
    );

    if (!locked) {
      return errorResponse(res, 'Your rolled reservation expired or was claimed. Please roll again.', 409);
    }

    // Update Team record
    if (team) {
      team.ideaAssignment = {
        ideaId: locked._id,
        ideaTitle: locked.title,
        industry: locked.category || locked.industry || '',
        assignedAt: new Date(),
        isRevealed: true,
        revealTime: new Date(),
      };
      await team.save();
    }

    // Update IdeaAssignment record
    await IdeaAssignment.findOneAndUpdate(
      { teamId: teamKey },
      {
        $set: {
          status: 'LOCKED',
          selectedAt: new Date(),
        },
      }
    );

    return successResponse(
      res,
      { status: 'LOCKED', idea: toJSON(locked) },
      'Problem statement locked successfully for your team'
    );
  } catch (err) {
    console.error('[lockIdea Error]:', err);
    return errorResponse(res, err.message || 'Server error locking idea', 500);
  }
};

/**
 * POST /api/ideas/own-idea
 * Submit team's own startup idea with mandatory fields and immediately lock it.
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
    const currentAssignment = await IdeaAssignment.findOne({ teamId: teamKey }).lean();
    if (currentAssignment && currentAssignment.status === 'LOCKED') {
      return errorResponse(res, 'Your team has already locked a problem statement.', 409);
    }

    // Release any previous rolled reservation so it returns to pool
    if (currentAssignment?.ideaId && currentAssignment.status === 'ROLLED') {
      await StartupIdea.findOneAndUpdate(
        { _id: currentAssignment.ideaId, assignedTeamId: `${teamKey}:ROLLED` },
        { $set: { assignedTeamId: null, reservedAt: null } }
      );
    }

    // Ensure title uniqueness
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
      };
      await team.save();
    }

    // Update IdeaAssignment record
    await IdeaAssignment.findOneAndUpdate(
      { teamId: teamKey },
      {
        $set: {
          ideaId: newIdea._id,
          status: 'LOCKED',
          selectedAt: new Date(),
          attemptsUsed: (currentAssignment?.attemptsUsed || 0) + 1,
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
/* Catalog / Available ideas endpoint                                 */
/* ------------------------------------------------------------------ */

/**
 * GET /api/ideas/available
 * Returns unassigned, active ideas available in the pool.
 * Only ideas NOT assigned to any team are shown.
 */
exports.getAvailable = async (req, res) => {
  try {
    await releaseExpiredReservations();
    const ideas = await StartupIdea.find(
      { isActive: true, isAssigned: false, assignedTeamId: null },
      'title shortDescription category industry problemStatement targetAudience revenueModel complexityLevel keyFeatures'
    ).sort({ createdAt: 1 });
    return successResponse(res, { count: ideas.length, ideas: ideas.map(toJSON) }, 'Idea vault retrieved');
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

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