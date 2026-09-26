const Team = require('../models/Team');
const User = require('../models/User');
const StartupIdea = require('../models/StartupIdea');
const Submission = require('../models/Submission');
const { successResponse, errorResponse } = require('../utils/response');

// Seed mock datasets for dev fallback
const mockIdeas = [
  {
    _id: 'idea_1',
    id: 'idea_1',
    title: 'Autonomous Drone Delivery Fleet',
    industry: 'Logistics / AI',
    problemStatement: 'Last-mile delivery in congested urban zones is slow and carbon intensive.',
    targetAudience: 'E-commerce platforms & medical supplies suppliers',
    keyFeatures: ['Automated flight pathing', 'Obstacle avoidance', 'Solar dock stations'],
    revenueModel: 'SaaS + Delivery fee per km',
    complexityLevel: 'advanced',
    isAssigned: true,
    assignedTeamId: 't1',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'idea_2',
    id: 'idea_2',
    title: 'AI Code Review & Security Sentinel',
    industry: 'Developer Tools',
    problemStatement: 'Security vulnerabilities slip past manual pull request reviews.',
    targetAudience: 'Enterprise software teams',
    keyFeatures: ['Static analysis LLM', 'Automated patch generation', 'CI/CD pipeline plugin'],
    revenueModel: 'Subscription per seat / repo',
    complexityLevel: 'intermediate',
    isAssigned: true,
    assignedTeamId: 't2',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'idea_3',
    id: 'idea_3',
    title: 'Decentralized Microgrid Energy Exchange',
    industry: 'CleanTech',
    problemStatement: 'Solar home owners cannot trade surplus power directly with neighbors.',
    targetAudience: 'Residential solar owners',
    keyFeatures: ['Smart contract settlement', 'Grid balancing IoT meter', 'Peer-to-peer mobile app'],
    revenueModel: 'Transaction commission',
    complexityLevel: 'advanced',
    isAssigned: false,
    createdAt: new Date().toISOString(),
  },
];

const mockTeams = [
  {
    _id: 't1',
    id: 't1',
    teamNumber: 1,
    name: 'Apex Innovators',
    teamCode: 'B2P-001',
    leaderId: 's1',
    isLocked: true,
    tableNumber: 'Table A-1',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    leader: {
      name: 'Sarah Connor',
      email: 'sarah.c@build2pitch.dev',
      registerNumber: 'REG-2026-001',
      mobileNumber: '+1 555-0192',
      gender: 'Female',
      section: 'CS-A',
    },
    members: [
      { id: 's1', name: 'Sarah Connor', email: 'sarah.c@build2pitch.dev', role: 'leader', registerNumber: 'REG-2026-001', mobileNumber: '+1 555-0192', gender: 'Female', section: 'CS-A' },
      { id: 's2', name: 'Alex Mercer', email: 'alex.m@build2pitch.dev', role: 'developer', registerNumber: 'REG-2026-002', mobileNumber: '+1 555-0193', gender: 'Male', section: 'CS-A' },
      { id: 's3', name: 'Elena Rostova', email: 'elena.r@build2pitch.dev', role: 'designer', registerNumber: 'REG-2026-003', mobileNumber: '+1 555-0194', gender: 'Female', section: 'CS-B' },
    ],
    ideaAssignment: {
      ideaTitle: 'Autonomous Drone Delivery Fleet',
      industry: 'Logistics / AI',
      assignedAt: new Date(Date.now() - 70000000).toISOString(),
    },
    submissionStatus: 'SUBMITTED',
  },
  {
    _id: 't2',
    id: 't2',
    teamNumber: 2,
    name: 'Venture Forge',
    teamCode: 'B2P-002',
    leaderId: 's4',
    isLocked: false,
    tableNumber: 'Table B-4',
    createdAt: new Date(Date.now() - 43200000).toISOString(),
    leader: {
      name: 'Marcus Brody',
      email: 'marcus.b@build2pitch.dev',
      registerNumber: 'REG-2026-004',
      mobileNumber: '+1 555-0195',
      gender: 'Male',
      section: 'IT-A',
    },
    members: [
      { id: 's4', name: 'Marcus Brody', email: 'marcus.b@build2pitch.dev', role: 'leader', registerNumber: 'REG-2026-004', mobileNumber: '+1 555-0195', gender: 'Male', section: 'IT-A' },
      { id: 's5', name: 'Devin Chen', email: 'devin.c@build2pitch.dev', role: 'pitcher', registerNumber: 'REG-2026-005', mobileNumber: '+1 555-0196', gender: 'Male', section: 'IT-A' },
    ],
    ideaAssignment: {
      ideaTitle: 'AI Code Review & Security Sentinel',
      industry: 'Developer Tools',
      assignedAt: new Date(Date.now() - 36000000).toISOString(),
    },
    submissionStatus: 'IN_PROGRESS',
  },
];

