const { successResponse } = require('../utils/response');

/**
 * Admin Controller Placeholders
 */

exports.getStats = async (req, res) => {
  return successResponse(res, {
    totalTeams: 24,
    totalStudents: 144,
    ideasTotal: 30,
    ideasAssigned: 24,
    submissionsCompleted: 18,
    eventPhase: 'building',
    countdownRemainingSeconds: 14400, // 4 hours
  }, 'Admin executive statistics retrieved (Mock)');
};

exports.getTeams = async (req, res) => {
  return successResponse(res, [
    { id: 't1', teamNumber: 1, name: 'Apex AI', membersCount: 6, hasIdea: true, hasSubmitted: true },
    { id: 't2', teamNumber: 2, name: 'VoltMesh', membersCount: 6, hasIdea: true, hasSubmitted: false },
    { id: 't3', teamNumber: 3, name: 'AgriSense', membersCount: 5, hasIdea: true, hasSubmitted: false },
  ], 'All registered teams retrieved (Mock)');
};

exports.getStudents = async (req, res) => {
  return successResponse(res, [
    { id: 's1', name: 'Alex Rivera', email: 'alex@pitch.dev', team: 'Apex AI', role: 'leader' },
    { id: 's2', name: 'Devin Chen', email: 'devin@pitch.dev', team: 'VoltMesh', role: 'developer' },
    { id: 's3', name: 'Sarah Connor', email: 'sarah@pitch.dev', team: 'AgriSense', role: 'designer' },
  ], 'Student directory retrieved (Mock)');
};

exports.getIdeas = async (req, res) => {
  return successResponse(res, [
    { id: 'id1', title: 'Solar Decentralized Grid', industry: 'Energy', isAssigned: true },
    { id: 'id2', title: 'Synthetic Biotech Enzymes', industry: 'BioTech', isAssigned: true },
  ], 'Idea repository retrieved (Mock)');
};

exports.getSubmissions = async (req, res) => {
  return successResponse(res, [
    {
      id: 'sub1',
      teamName: 'Apex AI',
      startupName: 'Apex Agentic Copilot',
      pitchDeckUrl: 'https://pitch.dev/deck1.pdf',
      demoUrl: 'https://apex.dev',
      isFinal: true,
      score: 92,
    },
  ], 'Submissions pipeline retrieved (Mock)');
};

exports.updateSettings = async (req, res) => {
  return successResponse(res, {
    ...req.body,
    updatedAt: new Date(),
  }, 'Event settings updated successfully (Mock)');
};
