const mongoose = require('mongoose');
const StartupIdea = require('../models/StartupIdea');
const IdeaAssignment = require('../models/IdeaAssignment');
const { successResponse, errorResponse } = require('../utils/response');

const ObjectId = mongoose.Types.ObjectId;

const MAX_ATTEMPTS = 2;
const RESERVATION_TTL_MS = Number(process.env.RESERVATION_TTL_MS) || 10 * 60 * 1000;
const TEAM_ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;

function teamIdOf(req, res) {
  const raw = req.get('x-team-id') || req.query.team || '';
  const teamId = String(raw).trim();
  if (!TEAM_ID_PATTERN.test(teamId)) {
    errorResponse(
      res,
      'Missing or invalid team. Send a valid X-Team-Id header (letters, numbers, - or _, max 64).',
      400
    );
    return null;
  }
  return teamId;
}

function toJSON(idea) {
  return idea.toJSON ? idea.toJSON() : idea;
}

/**
 * Atomically claim a random available idea.
 *
 * Each contender picks a fresh random _id cursor, so parallel teams aim at
 * different, uniformly scattered points in the pool instead of one shared slot
 * (near-zero collision rate). The claim itself is a findOneAndUpdate guarded by
 * assignedTeamId:null — atomic per document — so even when two teams do land on
 * the same doc, one wins and the loser retries with a new random cursor. Two
 * teams can therefore never end up owning the same idea.
 */
async function claimRandomIdea(teamId, excludeIdeaIds = []) {
  for (let attempt = 0; attempt < 25; attempt += 1) {
    const cursor = new ObjectId();
    const filter = {
      isActive: true,
      assignedTeamId: null,
      _id: { $gte: cursor },
    };
    if (excludeIdeaIds.length) {
      filter._id.$nin = excludeIdeaIds;
    }

    let candidate = await StartupIdea.findOne(filter)
      .sort({ _id: 1 })
      .limit(1)
      .lean();

    // Wrapped past the end of the pool; fall back to the first available doc.
    if (!candidate) {
      const fromStart = { isActive: true, assignedTeamId: null };
      if (excludeIdeaIds.length) fromStart._id = { $nin: excludeIdeaIds };
      candidate = await StartupIdea.findOne(fromStart)
        .sort({ _id: 1 })
        .limit(1)
        .lean();
      if (!candidate) return null;
    }

    const claimed = await StartupIdea.findOneAndUpdate(
      {
        _id: candidate._id,
        isActive: true,
        assignedTeamId: null,
      },
      { $set: { assignedTeamId: `${teamId}:ROLLED`, reservedAt: new Date() } },
      { new: true }
    );
    if (claimed) return claimed;
  }
  return null;
}

/**
 * Release rolled-but-abandoned reservations back into the pool so ideas never
 * get stuck because a browser tab closed mid-decision.
 */
async function releaseExpiredReservations() {
  const ago = new Date(Date.now() - RESERVATION_TTL_MS);
  await StartupIdea.updateMany(
    { assignedTeamId: /:ROLLED$/, reservedAt: { $lt: ago } },
    { $set: { assignedTeamId: null, reservedAt: null } }
  );
}

/* ------------------------------------------------------------------ */
/* Dice / roll-flow endpoints                                         */
/* ------------------------------------------------------------------ */

/** GET /api/ideas/available */
exports.getAvailable = async (req, res) => {
  await releaseExpiredReservations();
  const ideas = await StartupIdea.find(
    { isActive: true, assignedTeamId: null },
    'title shortDescription category'
  ).sort({ createdAt: 1 });
  return successResponse(res, { count: ideas.length, ideas }, 'Idea vault retrieved');
};

/** GET /api/ideas/my-idea */
exports.getMyIdea = async (req, res) => {
  const teamId = teamIdOf(req, res);
  if (!teamId) return;

  const assignment = await IdeaAssignment.findOne({ teamId }).lean();
  if (!assignment) {
    return successResponse(res, {
      status: null,
      attemptsUsed: 0,
      attemptsRemaining: MAX_ATTEMPTS,
      idea: null,
    });
  }

  const idea = await StartupIdea.findById(assignment.ideaId).lean();
  return successResponse(res, {
    status: assignment.status,
    attemptsUsed: assignment.attemptsUsed,
    attemptsRemaining: Math.max(0, MAX_ATTEMPTS - assignment.attemptsUsed),
    idea,
  });
};