const mockSubmissions = [
  {
    _id: 'sub_1',
    id: 'sub_1',
    teamId: 't1',
    teamName: 'Apex Innovators',
    startupName: 'SkyRoute AI',
    tagline: 'Autonomous urban last-mile delivery network',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
    visitingCardUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73',
    posterUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0',
    linkedinBannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
    githubUrl: 'https://github.com/apex-innovators/skyroute-ai',
    deployedUrl: 'https://skyroute-ai.vercel.app',
    videoUrl: 'https://youtube.com/watch?v=mock_pitch_video',
    pitchDeckUrl: 'https://drive.google.com/file/d/mock_deck/view',
    businessModel: 'B2B API subscription + revenue share on payload deliveries',
    finalPitchNotes: 'Trained on 10,000 synthetic flight paths in Gazebo simulator.',
    submissionStatus: 'LOCKED',
    isFinal: true,
    submittedAt: new Date(Date.now() - 14400000).toISOString(),
  },
];

/**
 * GET /api/admin/stats
 * Real-time event statistics card data
 */
exports.getStats = async (req, res) => {
  try {
    let totalTeams = 0;
    let totalStudents = 0;
    let ideasAssigned = 0;
    let submitted = 0;
    let inProgress = 0;
    let incomplete = 0;

    try {
      totalTeams = await Team.countDocuments();
      totalStudents = await User.countDocuments({ role: { $ne: 'admin' } });
      ideasAssigned = await StartupIdea.countDocuments({ isAssigned: true });
      submitted = await Submission.countDocuments({
        $or: [{ submissionStatus: 'SUBMITTED' }, { submissionStatus: 'LOCKED' }, { isFinal: true }],
      });
      inProgress = await Submission.countDocuments({ submissionStatus: 'IN_PROGRESS' });
      incomplete = Math.max(0, totalTeams - submitted - inProgress);
    } catch (err) {
      totalTeams = mockTeams.length;
      totalStudents = mockTeams.reduce((acc, t) => acc + t.members.length, 0);
      ideasAssigned = mockIdeas.filter((i) => i.isAssigned).length;
      submitted = mockSubmissions.filter((s) => s.isFinal || s.submissionStatus === 'LOCKED').length;
      inProgress = 1;
      incomplete = Math.max(0, totalTeams - submitted - inProgress);
    }

    return successResponse(res, {
      totalTeams,
      totalStudents,
      ideasAssigned,
      submitted,
      inProgress,
      incomplete,
    }, 'Admin executive statistics retrieved successfully');
  } catch (err) {
    return errorResponse(res, 'Failed to retrieve admin stats', 500, err);
  }
};

/**
 * GET /api/admin/teams
 * Paginated team directory with filter & search
 */
