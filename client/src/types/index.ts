/**
 * BUILD2PITCH - Shared TypeScript Types and Domain Models
 */

// ==========================================
// 1. User & Authentication Types
// ==========================================

export type UserRole = 'admin' | 'team_lead' | 'member';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  teamId?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
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
  name: string;
  email: string;
  role: MemberSpecialization;
  isRegisteredUser?: boolean;
  userId?: string;
  joinedAt: string;
}

// ==========================================
// 3. Startup Idea Types
// ==========================================

export type IdeaComplexity = 'beginner' | 'intermediate' | 'advanced';

export interface StartupIdea {
  id: string;
  title: string;
  industry: string;
  problemStatement: string;
  targetAudience: string;
  keyFeatures: string[];
  revenueModel: string;
  complexityLevel?: IdeaComplexity;
  isAssigned: boolean;
  assignedTeamId?: string;
  createdAt: string;
}

// ==========================================
// 4. Idea Assignment Types
// ==========================================

export interface IdeaAssignment {
  id?: string;
  ideaId: string;
  ideaTitle: string;
  industry: string;
  assignedAt: string;
  isRevealed: boolean;
  revealTime?: string;
  ideaDetails?: StartupIdea;
}

// ==========================================
// 5. Submission Types
// ==========================================

export interface Submission {
  id: string;
  teamId: string;
  startupName: string;
  tagline: string;
  problemStatement?: string;
  solutionOverview?: string;
  pitchDeckUrl: string;
  liveDemoUrl: string;
  githubUrl: string;
  videoUrl?: string;
  techStack: string[];
  submittedAt: string;
  isFinal: boolean;
  feedback?: {
    score?: number;
    notes?: string;
    evaluatedBy?: string;
  };
}

// ==========================================
// 6. Team Types
// ==========================================

export interface Team {
  id: string;
  teamNumber: number;
  name: string;
  teamCode: string;
  leaderId: string;
  members: TeamMember[];
  ideaAssignment?: IdeaAssignment;
  submission?: Submission;
  isLocked: boolean;
  tableNumber?: string;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 7. Event Settings Types
// ==========================================

export type EventPhase = 
  | 'registration' 
  | 'idea_reveal' 
  | 'building' 
  | 'submission' 
  | 'pitching' 
  | 'concluded';

export interface EventSettings {
  id?: string;
  eventName: string;
  eventDate: string;
  registrationOpen: boolean;
  submissionDeadline: string;
  ideasRevealed: boolean;
  maxTeamSize: number;
  minTeamSize: number;
  currentPhase: EventPhase;
  bannerNotice?: string;
}

// ==========================================
// 8. API & Network Types
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
  };
}

export interface AuthState {
  user: User | null;
  team: Team | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