/** POST /api/ideas/roll */
exports.rollIdea = async (req, res) => {
  const teamId = teamIdOf(req, res);
  if (!teamId) return;

  await releaseExpiredReservations();

  const assignment = await IdeaAssignment.findOne({ teamId }).lean();

  if (assignment && assignment.status === 'LOCKED') {
    return errorResponse(res, 'Your idea is already locked. No more rolls allowed.', 409);
  }
  if (assignment && assignment.attemptsUsed >= MAX_ATTEMPTS) {
    return errorResponse(res, 'You have used both rolls. Lock your current idea.', 409);
  }

  // Rolling again? Give the previous reserved idea back to the pool.
  if (assignment) {
    await StartupIdea.findOneAndUpdate(
      { _id: assignment.ideaId, assignedTeamId: `${teamId}:ROLLED` },
      { $set: { assignedTeamId: null, reservedAt: null } }
    );
  }

  // Atomically claim a random available idea. The matched + updated document is
  // a single atomic operation, so two teams can never claim the same idea.
  // Exclude the team's previous roll so a "ROLL AGAIN" never re-shows the same card.
  const claimed = await claimRandomIdea(
    teamId,
    assignment ? [assignment.ideaId] : []
  );

  if (!claimed) {
    return errorResponse(res, 'All ideas have been claimed by other teams.', 409);
  }

  const nextAttempts = (assignment ? assignment.attemptsUsed : 0) + 1;

  await IdeaAssignment.findOneAndUpdate(
    { teamId },
    {
      $set: {
        ideaId: claimed._id,
        attemptsUsed: nextAttempts,
        status: 'ROLLED',
        selectedAt: null,
      },
    },
    { upsert: true, new: true }
  );

  return successResponse(res, {
    attempt: nextAttempts,
    attemptsRemaining: Math.max(0, MAX_ATTEMPTS - nextAttempts),
    idea: toJSON(claimed),
  });
};

/** POST /api/ideas/lock */
exports.lockIdea = async (req, res) => {
  const teamId = teamIdOf(req, res);
  if (!teamId) return;

  const assignment = await IdeaAssignment.findOne({ teamId }).lean();
  if (!assignment) {
    return errorResponse(res, 'Roll the dice before locking an idea.', 409);
  }

  // Already locked -> idempotently return the locked idea.
  if (assignment.status === 'LOCKED') {
    const idea = await StartupIdea.findById(assignment.ideaId).lean();
    return successResponse(res, { status: 'LOCKED', idea });
  }

  // Atomic: only turns a ROLLED reservation into a permanent lock. If another
  // team somehow ended up with the idea, this update matches nothing and fails.
  const locked = await StartupIdea.findOneAndUpdate(
    { _id: assignment.ideaId, assignedTeamId: `${teamId}:ROLLED` },
    { $set: { assignedTeamId: teamId, reservedAt: null, isAssigned: true } },
    { new: true }
  );

  if (!locked) {
    await IdeaAssignment.deleteOne({ teamId });
    return errorResponse(
      res,
      'Your rolled idea was released back to the pool. Roll the dice again.',
      409
    );
  }

  await IdeaAssignment.findOneAndUpdate(
    { teamId },
    { $set: { status: 'LOCKED', selectedAt: new Date() } }
  );

  return successResponse(res, { status: 'LOCKED', idea: toJSON(locked) });
};

/* ------------------------------------------------------------------ */
/* General idea endpoints                                             */
/* ------------------------------------------------------------------ */

exports.getAllIdeas = async (req, res) => {
  const ideas = await StartupIdea.find({ isActive: true }).sort({ createdAt: 1 });
  return successResponse(res, ideas, 'Startup ideas retrieved');
};

exports.getIdeaById = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return errorResponse(res, 'Invalid idea id', 400);
  }
  const idea = await StartupIdea.findById(req.params.id);
  if (!idea) {
    return errorResponse(res, 'Idea not found', 404);
  }
  return successResponse(res, idea, 'Idea details retrieved');
};

module.exports.MAX_ATTEMPTS = MAX_ATTEMPTS;