exports.getTeams = async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '10', 10);
    const search = (req.query.search || '').trim().toLowerCase();
    const filter = (req.query.filter || 'all').toLowerCase();

    let teamList = [];

    try {
      const query = {};
      if (search) {
        query.$or = [
          { name: new RegExp(search, 'i') },
          { teamCode: new RegExp(search, 'i') },
        ];
      }

      const dbTeams = await Team.find(query)
        .populate('leaderId', 'name email registerNumber mobile gender section role')
        .lean();

      teamList = await Promise.all(
        dbTeams.map(async (t) => {
          const sub = await Submission.findOne({ teamId: t._id }).lean();
          const leadMember = (t.members || []).find((m) => m.role === 'leader');
          const leaderData = t.leaderId || (leadMember ? {
            id: leadMember._id?.toString() || leadMember.userId?.toString(),
            name: leadMember.name,
            email: leadMember.email,
            registerNumber: leadMember.registerNumber,
            gender: leadMember.gender,
            section: leadMember.section,
            mobile: leadMember.mobileNumber,
          } : null);

          const membersList = (t.members || []).map((m) => ({
            id: m._id ? m._id.toString() : (m.userId ? m.userId.toString() : ''),
            _id: m._id ? m._id.toString() : (m.userId ? m.userId.toString() : ''),
            userId: m.userId ? m.userId.toString() : null,
            name: m.name,
            email: m.email,
            role: m.role || 'developer',
            registerNumber: m.registerNumber || '',
            gender: m.gender || '',
            section: m.section || '',
            mobileNumber: m.mobileNumber || '',
            joinedAt: m.joinedAt,
          }));

          return {
            id: t._id.toString(),
            teamNumber: t.teamNumber,
            name: t.name,
            teamCode: t.teamCode,
            leaderId: t.leaderId?._id?.toString() || (typeof t.leaderId === 'string' ? t.leaderId : (leadMember?.userId?.toString() || null)),
            leader: leaderData,
            members: membersList,
            ideaAssignment: t.ideaAssignment,
            isLocked: t.isLocked,
            tableNumber: t.tableNumber || 'Unassigned',
            submissionStatus: sub?.submissionStatus || 'NOT_STARTED',
            createdAt: t.createdAt,
          };
        })
      );
    } catch (dbErr) {
      teamList = [...mockTeams];
    }

    // Apply search filter in memory if fallback or complex search
    if (search) {
      teamList = teamList.filter(
        (t) =>
          t.name.toLowerCase().includes(search) ||
          t.teamCode.toLowerCase().includes(search) ||
          (t.leader?.name && t.leader.name.toLowerCase().includes(search))
      );
    }

    // Apply status filter
    if (filter && filter !== 'all') {
      if (filter === 'registered') {
        teamList = teamList.filter((t) => !t.ideaAssignment?.ideaTitle);
      } else if (filter === 'idea_selected') {
        teamList = teamList.filter((t) => t.ideaAssignment?.ideaTitle);
      } else if (filter === 'in_progress') {
        teamList = teamList.filter((t) => t.submissionStatus === 'IN_PROGRESS');
      } else if (filter === 'submitted') {
        teamList = teamList.filter(
          (t) => t.submissionStatus === 'SUBMITTED' || t.submissionStatus === 'LOCKED'
        );
      }
    }

    const total = teamList.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedTeams = teamList.slice(startIndex, startIndex + limit);

    return successResponse(
      res,
      paginatedTeams,
      'Teams directory retrieved successfully',
      200,
      { page, limit, total, totalPages }
    );
  } catch (err) {
    return errorResponse(res, 'Failed to fetch teams directory', 500, err);
  }
};

/**
 * GET /api/admin/students
 * Paginated student roster with search & filtering
 */
exports.getStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '10', 10);
    const search = (req.query.search || '').trim().toLowerCase();

    let studentList = [];

    try {
      const users = await User.find({ role: { $ne: 'admin' } })
        .populate('teamId', 'name teamCode leaderId')
        .lean();

      studentList = users.map((u) => ({
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        role: u.role,
        registerNumber: u.registerNumber || 'REG-' + u._id.toString().slice(-4),
        mobileNumber: u.mobileNumber || '+1 555-0100',
        gender: u.gender || 'Not Specified',
        section: u.section || 'CS-A',
        teamId: u.teamId?._id?.toString() || '',
        teamName: u.teamId?.name || 'Unassigned',
        isLeader: u.teamId?.leaderId?.toString() === u._id.toString() || u.role === 'team_lead',
      }));
    } catch (dbErr) {
      mockTeams.forEach((t) => {
        t.members.forEach((m) => {
          studentList.push({
            id: m.id || m.email,
            name: m.name,
            email: m.email,
            role: m.role,
            registerNumber: m.registerNumber || 'REG-2026',
            mobileNumber: m.mobileNumber || '+1 555-0199',
            gender: m.gender || 'Male',
            section: m.section || 'CS-A',
            teamId: t.id,
            teamName: t.name,
            isLeader: m.role === 'leader',
          });
        });
      });
    }

    if (search) {
      studentList = studentList.filter(
        (s) =>
          s.name.toLowerCase().includes(search) ||
          s.email.toLowerCase().includes(search) ||
          s.registerNumber.toLowerCase().includes(search) ||
          s.teamName.toLowerCase().includes(search)
      );
    }

    const total = studentList.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedStudents = studentList.slice(startIndex, startIndex + limit);

    return successResponse(
      res,
      paginatedStudents,
      'Students roster retrieved successfully',
      200,
      { page, limit, total, totalPages }
    );
  } catch (err) {
    return errorResponse(res, 'Failed to fetch students roster', 500, err);
  }
};

