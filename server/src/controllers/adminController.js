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
        .populate('leaderId', 'name email registerNumber mobileNumber gender section')
        .lean();

      teamList = await Promise.all(
        dbTeams.map(async (t) => {
          const sub = await Submission.findOne({ teamId: t._id }).lean();
          return {
            id: t._id.toString(),
            teamNumber: t.teamNumber,
            name: t.name,
            teamCode: t.teamCode,
            leaderId: t.leaderId?._id?.toString() || t.leaderId,
            leader: t.leaderId || { name: 'N/A' },
            members: t.members || [],
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
