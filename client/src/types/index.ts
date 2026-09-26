/**
 * BUILD2PITCH NEXTGEN — Shared TypeScript Types and Domain Models
 */

// ==========================================
// 1. User & Authentication Types
// ==========================================

export type UserRole =
  | 'ADMIN'
  | 'TEAM_LEAD'
  | 'TEAM_MEMBER'
  | 'admin'
  | 'team_lead'
  | 'member';

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  registerNumber?: string | null;
  mobile?: string | null;
  gender?: string | null;
  section?: string | null;
  teamId?: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterPayload {
  name: string;
  registerNumber: string;
  email: string;
  mobile: string;
  gender: string;
  section: string;
  password: string;
  confirmPassword: string;
  teamName: string;
}

export interface AddMemberPayload {
  name: string;
  registerNumber: string;
  email: string;
  mobile: string;
  gender: string;
  section: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponseData {
  token: string;
  user: User;
  team?: Team | null;
}

// ==========================================
// 2. Team Member Types
// ==========================================

export type MemberSpecialization =
  | 'leader'
  | 'developer'
  | 'designer'
  | 'pitcher'
  | 'researcher'
  | 'marketer';

export interface TeamMember {
  id: string;
  userId?: string | null;
  name: string;
  email: string;
  role: MemberSpecialization;
  registerNumber?: string;
  mobile?: string;
  gender?: string;
  section?: string;
  isRegisteredUser?: boolean;
  joinedAt: string;
}

// ==========================================
// 3. Startup Idea Types
// ==========================================

export type IdeaComplexity = 'beginner' | 'intermediate' | 'advanced';

export interface StartupIdea {
  id?: string;
  _id?: string;
  title: string;
  shortDescription?: string;
  category?: string;
  industry?: string;
  problemStatement: string;
  targetUsers?: string;
  targetAudience?: string;
  keyFeatures?: string[];
  revenueModel?: string;
  difficulty?: string;
  complexityLevel?: IdeaComplexity;
  isAssigned: boolean;
  isActive?: boolean;
  assignedTeamId?: string | null;
  createdAt: string;
}

// ==========================================
// 4. Idea Dice / Roll Flow Types
// ==========================================

export interface IdeaVault {
  count: number;
  ideas: StartupIdea[];
}

export type IdeaRollStatus = 'ROLLED' | 'LOCKED' | null;

export interface MyIdeaState {
  status: IdeaRollStatus;
  attemptsUsed: number;
  attemptsRemaining: number;
  idea: StartupIdea | null;
}

export interface IdeaRollResult {
  attempt: number;
  attemptsRemaining: number;
  idea: StartupIdea;
}

export interface LockedIdeaResult {
  status: 'LOCKED';
  idea: StartupIdea;
}

export interface TeamIdeaOptionsResponse {
  status: 'LOCKED' | 'SELECTING';
  options: StartupIdea[];
  selectedIdea: StartupIdea | null;
  teamName?: string;
}

export interface SubmitOwnIdeaPayload {
  title: string;
  industry: string;
  problemStatement: string;
  targetAudience: string;
  revenueModel: string;
  keyFeatures?: string[];
  complexityLevel?: IdeaComplexity;
}

// ==========================================
// 5. Idea Assignment Types
// ==========================================

export interface IdeaAssignment {
  id?: string;
  ideaId?: string;
  ideaTitle?: string;
  category?: string;
  industry?: string;
  assignedAt?: string;
  isRevealed?: boolean;
  revealTime?: string;
  status?: IdeaRollStatus;
  ideaDetails?: StartupIdea;
}

// ==========================================
// 6. Submission Types
// ==========================================

export type SubmissionStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'LOCKED';

export interface Submission {
  id?: string;
  _id?: string;
  teamId: string;
  startupName?: string;
  tagline?: string;
  logoUrl?: string;
  visitingCardUrl?: string;
  posterUrl?: string;
  linkedinBannerUrl?: string;
  githubUrl?: string;
  deployedUrl?: string;
  videoUrl?: string;
  pitchDeckUrl?: string;
  businessModel?: string;
  finalPitchNotes?: string;
  submissionStatus: SubmissionStatus;
  isFinal: boolean;
  submittedAt?: string | null;
  score?: number | null;
}

// ==========================================
// 7. Team Types
// ==========================================

export interface Team {
  id: string;
  _id?: string;
  teamNumber?: number;
  name: string;
  teamCode: string;
  leaderId?: string;
  leader?: Partial<User>;
  members: TeamMember[];
  ideaAssignment?: IdeaAssignment | null;
  submission?: Submission | null;
  isLocked?: boolean;
  tableNumber?: string | null;
  membersCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

// ==========================================
// 8. Event Settings Types
// ==========================================

export interface EventSettings {
  id?: string;
  eventName: string;
  tagline: string;
  startTime: string | null;   // ISO date string
  endTime: string | null;     // ISO date string
  registrationOpen: boolean;
  challengeOpen: boolean;
  submissionOpen: boolean;
  maxTeamSize: number;
  maxIdeaAttempts: number;
  bannerNotice?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// ==========================================
// 9. Activity Log Types
// ==========================================

export type ActivityAction =
  | 'TEAM_REGISTERED'
  | 'MEMBER_ADDED'
  | 'MEMBER_REMOVED'
  | 'IDEA_ROLLED'
  | 'IDEA_LOCKED'
  | 'SUBMISSION_UPDATED'
  | 'SUBMISSION_SUBMITTED'
  | 'ADMIN_VIEWED_TEAM'
  | 'USER_LOGIN'
  | 'USER_LOGOUT';

export interface ActivityLog {
  id: string;
  userId?: string;
  teamId?: string;
  action: ActivityAction;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// ==========================================
// 10. API & Network Types
// ==========================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

export interface AuthState {
  user: User | null;
  team: Team | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ==========================================
// 11. Admin Types
// ==========================================

export interface AdminStats {
  totalTeams: number;
  totalStudents: number;
  ideasAssigned: number;
  ideasRemaining?: number;
  submitted: number;
  inProgress: number;
  incomplete: number;
}
