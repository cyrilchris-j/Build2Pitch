const bcrypt = require('bcryptjs');
const Team = require('../models/Team');
const User = require('../models/User');
const StartupIdea = require('../models/StartupIdea');
const IdeaAssignment = require('../models/IdeaAssignment');
const Submission = require('../models/Submission');
const ActivityLog = require('../models/ActivityLog');
const { successResponse, errorResponse } = require('../utils/response');
const { normalizeRole } = require('../middleware/auth');

/**
 * GET /api/teams/me
 * Returns full team dashboard payload for the authenticated Team Lead
 */
exports.getTeamDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the team led by this user or where user is a member
    let team = await Team.findOne({ leaderId: userId })
      .populate('leaderId', 'name email registerNumber mobile gender section role')
      .lean();

    if (!team && req.user.teamId) {
      team = await Team.findById(req.user.teamId)
        .populate('leaderId', 'name email registerNumber mobile gender section role')
        .lean();
    }

    if (!team) {
      return successResponse(res, {
        team: null,
        ideaAssignment: null,
        submissionStatus: null,
      }, 'No team found for this user');
    }

    // Get idea assignment
    let ideaAssignment = null;
    if (team.ideaAssignment && team.ideaAssignment.ideaId) {
      ideaAssignment = team.ideaAssignment;
    } else {
      // Check IdeaAssignment collection using team string ID (used by dice flow)
      const assignment = await IdeaAssignment.findOne({ teamId: team._id.toString() }).lean();
      if (assignment) {
        const idea = await StartupIdea.findById(assignment.ideaId).lean();
        if (idea) {
          ideaAssignment = {
            ideaId: idea._id,
            ideaTitle: idea.title,
            industry: idea.category || idea.industry || '',
            isRevealed: assignment.status === 'LOCKED',
            assignedAt: assignment.selectedAt,
          };
        }
      }
    }

    // Get submission status
    let submissionStatus = { submitted: false, isFinal: false };
    const submission = await Submission.findOne({ teamId: team._id }).lean();
    if (submission) {
      submissionStatus = {
        submitted: submission.isFinal || submission.submissionStatus === 'LOCKED',
        isFinal: Boolean(submission.isFinal),
        submissionStatus: submission.submissionStatus,
      };
    }

    return successResponse(res, {
      team: {
        id: team._id.toString(),
        teamNumber: team.teamNumber,
        name: team.name,
        teamCode: team.teamCode,
        isLocked: team.isLocked,
        membersCount: Array.isArray(team.members) ? team.members.length : 0,
        tableNumber: team.tableNumber,
        leaderId: team.leaderId,
      },
      ideaAssignment,
      submissionStatus,
    }, 'Team dashboard data retrieved');
  } catch (error) {
    console.error('[Team Dashboard Error]:', error);
    return errorResponse(res, error.message || 'Server error fetching team dashboard', 500);
  }
};

/**
 * GET /api/teams/me/members
 * Returns the team member roster for the authenticated user's team
 */
exports.getMembers = async (req, res) => {
  try {
    const userId = req.user.id;

    let team = await Team.findOne({ leaderId: userId }).lean();
    if (!team && req.user.teamId) {
      team = await Team.findById(req.user.teamId).lean();
    }

    if (!team) {
      return successResponse(res, [], 'No team found');
    }

    // Enrich members with User collection data
    const enrichedMembers = await Promise.all(
      (team.members || []).map(async (member) => {
        if (member.userId) {
          const userRecord = await User.findById(member.userId)
            .select('name email registerNumber mobile gender section role isActive')
            .lean();
          if (userRecord) {
            return {
              id: member._id ? member._id.toString() : member.userId.toString(),
              userId: member.userId.toString(),
              name: userRecord.name || member.name,
              email: userRecord.email || member.email,
              role: member.role,
              registerNumber: userRecord.registerNumber || member.registerNumber || '',
              mobile: userRecord.mobile || member.mobileNumber || '',
              gender: userRecord.gender || member.gender || '',
              section: userRecord.section || member.section || '',
              userRole: userRecord.role,
              joinedAt: member.joinedAt,
            };
          }
        }
        return {
          id: member._id ? member._id.toString() : member.email,
          userId: member.userId ? member.userId.toString() : null,
          name: member.name,
          email: member.email,
          role: member.role,
          registerNumber: member.registerNumber || '',
          mobile: member.mobileNumber || member.mobile || '',
          gender: member.gender || '',
          section: member.section || '',
          joinedAt: member.joinedAt,
        };
      })
    );

    return successResponse(res, enrichedMembers, 'Team members roster retrieved');
  } catch (error) {
    console.error('[Get Members Error]:', error);
    return errorResponse(res, error.message || 'Server error fetching members', 500);
  }
};