/**
 * GET /api/admin/ideas
 * Get all startup ideas with assigned team information
 */
exports.getIdeas = async (req, res) => {
  try {
    let ideas = [];
    try {
      ideas = await StartupIdea.find().populate('assignedTeamId', 'name teamCode').lean();
    } catch (dbErr) {
      ideas = [...mockIdeas];
    }

    return successResponse(res, ideas, 'Idea repository retrieved successfully');
  } catch (err) {
    return errorResponse(res, 'Failed to fetch startup ideas', 500, err);
  }
};

/**
 * POST /api/admin/ideas
 * Create new startup idea (Admin only)
 */
exports.createIdea = async (req, res) => {
  try {
    const { title, industry, problemStatement, targetAudience, keyFeatures, revenueModel, complexityLevel } = req.body;

    if (!title || !industry || !problemStatement || !targetAudience || !revenueModel) {
      return errorResponse(res, 'Missing required fields for startup idea creation', 400);
    }

    const ideaData = {
      title,
      industry,
      problemStatement,
      targetAudience,
      keyFeatures: Array.isArray(keyFeatures) ? keyFeatures : [keyFeatures].filter(Boolean),
      revenueModel,
      complexityLevel: complexityLevel || 'intermediate',
      isAssigned: false,
    };

    let newIdea = null;
    try {
      newIdea = await StartupIdea.create(ideaData);
    } catch (dbErr) {
      newIdea = {
        _id: 'idea_' + Date.now(),
        id: 'idea_' + Date.now(),
        ...ideaData,
        createdAt: new Date().toISOString(),
      };
      mockIdeas.push(newIdea);
    }

    return successResponse(res, newIdea, 'Startup idea created successfully', 201);
  } catch (err) {
    return errorResponse(res, 'Failed to create startup idea', 500, err);
  }
};

/**
 * PUT /api/admin/ideas/:id
 * Update existing startup idea
 */
exports.updateIdea = async (req, res) => {
  try {
    const { id } = req.params;
    let updated = null;

    try {
      updated = await StartupIdea.findByIdAndUpdate(id, { $set: req.body }, { new: true });
    } catch (dbErr) {
      const idx = mockIdeas.findIndex((i) => i._id === id || i.id === id);
      if (idx !== -1) {
        mockIdeas[idx] = { ...mockIdeas[idx], ...req.body };
        updated = mockIdeas[idx];
      }
    }

    if (!updated) {
      return errorResponse(res, 'Startup idea not found', 404);
    }

    return successResponse(res, updated, 'Startup idea updated successfully');
  } catch (err) {
    return errorResponse(res, 'Failed to update startup idea', 500, err);
  }
};

/**
 * DELETE /api/admin/ideas/:id
 * Delete or deactivate startup idea
 */
exports.deleteIdea = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await StartupIdea.findByIdAndDelete(id);
    } catch (dbErr) {
      const idx = mockIdeas.findIndex((i) => i._id === id || i.id === id);
      if (idx !== -1) {
        mockIdeas.splice(idx, 1);
      }
    }

    return successResponse(res, { id }, 'Startup idea removed successfully');
  } catch (err) {
    return errorResponse(res, 'Failed to delete startup idea', 500, err);
  }
};

