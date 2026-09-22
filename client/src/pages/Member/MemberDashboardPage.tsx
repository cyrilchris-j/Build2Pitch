import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  Loader2,
  User,
  Hash,
  Phone,
  Layers,
  Zap,
  Lock,
  AlertCircle,
  CheckCircle2,
  Users,
  Lightbulb,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTeam } from '@/hooks/useTeam';
import { useEventSettings } from '@/hooks/useEventSettings';
import { EventCountdown } from '@/components/countdown/EventCountdown';
import { Badge } from '@/components/ui/Badge';

const InfoRow: React.FC<{ icon: React.ElementType; label: string; value?: string | null }> = ({
  icon: Icon, label, value
}) => (
  <div className="flex items-center gap-3 py-2.5 border-b border-border/50 last:border-0">
    <div className="h-7 w-7 rounded-lg bg-card border border-border flex items-center justify-center shrink-0">
      <Icon className="h-3.5 w-3.5 text-foreground-subtle" />
    </div>
    <div className="flex items-center justify-between w-full">
      <span className="text-xs text-foreground-muted">{label}</span>
      <span className="text-xs font-semibold text-foreground">{value || '—'}</span>
    </div>
  </div>
);

export const MemberDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { data, members, isLoading: teamLoading } = useTeam();
  const { settings } = useEventSettings();

  if (teamLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  const team = data?.team;
  const idea = data?.ideaAssignment;
  const submission = data?.submissionStatus;

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-xs text-foreground-subtle uppercase tracking-wider font-semibold mb-0.5">
              Build2Pitch 2026 — Member Dashboard
            </p>
            <h1 className="text-xl font-black text-foreground tracking-tight">
              Welcome, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-xs text-foreground-muted">
              Read-only view. Talk to your Team Lead for updates.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-5">
          {/* My Profile */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-card border border-border rounded-2xl overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-border flex items-center gap-2.5">
              <User className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-bold text-foreground">My Profile</h2>
              <Badge variant="primary" className="ml-auto">Team Member</Badge>
            </div>
            <div className="px-5 py-3">
              <InfoRow icon={User} label="Name" value={user?.name} />
              <InfoRow icon={Hash} label="Register Number" value={user?.registerNumber} />
              <InfoRow icon={Phone} label="Email" value={user?.email} />
              <InfoRow icon={Layers} label="Section" value={user?.section} />
              <InfoRow icon={Phone} label="Mobile" value={user?.mobile} />
            </div>
          </motion.div>

          {/* Team Info */}
          {team && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border rounded-2xl overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-border flex items-center gap-2.5">
                <Users className="h-4 w-4 text-accent" />
                <h2 className="text-sm font-bold text-foreground">Your Team</h2>
                <span className="ml-auto text-xs font-mono text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md">
                  {team.teamCode}
                </span>
              </div>
              <div className="px-5 py-3">
                <InfoRow icon={Users} label="Team Name" value={team.name} />
                <InfoRow icon={Hash} label="Team Number" value={team.teamNumber ? `#${team.teamNumber}` : undefined} />
                <InfoRow icon={User} label="Members" value={`${(team.membersCount || 0) + 1} / 6`} />
                <InfoRow icon={Layers} label="Table" value={team.tableNumber || 'TBA'} />
              </div>

              {members.length > 0 && (
                <div className="px-5 pb-4">
                  <p className="text-xs font-semibold text-foreground-subtle uppercase tracking-wider mb-3">Teammates</p>
                  <div className="space-y-2">
                    {members.map((m) => (
                      <div key={m.id} className="flex items-center gap-2.5 p-2.5 bg-background rounded-xl">
                        <div className="h-7 w-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                          <User className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate">{m.name}</p>
                          <p className="text-[10px] text-foreground-subtle truncate">{m.email}</p>
                        </div>
                        <span className="text-[10px] font-semibold text-foreground-muted capitalize">{m.role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Startup Idea */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-card border border-border rounded-2xl overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-border flex items-center gap-2.5">
              <Lightbulb className="h-4 w-4 text-warning" />
              <h2 className="text-sm font-bold text-foreground">Startup Idea</h2>
            </div>
            <div className="px-5 py-4">
              {idea ? (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="warning">{idea.industry || 'Startup'}</Badge>
                    <Badge variant="success">Assigned</Badge>
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-2">{idea.ideaTitle}</h3>
                  <p className="text-xs text-foreground-muted">Locked and assigned to your team. Build it!</p>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Lightbulb className="h-10 w-10 text-foreground-subtle/30 mx-auto mb-3" />
                  <p className="text-sm text-foreground-muted">No idea assigned yet</p>
                  <p className="text-xs text-foreground-subtle mt-1">Ask your Team Lead to roll the idea dice</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Submission Status */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-2xl overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-border">
              <h2 className="text-sm font-bold text-foreground">Submission</h2>
            </div>
            <div className="px-5 py-4 text-center">
              {submission?.submitted ? (
                <>
                  <div className="h-12 w-12 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="h-6 w-6 text-success" />
                  </div>
                  <p className="text-sm font-bold text-success">Submitted!</p>
                  <p className="text-xs text-foreground-muted mt-1">Your team has finalized the submission</p>
                </>
              ) : (
                <>
                  <div className="h-12 w-12 rounded-2xl bg-warning/10 border border-warning/20 flex items-center justify-center mx-auto mb-3">
                    <AlertCircle className="h-6 w-6 text-warning" />
                  </div>
                  <p className="text-sm font-bold text-warning">In Progress</p>
                  <p className="text-xs text-foreground-muted mt-1">Team Lead will submit deliverables</p>
                </>
              )}
            </div>
          </motion.div>

          {/* Countdown */}
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
            <EventCountdown settings={settings} />
          </motion.div>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-2xl p-4"
          >
            <p className="text-xs font-semibold text-foreground-subtle uppercase tracking-wider mb-3">Quick Links</p>
            <div className="space-y-1">
              <Link to="/team/instructions"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-foreground-muted hover:text-foreground hover:bg-background transition-all">
                <FileText className="h-4 w-4 shrink-0" />
                Event Instructions
              </Link>
            </div>
          </motion.div>

          {/* Read-only notice */}
          <div className="p-3 rounded-xl border border-border bg-background-subtle flex items-start gap-2">
            <Lock className="h-4 w-4 text-foreground-subtle mt-0.5 shrink-0" />
            <p className="text-xs text-foreground-subtle leading-relaxed">
              You have read-only access. Only Team Leads can manage ideas and submissions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