/**
 * POST /api/teams/me/members
 * Add a new team member — Team Lead only
 * Creates a User record with hashed password, then adds to Team.members
 */
exports.addMember = async (req, res) => {
  try {
    const userRole = normalizeRole(req.user.role);
    if (userRole !== 'TEAM_LEAD') {
      return errorResponse(res, 'Only Team Lead can add team members', 403);
    }

    const userId = req.user.id;
    const { name, registerNumber, email, mobile, gender, section, password } = req.body;

    // Field validation
    if (!name || !email || !password) {
      return errorResponse(res, 'Name, email, and password are required', 400);
    }
    if (!registerNumber || !mobile || !gender || !section) {
      return errorResponse(res, 'Register number, mobile, gender, and section are required', 400);
    }
    if (password.length < 6) {
      return errorResponse(res, 'Member password must be at least 6 characters', 400);
    }

    // Find team
    let team = await Team.findOne({ leaderId: userId });
    if (!team && req.user.teamId) {
      team = await Team.findById(req.user.teamId);
    }
    if (!team) {
      return errorResponse(res, 'Team not found. Please re-login.', 404);
    }

    // Max 6 members (including lead)
    const currentCount = team.members ? team.members.length : 0;
    if (currentCount >= 6) {
      return errorResponse(res, 'Team already has 6 members. Maximum team size reached.', 409);
    }
    // The lead is already member[0], so we can add up to 5 more = 6 total
    if (currentCount >= 6) {
      return errorResponse(res, 'Cannot add more than 5 team members (6 total including Team Lead)', 409);
    }

    // Check for duplicate email in User collection
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return errorResponse(res, `Email ${email} is already registered`, 409);
    }

    // Check for duplicate registerNumber
    if (registerNumber) {
      const existingReg = await User.findOne({ registerNumber: registerNumber.trim() });
      if (existingReg) {
        return errorResponse(res, `Register number ${registerNumber} is already registered`, 409);
      }
    }

    // Check for duplicate email within team
    const emailInTeam = team.members.some(
      (m) => m.email.toLowerCase() === email.toLowerCase().trim()
    );
    if (emailInTeam) {
      return errorResponse(res, 'This email is already in your team', 409);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create the member User record
    const newUser = new User({
      name: name.trim(),
      registerNumber: registerNumber.trim(),
      email: email.toLowerCase().trim(),
      mobile: mobile.trim(),
      gender: gender.toUpperCase(),
      section: section.trim(),
      passwordHash,
      role: 'TEAM_MEMBER',
      teamId: team._id,
      isActive: true,
    });
    await newUser.save();

    // Add to team members array
    const memberEntry = {
      name: newUser.name,
      email: newUser.email,
      role: 'developer',
      userId: newUser._id,
      registerNumber: newUser.registerNumber,
      mobileNumber: newUser.mobile,
      gender: newUser.gender,
      section: newUser.section,
      joinedAt: new Date(),
    };
    team.members.push(memberEntry);
    await team.save();

    // Log activity
    try {
      await ActivityLog.create({
        userId: req.user.id,
        teamId: team._id,
        action: 'MEMBER_ADDED',
        metadata: { memberEmail: newUser.email, memberName: newUser.name },
      });
    } catch (_) { /* non-critical */ }

    return successResponse(
      res,
      {
        id: newUser._id.toString(),
        userId: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        registerNumber: newUser.registerNumber,
        mobile: newUser.mobile,
        gender: newUser.gender,
        section: newUser.section,
        role: 'developer',
        joinedAt: new Date(),
        totalMembers: team.members.length,
      },
      'Team member added successfully',
      201
    );
  } catch (error) {
    console.error('[Add Member Error]:', error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || 'field';
      return errorResponse(res, `Duplicate ${field}: this value is already registered`, 409);
    }
    return errorResponse(res, error.message || 'Server error adding team member', 500);
  }
};

