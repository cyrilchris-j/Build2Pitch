const bcrypt = require('bcryptjs');
const Team = require('../models/Team');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/response');

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobilePattern = /^\+?[0-9]{10,15}$/;
const getUserId = (req) => req.user?.id || req.user?._id;

const validateMember = (body, { passwordRequired = true } = {}) => {
  const required = ['name', 'registerNumber', 'email', 'mobile', 'gender', 'section'];
  const missing = required.filter((field) => !String(body?.[field] || '').trim());
  if (passwordRequired && !String(body?.password || '').trim()) missing.push('password');
  if (missing.length) return `Missing required fields: ${missing.join(', ')}`;
  if (!emailPattern.test(body.email)) return 'Please provide a valid email address';
  if (!mobilePattern.test(body.mobile.replace(/[\s()-]/g, ''))) return 'Please provide a valid mobile number';
  if (!['male', 'female'].includes(String(body.gender).toLowerCase())) return 'Gender must be male or female';
  return null;
};

const findTeam = async (req) => {
  const userId = getUserId(req);
  if (!userId) return null;
  return Team.findOne({ $or: [{ leaderId: userId }, { 'members.userId': userId }] });
};

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  registerNumber: user.registerNumber,
  email: user.email,
  mobile: user.mobile,
  gender: user.gender,
  section: user.section,
  role: user.role,
});

const teamView = async (team) => {
  const leader = await User.findById(team.leaderId).select('-password');
  return {
    ...team.toObject(),
    id: team._id,
    leader: leader ? publicUser(leader) : null,
    members: team.members.map((member) => ({ ...member.toObject(), id: member._id })),
    membersCount: 1 + team.members.length,
    maxMembers: 6,
  };
};

const ensureLead = (req, res) => {
  if (!req.user || req.user.role !== 'team_lead') {
    errorResponse(res, 'Only the Team Lead can modify team data', 403);
    return false;
  }
  return true;
};

exports.createTeam = async (req, res) => {
  if (!ensureLead(req, res)) return;
  const leaderId = getUserId(req);
  const { name } = req.body || {};
  if (!name?.trim()) return errorResponse(res, 'Team name is required', 400);
  const leader = await User.findById(leaderId);
  if (!leader) return errorResponse(res, 'Authenticated Team Lead was not found', 401);
  if (leader.teamId) return errorResponse(res, 'You already belong to a team', 409);
  const leaderError = validateMember(req.body, { passwordRequired: false });
  if (leaderError) return errorResponse(res, leaderError, 400);
  const duplicate = await User.findOne({
    $or: [{ email: req.body.email.toLowerCase() }, { registerNumber: req.body.registerNumber.toUpperCase() }],
    _id: { $ne: leader._id },
  });
  if (duplicate) return errorResponse(res, 'Register number or email is already in use', 409);
  leader.name = req.body.name;
  leader.email = req.body.email.toLowerCase();
  leader.registerNumber = req.body.registerNumber.toUpperCase();
  leader.mobile = req.body.mobile;
  leader.gender = req.body.gender.toLowerCase();
  leader.section = req.body.section;
  await leader.save();
  const team = await Team.create({
    teamNumber: (await Team.countDocuments()) + 1,
    name: name.trim(),
    teamCode: `B2P-${Date.now().toString(36).slice(-6)}`,
    leaderId: leader._id,
  });
  leader.teamId = team._id;
  await leader.save();
  return successResponse(res, await teamView(team), 'Team created successfully', 201);
};

exports.getTeam = async (req, res) => {
  const team = await findTeam(req);
  if (!team) return errorResponse(res, 'You do not belong to a team', 404);
  return successResponse(res, await teamView(team), 'Team retrieved successfully');
};

exports.addMember = async (req, res) => {
  if (!ensureLead(req, res)) return;
  const team = await findTeam(req);
  if (!team) return errorResponse(res, 'Team not found', 404);
  if (team.isLocked) return errorResponse(res, 'The team is locked', 409);
  if (team.members.length >= 5) return errorResponse(res, 'A team can have a maximum of 5 members besides the Team Lead', 400);
  const validationError = validateMember(req.body);
  if (validationError) return errorResponse(res, validationError, 400);
  const email = req.body.email.toLowerCase();
  const registerNumber = req.body.registerNumber.toUpperCase();
  const duplicate = await User.findOne({ $or: [{ email }, { registerNumber }] });
  if (duplicate) return errorResponse(res, 'Register number or email is already in use', 409);
  const user = await User.create({
    name: req.body.name.trim(), email, registerNumber, mobile: req.body.mobile,
    gender: req.body.gender.toLowerCase(), section: req.body.section.trim(),
    password: await bcrypt.hash(req.body.password, 12), role: 'member', teamId: team._id,
  });
  team.members.push({
    userId: user._id, name: user.name, registerNumber, email, mobile: user.mobile,
    gender: user.gender, section: user.section,
  });
  await team.save();
  return successResponse(res, await teamView(team), 'Team member added successfully', 201);
};

exports.updateMember = async (req, res) => {
  if (!ensureLead(req, res)) return;
  const team = await findTeam(req);
  if (!team) return errorResponse(res, 'Team not found', 404);
  if (team.isLocked) return errorResponse(res, 'The team is locked', 409);
  const member = team.members.id(req.params.id);
  if (!member) return errorResponse(res, 'Team member not found', 404);
  const validationError = validateMember(req.body, { passwordRequired: false });
  if (validationError) return errorResponse(res, validationError, 400);
  const email = req.body.email.toLowerCase();
  const registerNumber = req.body.registerNumber.toUpperCase();
  const duplicate = await User.findOne({ $or: [{ email }, { registerNumber }], _id: { $ne: member.userId } });
  if (duplicate) return errorResponse(res, 'Register number or email is already in use', 409);
  Object.assign(member, { name: req.body.name.trim(), registerNumber, email, mobile: req.body.mobile,
    gender: req.body.gender.toLowerCase(), section: req.body.section.trim() });
  const user = await User.findById(member.userId);
  if (user) {
    Object.assign(user, { name: member.name, registerNumber, email, mobile: member.mobile, gender: member.gender, section: member.section });
    if (req.body.password) user.password = await bcrypt.hash(req.body.password, 12);
    await user.save();
  }
  await team.save();
  return successResponse(res, await teamView(team), 'Team member updated successfully');
};

exports.removeMember = async (req, res) => {
  if (!ensureLead(req, res)) return;
  const team = await findTeam(req);
  if (!team) return errorResponse(res, 'Team not found', 404);
  if (team.isLocked) return errorResponse(res, 'The team is locked', 409);
  const member = team.members.id(req.params.id);
  if (!member) return errorResponse(res, 'Team member not found', 404);
  const remainingGenders = team.members.filter((item) => String(item._id) !== String(member._id)).map((item) => item.gender);
  const leader = await User.findById(team.leaderId);
  if (!leader || !remainingGenders.includes(leader.gender)) return errorResponse(res, 'The team must contain at least one male and one female', 400);
  team.members.pull(member._id);
  await team.save();
  await User.findByIdAndDelete(member.userId);
  return successResponse(res, await teamView(team), 'Team member removed successfully');
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
