const Submission = require('../models/Submission');
const Team = require('../models/Team');
const { successResponse, errorResponse } = require('../utils/response');

// In-memory fallback cache when MongoDB is connecting / offline in dev
const mockSubmissionsMap = new Map();

/**
 * Helper to resolve user's teamId
 */
const resolveUserTeamId = async (user) => {
  if (user.teamId) return user.teamId;

  try {
    const team = await Team.findOne({
      $or: [{ leaderId: user.id }, { 'members.userId': user.id }],
    });
    return team ? team._id.toString() : 'mock_team_1';
  } catch (err) {
    return 'mock_team_1';
  }
};

/**
 * GET /api/submissions/me
 * Retrieve submission status & deliverables for the authenticated user's team
 */
exports.getSubmission = async (req, res) => {
  try {
    const teamId = await resolveUserTeamId(req.user);

    let submission = null;
    try {
      submission = await Submission.findOne({ teamId });
    } catch (dbErr) {
      // Fallback to memory
      submission = mockSubmissionsMap.get(teamId);
    }

    if (!submission) {
      submission = {
        teamId,
        startupName: '',
        tagline: '',
        logoUrl: '',
        visitingCardUrl: '',
        posterUrl: '',
        linkedinBannerUrl: '',
        githubUrl: '',
        deployedUrl: '',
        videoUrl: '',
        pitchDeckUrl: '',
        businessModel: '',
        finalPitchNotes: '',
        submissionStatus: 'NOT_STARTED',
        isFinal: false,
        submittedAt: null,
      };
    }

    return successResponse(res, {
      submission,
      userRole: req.user.role,
      isTeamLead: (req.user.role || '').toLowerCase() === 'team_lead',
    }, 'Submission details retrieved successfully');
  } catch (err) {
    return errorResponse(res, 'Failed to fetch submission details', 500, err);
  }
};

/**
 * PUT /api/submissions/me
 * Save/update submission deliverables draft (TEAM_LEAD only, editable before final lock)
 */
exports.saveDraft = async (req, res) => {
  try {
    const userRole = (req.user.role || '').toLowerCase();
    if (userRole !== 'team_lead') {
      return errorResponse(res, 'Access forbidden: Only Team Lead can modify team submissions', 403);
    }

    const teamId = await resolveUserTeamId(req.user);
    let submission = null;

    try {
      submission = await Submission.findOne({ teamId });
    } catch (dbErr) {
      submission = mockSubmissionsMap.get(teamId);
    }

    if (submission && (submission.submissionStatus === 'LOCKED' || submission.submissionStatus === 'SUBMITTED' || submission.isFinal)) {
      return errorResponse(res, 'Submission is locked and cannot be modified', 400);
    }

    const payload = {
      teamId,
      startupName: req.body.startupName ?? submission?.startupName ?? '',
      tagline: req.body.tagline ?? submission?.tagline ?? '',
      logoUrl: req.body.logoUrl ?? submission?.logoUrl ?? '',
      visitingCardUrl: req.body.visitingCardUrl ?? submission?.visitingCardUrl ?? '',
      posterUrl: req.body.posterUrl ?? submission?.posterUrl ?? '',
      linkedinBannerUrl: req.body.linkedinBannerUrl ?? submission?.linkedinBannerUrl ?? '',
      githubUrl: req.body.githubUrl ?? submission?.githubUrl ?? '',
      deployedUrl: req.body.deployedUrl ?? submission?.deployedUrl ?? '',
      videoUrl: req.body.videoUrl ?? submission?.videoUrl ?? '',
      pitchDeckUrl: req.body.pitchDeckUrl ?? submission?.pitchDeckUrl ?? '',
      businessModel: req.body.businessModel ?? submission?.businessModel ?? '',
      finalPitchNotes: req.body.finalPitchNotes ?? submission?.finalPitchNotes ?? '',
      submissionStatus: 'IN_PROGRESS',
      isFinal: false,
    };

    try {
      submission = await Submission.findOneAndUpdate(
        { teamId },
        { $set: payload },
        { new: true, upsert: true }
      );
    } catch (dbErr) {
      mockSubmissionsMap.set(teamId, payload);
      submission = payload;
    }

    return successResponse(res, submission, 'Submission draft saved successfully');
  } catch (err) {
    return errorResponse(res, 'Failed to save submission draft', 500, err);
  }
};

