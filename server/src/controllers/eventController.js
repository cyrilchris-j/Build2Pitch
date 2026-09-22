const EventSettings = require('../models/EventSettings');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * GET /api/event/settings
 * Returns the current event settings (public endpoint for countdown etc.)
 */
exports.getSettings = async (req, res) => {
  try {
    let settings = await EventSettings.findOne().sort({ createdAt: -1 }).lean();

    if (!settings) {
      // Return default settings if none exist
      settings = {
        eventName: 'NEXTGEN',
        tagline: "Shape What's Next.",
        startTime: null,
        endTime: null,
        registrationOpen: true,
        challengeOpen: false,
        submissionOpen: false,
        maxTeamSize: 6,
        maxIdeaAttempts: 2,
        bannerNotice: null,
      };
    }

    return successResponse(res, settings, 'Event settings retrieved');
  } catch (error) {
    console.error('[Event Settings Error]:', error);
    return errorResponse(res, error.message || 'Server error retrieving event settings', 500);
  }
};

/**
 * PUT /api/event/settings
 * Update event settings — Admin only
 */
exports.updateSettings = async (req, res) => {
  try {
    const {
      eventName,
      tagline,
      startTime,
      endTime,
      registrationOpen,
      challengeOpen,
      submissionOpen,
      maxTeamSize,
      maxIdeaAttempts,
      bannerNotice,
    } = req.body;

    const updateData = {};
    if (eventName !== undefined) updateData.eventName = eventName;
    if (tagline !== undefined) updateData.tagline = tagline;
    if (startTime !== undefined) updateData.startTime = startTime ? new Date(startTime) : null;
    if (endTime !== undefined) updateData.endTime = endTime ? new Date(endTime) : null;
    if (registrationOpen !== undefined) updateData.registrationOpen = Boolean(registrationOpen);
    if (challengeOpen !== undefined) updateData.challengeOpen = Boolean(challengeOpen);
    if (submissionOpen !== undefined) updateData.submissionOpen = Boolean(submissionOpen);
    if (maxTeamSize !== undefined) updateData.maxTeamSize = Number(maxTeamSize);
    if (maxIdeaAttempts !== undefined) updateData.maxIdeaAttempts = Number(maxIdeaAttempts);
    if (bannerNotice !== undefined) updateData.bannerNotice = bannerNotice || null;

    const settings = await EventSettings.findOneAndUpdate(
      {},
      { $set: updateData },
      { new: true, upsert: true }
    );

    return successResponse(res, settings, 'Event settings updated successfully');
  } catch (error) {
    console.error('[Update Event Settings Error]:', error);
    return errorResponse(res, error.message || 'Server error updating event settings', 500);
  }
};