/**
 * DELETE /api/teams/me/members/:memberId
 * Remove a team member — Team Lead only
 */
exports.removeMember = async (req, res) => {
  try {
    const userRole = normalizeRole(req.user.role);
    if (userRole !== 'TEAM_LEAD') {
      return errorResponse(res, 'Only Team Lead can remove team members', 403);
    }

    const { memberId } = req.params;
    const userId = req.user.id;

    let team = await Team.findOne({ leaderId: userId });
    if (!team && req.user.teamId) {
      team = await Team.findById(req.user.teamId);
    }
    if (!team) {
      return errorResponse(res, 'Team not found', 404);
    }

    // Find the member entry
    const memberIndex = team.members.findIndex(
      (m) =>
        m._id?.toString() === memberId ||
        m.userId?.toString() === memberId ||
        m.email === memberId
    );
    if (memberIndex === -1) {
      return errorResponse(res, 'Team member not found', 404);
    }

    const removedMember = team.members[memberIndex];

    // Don't allow removing the team lead (role === 'leader')
    if (removedMember.role === 'leader') {
      return errorResponse(res, 'Cannot remove the Team Lead from the team', 403);
    }

    // Remove from team
    team.members.splice(memberIndex, 1);
    await team.save();

    // Deactivate their user record
    if (removedMember.userId) {
      await User.findByIdAndUpdate(removedMember.userId, { isActive: false });
    }

    try {
      await ActivityLog.create({
        userId: req.user.id,
        teamId: team._id,
        action: 'MEMBER_REMOVED',
        metadata: { removedEmail: removedMember.email, removedName: removedMember.name },
      });
    } catch (_) { /* non-critical */ }

    return successResponse(res, { memberId, removed: true }, 'Team member removed successfully');
  } catch (error) {
    console.error('[Remove Member Error]:', error);
    return errorResponse(res, error.message || 'Server error removing team member', 500);
  }
};

/**
 * GET /api/teams/me/idea
 * Returns assigned idea for the authenticated user's team
 */
exports.getAssignedIdea = async (req, res) => {
  try {
    const userId = req.user.id;

    let team = await Team.findOne({ leaderId: userId }).lean();
    if (!team && req.user.teamId) {
      team = await Team.findById(req.user.teamId).lean();
    }

    if (!team) {
      return successResponse(res, null, 'No team found');
    }

    // Check IdeaAssignment collection
    const assignment = await IdeaAssignment.findOne({
      teamId: team._id.toString(),
    }).lean();

    if (!assignment) {
      return successResponse(res, null, 'No idea assigned yet');
    }

    const idea = await StartupIdea.findById(assignment.ideaId).lean();
    if (!idea) {
      return successResponse(res, null, 'Assigned idea not found');
    }

    return successResponse(
      res,
      {
        ideaId: idea._id.toString(),
        title: idea.title,
        industry: idea.category || '',
        shortDescription: idea.shortDescription || '',
        problemStatement: idea.problemStatement || '',
        targetUsers: idea.targetUsers || idea.targetAudience || '',
        difficulty: idea.difficulty || '',
        status: assignment.status,
        selectedAt: assignment.selectedAt,
      },
      'Assigned idea retrieved'
    );
  } catch (error) {
    console.error('[Get Assigned Idea Error]:', error);
    return errorResponse(res, error.message || 'Server error fetching idea', 500);
  }
};