/**
 * GET /api/admin/teams/:id
 * Full detail view of a single team for admin review
 */
exports.getTeamById = async (req, res) => {
  try {
    const { id } = req.params;

    let teamData = null;

    try {
      const Team = require('../models/Team');
      const Submission = require('../models/Submission');
      const IdeaAssignment = require('../models/IdeaAssignment');
      const StartupIdea = require('../models/StartupIdea');

      const team = await Team.findById(id)
        .populate('leaderId', 'name email registerNumber mobile gender section role')
        .lean();

      if (!team) {
        return errorResponse(res, 'Team not found', 404);
      }

      // Get submission
      const submission = await Submission.findOne({ teamId: team._id }).lean();

      // Get idea assignment
      let idea = null;
      const assignment = await IdeaAssignment.findOne({ teamId: team._id.toString() }).lean();
      if (assignment) {
        idea = await StartupIdea.findById(assignment.ideaId).lean();
      }

      teamData = {
        id: team._id.toString(),
        teamNumber: team.teamNumber,
        name: team.name,
        teamCode: team.teamCode,
        isLocked: team.isLocked,
        tableNumber: team.tableNumber || 'Unassigned',
        leader: team.leaderId || {},
        members: team.members || [],
        ideaAssignment: idea
          ? {
              ideaId: idea._id.toString(),
              ideaTitle: idea.title,
              category: idea.category || '',
              problemStatement: idea.problemStatement || '',
              targetUsers: idea.targetUsers || '',
              difficulty: idea.difficulty || '',
              assignedAt: assignment?.selectedAt,
              status: assignment?.status,
            }
          : null,
        submission: submission
          ? {
              submissionStatus: submission.submissionStatus,
              isFinal: submission.isFinal,
              logoUrl: submission.logoUrl,
              visitingCardUrl: submission.visitingCardUrl,
              posterUrl: submission.posterUrl,
              linkedinBannerUrl: submission.linkedinBannerUrl,
              githubUrl: submission.githubUrl,
              deployedUrl: submission.deployedUrl,
              videoUrl: submission.videoUrl,
              pitchDeckUrl: submission.pitchDeckUrl,
              businessModel: submission.businessModel,
              finalPitchNotes: submission.finalPitchNotes,
              submittedAt: submission.submittedAt,
            }
          : null,
        createdAt: team.createdAt,
      };
    } catch (dbErr) {
      const mock = mockTeams.find((t) => t._id === id || t.id === id);
      if (!mock) return errorResponse(res, 'Team not found', 404);
      teamData = mock;
    }

    return successResponse(res, teamData, 'Team detail retrieved successfully');
  } catch (err) {
    return errorResponse(res, 'Failed to fetch team details', 500, err);
  }
};

/**
 * GET /api/admin/submissions
 * Review all submitted pitch decks & deliverables
 */
exports.getSubmissions = async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '10', 10);
    const search = (req.query.search || '').trim().toLowerCase();

    let submissionList = [];

    try {
      const dbSubs = await Submission.find()
        .populate('teamId', 'name teamCode')
        .lean();

      submissionList = dbSubs.map((s) => ({
        id: s._id.toString(),
        teamId: s.teamId?._id?.toString() || s.teamId,
        teamName: s.teamId?.name || s.startupName || 'Unknown Team',
        teamCode: s.teamId?.teamCode || '',
        startupName: s.startupName,
        tagline: s.tagline,
        logoUrl: s.logoUrl,
        visitingCardUrl: s.visitingCardUrl,
        posterUrl: s.posterUrl,
        linkedinBannerUrl: s.linkedinBannerUrl,
        githubUrl: s.githubUrl,
        deployedUrl: s.deployedUrl,
        videoUrl: s.videoUrl,
        pitchDeckUrl: s.pitchDeckUrl,
        businessModel: s.businessModel,
        finalPitchNotes: s.finalPitchNotes,
        submissionStatus: s.submissionStatus || (s.isFinal ? 'LOCKED' : 'IN_PROGRESS'),
        isFinal: s.isFinal,
        submittedAt: s.submittedAt,
        score: s.score,
      }));
    } catch (dbErr) {
      submissionList = [...mockSubmissions];
    }

    if (search) {
      submissionList = submissionList.filter(
        (s) =>
          s.teamName.toLowerCase().includes(search) ||
          s.startupName.toLowerCase().includes(search) ||
          s.githubUrl.toLowerCase().includes(search)
      );
    }

    const total = submissionList.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedSubmissions = submissionList.slice(startIndex, startIndex + limit);

    return successResponse(
      res,
      paginatedSubmissions,
      'Submissions pipeline retrieved successfully',
      200,
      { page, limit, total, totalPages }
    );
  } catch (err) {
    return errorResponse(res, 'Failed to fetch submissions list', 500, err);
  }
};

