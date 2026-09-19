const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');
const Team = require('../models/Team');
const { successResponse, errorResponse } = require('../utils/response');
const { normalizeRole } = require('../middleware/auth');

/**
 * Generate a JWT token for a user
 */
const generateToken = (user, teamId = null) => {
  return jwt.sign(
    {
      id: user._id || user.id,
      email: user.email,
      role: normalizeRole(user.role),
      teamId: teamId || user.teamId || null,
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Generate a unique team code (e.g. B2P-8492)
 */
const generateUniqueTeamCode = async () => {
  let unique = false;
  let code = '';
  while (!unique) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    code = `B2P-${randomNum}`;
    const existing = await Team.findOne({ teamCode: code });
    if (!existing) unique = true;
  }
  return code;
};

/**
 * 1. Team Lead Registration
 * POST /api/auth/register
 * 
 * Fields:
 * - name
 * - registerNumber
 * - email
 * - mobile
 * - gender
 * - section
 * - password
 * - confirmPassword
 * - teamName
 * 
 * Automatically logs the Team Lead in, returns JWT & Team, redirects to /team/dashboard.
 */
exports.register = async (req, res) => {
  try {
    const {
      name,
      registerNumber,
      email,
      mobile,
      gender,
      section,
      password,
      confirmPassword,
      teamName,
    } = req.body;

    // Field presence validation
    if (!name || !email || !password || !teamName) {
      return errorResponse(res, 'Name, email, password, and teamName are required', 400);
    }

    if (!registerNumber || !mobile || !gender || !section) {
      return errorResponse(res, 'Register number, mobile, gender, and section are required for Team Lead registration', 400);
    }

    // Password confirmation & strength
    if (password !== confirmPassword) {
      return errorResponse(res, 'Password and Confirm Password do not match', 400);
    }

    if (password.length < 6) {
      return errorResponse(res, 'Password must be at least 6 characters long', 400);
    }

    // Check if email is already taken
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return errorResponse(res, 'An account with this email address already exists', 400);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Calculate team number
    const highestTeam = await Team.findOne().sort({ teamNumber: -1 }).select('teamNumber');
    const nextTeamNumber = highestTeam ? (highestTeam.teamNumber || 0) + 1 : 1;
    const teamCode = await generateUniqueTeamCode();

    // Create Team Lead User
    const newUser = new User({
      name: name.trim(),
      registerNumber: registerNumber.trim(),
      email: email.toLowerCase().trim(),
      mobile: mobile.trim(),
      gender: gender,
      section: section.trim(),
      passwordHash,
      role: 'TEAM_LEAD',
    });

    await newUser.save();

    // Create Team for this Team Lead
    const newTeam = new Team({
      teamNumber: nextTeamNumber,
      name: teamName.trim(),
      teamCode,
      leaderId: newUser._id,
      members: [
        {
          name: newUser.name,
          email: newUser.email,
          role: 'leader',
          userId: newUser._id,
          joinedAt: new Date(),
        },
      ],
    });

    await newTeam.save();

    // Associate team with user
    newUser.teamId = newTeam._id;
    await newUser.save();

    // Generate JWT token
    const token = generateToken(newUser, newTeam._id);

    return successResponse(
      res,
      {
        token,
        user: newUser.toJSON(),
        team: newTeam,
      },
      'Team Lead registration successful. Welcome to BUILD2PITCH!',
      201
    );
  } catch (error) {
    console.error('[Auth Register Error]:', error);
    return errorResponse(res, error.message || 'Server error during registration', 500);
  }
};

/**
 * 2. Team Member Login
 * POST /api/auth/member-login
 * 
 * Fields:
 * - email
 * - password
 */
exports.memberLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Email and password are required', 400);
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    const role = normalizeRole(user.role);
    if (role !== 'TEAM_MEMBER' && role !== 'TEAM_LEAD') {
      return errorResponse(res, 'Please use the appropriate login portal for your role', 403);
    }

    let team = null;
    if (user.teamId) {
      team = await Team.findById(user.teamId);
    } else {
      // Find if member is part of any team by email
      team = await Team.findOne({ 'members.email': user.email });
      if (team && !user.teamId) {
        user.teamId = team._id;
        await user.save();
      }
    }

    const token = generateToken(user, team ? team._id : null);

    return successResponse(
      res,
      {
        token,
        user: user.toJSON(),
        team,
      },
      'Team member login successful'
    );
  } catch (error) {
    console.error('[Member Login Error]:', error);
    return errorResponse(res, error.message || 'Server error during member login', 500);
  }
};

/**
 * 3. Admin Login
 * POST /api/auth/admin-login
 * 
 * Fields:
 * - email
 * - password
 * 
 * Note: Strictly enforces ADMIN role. No public registration exists.
 */
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Admin email and password are required', 400);
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return errorResponse(res, 'Invalid admin credentials', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid admin credentials', 401);
    }

    const role = normalizeRole(user.role);
    if (role !== 'ADMIN') {
      return errorResponse(res, 'Access denied: User does not have Administrator privileges', 403);
    }

    const token = generateToken(user, null);

    return successResponse(
      res,
      {
        token,
        user: user.toJSON(),
      },
      'Admin authentication successful'
    );
  } catch (error) {
    console.error('[Admin Login Error]:', error);
    return errorResponse(res, error.message || 'Server error during admin login', 500);
  }
};

/**
 * General / Team Lead Login
 * POST /api/auth/login
 * 
 * Fields:
 * - email
 * - password
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Email and password are required', 400);
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    let team = null;
    if (user.teamId) {
      team = await Team.findById(user.teamId);
    } else {
      team = await Team.findOne({ leaderId: user._id });
    }

    const token = generateToken(user, team ? team._id : null);

    return successResponse(
      res,
      {
        token,
        user: user.toJSON(),
        team,
      },
      'Login successful'
    );
  } catch (error) {
    console.error('[Login Error]:', error);
    return errorResponse(res, error.message || 'Server error during login', 500);
  }
};

/**
 * Get Authenticated User Profile
 * GET /api/auth/me
 */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return errorResponse(res, 'User profile not found', 404);
    }

    let team = null;
    if (user.teamId) {
      team = await Team.findById(user.teamId);
    }

    return successResponse(
      res,
      {
        user: user.toJSON(),
        team,
      },
      'User profile retrieved successfully'
    );
  } catch (error) {
    console.error('[Get Profile Error]:', error);
    return errorResponse(res, error.message || 'Server error retrieving profile', 500);
  }
};

