/**
 * BUILD2PITCH Server Domain Model & Contract Definitions
 * Mirrors client/src/types/index.ts
 * 
 * Core Entities:
 * - User: { id, name, email, passwordHash, role: ('admin'|'team_lead'|'member'), teamId, createdAt }
 * - Team: { id, teamNumber, name, teamCode, leaderId, members: [TeamMember], ideaAssignment, submission, isLocked }
 * - TeamMember: { id, name, email, role: ('leader'|'developer'|'designer'|'pitcher'|'researcher'|'marketer'), joinedAt }
 * - StartupIdea: { id, title, industry, problemStatement, targetAudience, keyFeatures, revenueModel, isAssigned }
 * - IdeaAssignment: { ideaId, ideaTitle, industry, assignedAt, isRevealed, revealTime }
 * - Submission: { id, teamId, startupName, tagline, pitchDeckUrl, liveDemoUrl, githubUrl, videoUrl, techStack, isFinal }
 * - EventSettings: { eventName, eventDate, registrationOpen, submissionDeadline, ideasRevealed, maxTeamSize, minTeamSize }
 */

module.exports = {
  ROLES: {
    ADMIN: 'admin',
    TEAM_LEAD: 'team_lead',
    MEMBER: 'member',
  },
  MEMBER_SPECIALIZATIONS: [
    'leader',
    'developer',
    'designer',
    'pitcher',
    'researcher',
    'marketer',
  ],
  EVENT_PHASES: [
    'registration',
    'idea_reveal',
    'building',
    'submission',
    'pitching',
    'concluded',
  ],
};