// ─── Admin: Add member to a team ─────────────────────────────────────────────
exports.adminAddMember = async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const { id: teamId } = req.params;
    const { name, registerNumber, gender, section, role } = req.body;

    if (!name || !registerNumber || !gender || !section) {
      return errorResponse(res, 'Name, register number, gender and section are required', 400);
    }

    const team = await Team.findById(teamId);
    if (!team) return errorResponse(res, 'Team not found', 404);

    if ((team.members || []).length >= 6) {
      return errorResponse(res, 'Team already has 6 members (maximum)', 409);
    }

    // Duplicate register numbers are allowed — generate unique internal email for User collection
    const cleanReg = (registerNumber.trim().toLowerCase().replace(/[^a-z0-9]/g, '')) || 'member';
    const internalEmail = `${cleanReg}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}@build2pitch.internal`;
    const randomPass = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    const passwordHash = await bcrypt.hash(randomPass, 10);

    const newUser = new User({
      name: name.trim(),
      registerNumber: registerNumber.trim(),
      email: internalEmail,
      mobile: null,
      gender: gender.toUpperCase(),
      section: section.trim(),
      passwordHash,
      role: 'TEAM_MEMBER',
      teamId: team._id,
      isActive: true,
    });
    await newUser.save();

    const memberRole = role ? role.trim().toLowerCase() : 'developer';
    const memberEntry = {
      name: newUser.name,
      email: newUser.email,
      role: memberRole,
      userId: newUser._id,
      registerNumber: newUser.registerNumber,
      gender: newUser.gender,
      section: newUser.section,
      joinedAt: new Date(),
    };
    team.members.push(memberEntry);
    await team.save();

    const createdMember = team.members[team.members.length - 1];

    return successResponse(res, {
      id: createdMember._id?.toString() || newUser._id.toString(),
      _id: createdMember._id?.toString() || newUser._id.toString(),
      userId: newUser._id.toString(),
      name: newUser.name,
      registerNumber: newUser.registerNumber,
      gender: newUser.gender,
      section: newUser.section,
      role: memberRole,
      totalMembers: team.members.length,
    }, 'Member added by admin', 201);
  } catch (error) {
    return errorResponse(res, error.message || 'Server error adding member', 500);
  }
};

// ─── Admin: Update / Change Member Details ──────────────────────────────────
exports.adminUpdateMember = async (req, res) => {
  try {
    const { id: teamId, memberId } = req.params;
    const { name, registerNumber, gender, section, role } = req.body;

    const team = await Team.findById(teamId);
    if (!team) return errorResponse(res, 'Team not found', 404);

    const member = (team.members || []).find(
      (m) => m._id?.toString() === memberId || m.userId?.toString() === memberId || m.id?.toString() === memberId
    );
    if (!member) return errorResponse(res, 'Member not found in team', 404);

    if (name && name.trim()) member.name = name.trim();
    if (registerNumber !== undefined) member.registerNumber = registerNumber.trim();
    if (gender) member.gender = gender.toUpperCase();
    if (section !== undefined) member.section = section.trim();
    if (role) member.role = role.trim().toLowerCase();

    // If member has linked User document, update it too
    if (member.userId) {
      const userUpdate = {};
      if (name && name.trim()) userUpdate.name = name.trim();
      if (registerNumber !== undefined) userUpdate.registerNumber = registerNumber.trim();
      if (gender) userUpdate.gender = gender.toUpperCase();
      if (section !== undefined) userUpdate.section = section.trim();
      await User.findByIdAndUpdate(member.userId, userUpdate);
    }

    team.markModified('members');
    await team.save();

    return successResponse(res, {
      id: member._id?.toString() || member.userId?.toString() || memberId,
      _id: member._id?.toString() || member.userId?.toString() || memberId,
      userId: member.userId ? member.userId.toString() : null,
      name: member.name,
      registerNumber: member.registerNumber,
      gender: member.gender,
      section: member.section,
      role: member.role,
    }, 'Member details updated successfully');
  } catch (error) {
    return errorResponse(res, error.message || 'Server error updating member', 500);
  }
};

