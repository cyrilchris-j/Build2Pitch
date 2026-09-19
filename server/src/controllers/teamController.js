const { successResponse } = require('../utils/response');

/**
 * Team Controller Placeholders
 */

exports.getTeamDashboard = async (req, res) => {
  return successResponse(res, {
    team: {
      id: 'team_001',
      teamNumber: 12,
      name: 'CyberPulse Innovations',
      teamCode: 'CYBER-12',
      isLocked: false,
      membersCount: 6,
      tableNumber: 'T-14',
    },
    ideaAssignment: {
      isRevealed: true,
      ideaTitle: 'Decentralized Micro-Grid Energy Balancing',
      industry: 'CleanTech / Energy',
    },
    submissionStatus: {
      submitted: false,
      isFinal: false,
    },
  }, 'Team dashboard data retrieved (Mock)');
};

exports.getMembers = async (req, res) => {
  return successResponse(res, [
    { id: 'm1', name: 'Alex Rivera', email: 'alex@pitch.dev', role: 'leader', joinedAt: new Date() },
    { id: 'm2', name: 'Devin Chen', email: 'devin@pitch.dev', role: 'developer', joinedAt: new Date() },
    { id: 'm3', name: 'Sarah Connor', email: 'sarah@pitch.dev', role: 'designer', joinedAt: new Date() },
    { id: 'm4', name: 'Liam Patel', email: 'liam@pitch.dev', role: 'pitcher', joinedAt: new Date() },
    { id: 'm5', name: 'Zoe Vance', email: 'zoe@pitch.dev', role: 'researcher', joinedAt: new Date() },
    { id: 'm6', name: 'Marcus Brody', email: 'marcus@pitch.dev', role: 'marketer', joinedAt: new Date() },
  ], 'Team members roster retrieved (Mock)');
};

exports.addMember = async (req, res) => {
  return successResponse(res, {
    id: `m_${Date.now()}`,
    name: req.body?.name || 'New Member',
    email: req.body?.email || 'newmember@pitch.dev',
    role: req.body?.role || 'developer',
    joinedAt: new Date(),
  }, 'Team member registered successfully (Mock)', 201);
};

exports.getAssignedIdea = async (req, res) => {
  return successResponse(res, {
    ideaId: 'idea_42',
    title: 'Autonomous Localized EV Fleet Optimizer',
    industry: 'Mobility & AI',
    problemStatement: 'Commercial fleet managers suffer 34% battery degradation due to uncoordinated peak charging.',
    targetAudience: 'Municipal delivery fleets and logistics operators',
    keyFeatures: [
      'Smart routing with depot grid load-sensing',
      'Dynamic overnight charging arbitration',
      'Battery longevity predictive telemetry',
    ],
    revenueModel: 'SaaS B2B subscription per vehicle managed',
  }, 'Assigned startup idea retrieved (Mock)');
};