/**
 * POST /api/submissions/final-submit
 * Perform final submission & lock deliverable modifications (TEAM_LEAD only)
 */
exports.submitFinal = async (req, res) => {
  try {
    const userRole = (req.user.role || '').toLowerCase();
    if (userRole !== 'team_lead') {
      return errorResponse(res, 'Access forbidden: Only Team Lead can perform final submission', 403);
    }

    const teamId = await resolveUserTeamId(req.user);
    let submission = null;

    try {
      submission = await Submission.findOne({ teamId });
    } catch (dbErr) {
      submission = mockSubmissionsMap.get(teamId);
    }

    if (submission && (submission.submissionStatus === 'LOCKED' || submission.submissionStatus === 'SUBMITTED' || submission.isFinal)) {
      return errorResponse(res, 'Submission is already finalized and locked', 400);
    }

    // Merge request body with existing submission fields
    const currentData = {
      logoUrl: req.body.logoUrl || submission?.logoUrl || '',
      visitingCardUrl: req.body.visitingCardUrl || submission?.visitingCardUrl || '',
      posterUrl: req.body.posterUrl || submission?.posterUrl || '',
      linkedinBannerUrl: req.body.linkedinBannerUrl || submission?.linkedinBannerUrl || '',
      githubUrl: req.body.githubUrl || submission?.githubUrl || '',
      deployedUrl: req.body.deployedUrl || submission?.deployedUrl || '',
      videoUrl: req.body.videoUrl || submission?.videoUrl || '',
      pitchDeckUrl: req.body.pitchDeckUrl || submission?.pitchDeckUrl || '',
      businessModel: req.body.businessModel || submission?.businessModel || '',
      finalPitchNotes: req.body.finalPitchNotes || submission?.finalPitchNotes || '',
      startupName: req.body.startupName || submission?.startupName || '',
      tagline: req.body.tagline || submission?.tagline || '',
    };

    // Validate 7 mandatory deliverables
    const missingFields = [];
    if (!currentData.logoUrl.trim()) missingFields.push('Logo URL');
    if (!currentData.visitingCardUrl.trim()) missingFields.push('Visiting Card URL');
    if (!currentData.posterUrl.trim()) missingFields.push('Poster / Show Banner URL');
    if (!currentData.linkedinBannerUrl.trim()) missingFields.push('LinkedIn Banner URL');
    if (!currentData.githubUrl.trim()) missingFields.push('GitHub Repository URL');
    if (!currentData.deployedUrl.trim()) missingFields.push('Deployed Website URL');
    if (!currentData.videoUrl.trim()) missingFields.push('5-Minute Video URL');

    if (missingFields.length > 0) {
      return errorResponse(
        res,
        `Cannot submit: missing required deliverables (${missingFields.join(', ')})`,
        400
      );
    }

    const finalPayload = {
      ...currentData,
      teamId,
      submissionStatus: 'LOCKED',
      isFinal: true,
      submittedAt: new Date(),
    };

    try {
      submission = await Submission.findOneAndUpdate(
        { teamId },
        { $set: finalPayload },
        { new: true, upsert: true }
      );
      await Team.findByIdAndUpdate(teamId, { isLocked: true });
    } catch (dbErr) {
      mockSubmissionsMap.set(teamId, finalPayload);
      submission = finalPayload;
    }

    return successResponse(
      res,
      submission,
      'Your startup has been submitted successfully.'
    );
  } catch (err) {
    return errorResponse(res, 'Failed to process final submission', 500, err);
  }
};