// ─── Admin: Remove a member from a team ──────────────────────────────────────
exports.adminRemoveMember = async (req, res) => {
  try {
    const { id: teamId, memberId } = req.params;
    const team = await Team.findById(teamId);
    if (!team) return errorResponse(res, 'Team not found', 404);

    const memberIndex = team.members.findIndex(
      (m) => m._id?.toString() === memberId || m.userId?.toString() === memberId || m.id?.toString() === memberId
    );
    if (memberIndex === -1) return errorResponse(res, 'Member not found in team', 404);

    const removed = team.members[memberIndex];
    if (removed.role === 'leader') {
      return errorResponse(res, 'Use DELETE /lead to remove the team lead', 400);
    }

    team.members.splice(memberIndex, 1);
    await team.save();
    if (removed.userId) await User.findByIdAndUpdate(removed.userId, { isActive: false, teamId: null });

    return successResponse(res, { memberId, removed: true }, 'Member removed by admin');
  } catch (error) {
    return errorResponse(res, error.message || 'Server error', 500);
  }
};

// ─── Admin: Add / Assign Team Lead ──────────────────────────────────────────
exports.adminAddTeamLead = async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const { id: teamId } = req.params;
    const { name, registerNumber, gender, section, email, mobile } = req.body;

    if (!name || !registerNumber || !gender || !section) {
      return errorResponse(res, 'Name, register number, gender, and section are required', 400);
    }

    const team = await Team.findById(teamId);
    if (!team) return errorResponse(res, 'Team not found', 404);

    const cleanReg = (registerNumber.trim().toLowerCase().replace(/[^a-z0-9]/g, '')) || 'lead';
    let leadEmail = email && email.trim() ? email.trim().toLowerCase() : null;
    if (leadEmail) {
      const existingUser = await User.findOne({ email: leadEmail });
      if (existingUser) {
        leadEmail = `${cleanReg}_lead_${Date.now()}_${Math.random().toString(36).substring(2, 6)}@build2pitch.internal`;
      }
    } else {
      leadEmail = `${cleanReg}_lead_${Date.now()}_${Math.random().toString(36).substring(2, 6)}@build2pitch.internal`;
    }

    const randomPass = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    const passwordHash = await bcrypt.hash(randomPass, 10);

    const newLead = new User({
      name: name.trim(),
      registerNumber: registerNumber.trim(),
      email: leadEmail,
      mobile: mobile ? mobile.trim() : null,
      gender: gender.toUpperCase(),
      section: section.trim(),
      passwordHash,
      role: 'TEAM_LEAD',
      teamId: team._id,
      isActive: true,
    });
    await newLead.save();

    team.leaderId = newLead._id;
    team.members = (team.members || []).filter((m) => m.role !== 'leader');
    team.members.unshift({
      name: newLead.name,
      email: newLead.email,
      role: 'leader',
      userId: newLead._id,
      registerNumber: newLead.registerNumber,
      mobileNumber: newLead.mobile || '',
      gender: newLead.gender,
      section: newLead.section,
      joinedAt: new Date(),
    });

    await team.save();

    return successResponse(res, {
      leaderId: newLead._id.toString(),
      leader: {
        id: newLead._id.toString(),
        name: newLead.name,
        email: newLead.email,
        registerNumber: newLead.registerNumber,
        gender: newLead.gender,
        section: newLead.section,
        mobile: newLead.mobile,
      },
      members: team.members,
    }, 'Team Lead added successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message || 'Server error adding team lead', 500);
  }
};

