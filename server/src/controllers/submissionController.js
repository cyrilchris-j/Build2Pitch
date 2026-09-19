const { successResponse } = require('../utils/response');

/**
 * Submission Controller Placeholders
 */

exports.getSubmission = async (req, res) => {
  return successResponse(res, {
    teamId: 'team_001',
    startupName: 'VoltMesh',
    tagline: 'Predictive fleet electrification at scale',
    pitchDeckUrl: 'https://pitch.dev/decks/voltmesh.pdf',
    liveDemoUrl: 'https://voltmesh.vercel.app',
    githubUrl: 'https://github.com/voltmesh/prototype',
    techStack: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS'],
    isFinal: false,
    submittedAt: new Date(),
  }, 'Submission status retrieved (Mock)');
};

exports.saveDraft = async (req, res) => {
  return successResponse(res, {
    ...req.body,
    isFinal: false,
    updatedAt: new Date(),
  }, 'Deliverable draft saved successfully (Mock)');
};

exports.submitFinal = async (req, res) => {
  return successResponse(res, {
    ...req.body,
    isFinal: true,
    lockedAt: new Date(),
  }, 'Final deliverable locked and submitted for judging (Mock)', 201);
};
