const { successResponse, errorResponse } = require('../utils/response');

/**
 * Auth Controller Placeholders
 */

exports.login = async (req, res) => {
  return successResponse(res, {
    token: 'placeholder_jwt_token',
    user: {
      id: 'mock_user_1',
      name: 'Test Team Leader',
      email: req.body?.email || 'leader@build2pitch.dev',
      role: 'team_lead',
    },
  }, 'Auth placeholder: login successful (Mock)');
};

exports.register = async (req, res) => {
  return successResponse(res, {
    user: {
      id: 'mock_user_2',
      name: req.body?.name || 'New Leader',
      email: req.body?.email || 'new@build2pitch.dev',
      role: 'team_lead',
    },
    team: {
      id: 'mock_team_1',
      name: req.body?.teamName || 'Venture Forge',
      teamCode: 'B2P-101',
      members: [],
    },
  }, 'Auth placeholder: registration successful (Mock)', 201);
};

exports.memberLogin = async (req, res) => {
  return successResponse(res, {
    token: 'placeholder_member_token',
    user: {
      id: 'mock_member_1',
      name: 'Team Member',
      role: 'member',
    },
  }, 'Auth placeholder: member login successful (Mock)');
};

exports.getProfile = async (req, res) => {
  return successResponse(res, {
    id: 'mock_user_1',
    name: 'Active User',
    email: 'user@build2pitch.dev',
    role: 'team_lead',
  }, 'User profile retrieved (Mock)');
};