// ─── Admin: Update / Change Team Lead Details ────────────────────────────────
exports.adminUpdateTeamLead = async (req, res) => {
  try {
    const { id: teamId } = req.params;
    const { name, registerNumber, gender, section, email, mobile } = req.body;

    const team = await Team.findById(teamId);
    if (!team) return errorResponse(res, 'Team not found', 404);

    const updateData = {};
    if (name && name.trim()) updateData.name = name.trim();
    if (registerNumber !== undefined) updateData.registerNumber = registerNumber.trim();
    if (gender) updateData.gender = gender.toUpperCase();
    if (section !== undefined) updateData.section = section.trim();
    if (mobile !== undefined) updateData.mobile = mobile ? mobile.trim() : null;

    if (email && email.trim()) {
      const cleanEmail = email.trim().toLowerCase();
      if (team.leaderId) {
        const existingEmail = await User.findOne({ email: cleanEmail, _id: { $ne: team.leaderId } });
        if (existingEmail) {
          return errorResponse(res, 'Email address is already in use by another account', 409);
        }
      }
      updateData.email = cleanEmail;
    }

    let updatedLeadUser = null;
    if (team.leaderId) {
      updatedLeadUser = await User.findByIdAndUpdate(team.leaderId, updateData, { new: true });
    }

    let leadMember = (team.members || []).find(
      (m) => m.role === 'leader' || (team.leaderId && m.userId?.toString() === team.leaderId.toString())
    );
    if (leadMember) {
      if (name && name.trim()) leadMember.name = name.trim();
      if (registerNumber !== undefined) leadMember.registerNumber = registerNumber.trim();
      if (gender) leadMember.gender = gender.toUpperCase();
      if (section !== undefined) leadMember.section = section.trim();
      if (email && email.trim()) leadMember.email = email.trim().toLowerCase();
      if (mobile !== undefined) leadMember.mobileNumber = mobile ? mobile.trim() : '';
    } else if (updatedLeadUser) {
      team.members.unshift({
        name: updatedLeadUser.name,
        email: updatedLeadUser.email,
        role: 'leader',
        userId: updatedLeadUser._id,
        registerNumber: updatedLeadUser.registerNumber,
        mobileNumber: updatedLeadUser.mobile || '',
        gender: updatedLeadUser.gender,
        section: updatedLeadUser.section,
        joinedAt: new Date(),
      });
    }

    team.markModified('members');
    await team.save();

    return successResponse(res, {
      leaderId: team.leaderId?.toString(),
      leader: {
        id: team.leaderId?.toString() || leadMember?.userId?.toString(),
        name: updatedLeadUser?.name || leadMember?.name,
        email: updatedLeadUser?.email || leadMember?.email,
        registerNumber: updatedLeadUser?.registerNumber || leadMember?.registerNumber,
        gender: updatedLeadUser?.gender || leadMember?.gender,
        section: updatedLeadUser?.section || leadMember?.section,
        mobile: updatedLeadUser?.mobile || leadMember?.mobileNumber,
      },
    }, 'Team Lead details updated successfully');
  } catch (error) {
    return errorResponse(res, error.message || 'Server error updating team lead', 500);
  }
};

// ─── Admin: Remove the Team Lead ─────────────────────────────────────────────
exports.adminRemoveTeamLead = async (req, res) => {
  try {
    const { id: teamId } = req.params;
    const team = await Team.findById(teamId);
    if (!team) return errorResponse(res, 'Team not found', 404);

    const leadIndex = team.members.findIndex((m) => m.role === 'leader');
    if (leadIndex !== -1) {
      const leadEntry = team.members[leadIndex];
      team.members.splice(leadIndex, 1);
      if (leadEntry.userId) await User.findByIdAndUpdate(leadEntry.userId, { isActive: false, teamId: null });
    }
    if (team.leaderId) await User.findByIdAndUpdate(team.leaderId, { isActive: false, teamId: null });
    team.leaderId = null;
    await team.save();

    return successResponse(res, { teamId, leadRemoved: true }, 'Team lead removed by admin');
  } catch (error) {
    return errorResponse(res, error.message || 'Server error', 500);
  }
};

