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
  Info,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTeam } from '@/hooks/useTeam';
import { useEventSettings } from '@/hooks/useEventSettings';
import { EventCountdown } from '@/components/countdown/EventCountdown';
import { Badge } from '@/components/ui/Badge';

const stagger = {
  show: { transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

interface InfoRowProps {
  icon: React.ElementType;
  label: string;
  value?: string | null;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon: Icon, label, value }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-border/40 last:border-0 gap-3">
    <div className="flex items-center gap-2.5 min-w-0">
      <Icon className="h-3.5 w-3.5 text-foreground-subtle shrink-0" />
      <span className="text-xs text-foreground-muted">{label}</span>
    </div>
    <span className="text-xs font-semibold text-foreground text-right truncate max-w-[55%]">
      {value || <span className="text-foreground-subtle font-normal">—</span>}
    </span>
  </div>
);

const SectionCard: React.FC<{
  title: string;
  icon: React.ElementType;
  iconColor?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon: Icon, iconColor = 'text-primary', badge, children }) => (
  <motion.div variants={fadeUp} className="bg-card border border-border rounded-2xl overflow-hidden hover:border-border-hover transition-colors duration-200">
    <div className="px-5 py-4 border-b border-border flex items-center gap-2.5">
      <Icon className={`h-4 w-4 ${iconColor} shrink-0`} />
      <h2 className="text-sm font-bold text-foreground">{title}</h2>
      {badge && <div className="ml-auto">{badge}</div>}
    </div>
    <div className="px-5 py-4">{children}</div>
  </motion.div>
);

export const MemberDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { data, members, isLoading: teamLoading } = useTeam();
  const { settings } = useEventSettings();

  if (teamLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto mb-3" />
          <p className="text-sm text-foreground-muted">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  const team = data?.team;
  const idea = data?.ideaAssignment;
  const submission = data?.submissionStatus;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-background pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-hero-gradient pointer-events-none opacity-50" />
      <div className="absolute inset-0 grid-texture opacity-20 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Page Header ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-xs text-foreground-subtle uppercase tracking-widest font-semibold mb-0.5">
                Build2Pitch 2026
              </p>
              <h1 className="text-2xl font-black text-foreground tracking-tight">
                Hey, {user?.name?.split(' ')[0]} 👋
              </h1>
              <p className="text-sm text-foreground-muted mt-0.5">
                Member Dashboard — read-only view
              </p>
            </div>
          </div>

          {/* Read-only notice */}
          <div className="mt-4 flex items-start gap-2.5 p-3 rounded-xl bg-background-subtle border border-border">
            <Lock className="h-4 w-4 text-foreground-subtle shrink-0 mt-0.5" />
            <p className="text-xs text-foreground-muted leading-relaxed">
              You have <span className="font-semibold text-foreground">read-only access</span>. Only your Team Lead can manage ideas, add members, and submit deliverables.
            </p>
          </div>
        </motion.div>

        {/* ── Main Grid ────────────────────────────────────── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-3 gap-5"
        >
          {/* Left column: 2/3 */}
          <div className="lg:col-span-2 space-y-5">

            {/* My Profile */}
            <SectionCard
              title="My Profile"
              icon={User}
              iconColor="text-primary"
              badge={<Badge variant="primary">Team Member</Badge>}
            >
              <InfoRow icon={User} label="Full Name" value={user?.name} />
              <InfoRow icon={Hash} label="Register Number" value={user?.registerNumber} />
              <InfoRow icon={Phone} label="Email" value={user?.email} />
              <InfoRow icon={Layers} label="Section" value={user?.section} />
              <InfoRow icon={Phone} label="Mobile" value={user?.mobile} />
            </SectionCard>

            {/* Team Info */}
            {team && (
              <SectionCard
                title="Your Team"
                icon={Users}
                iconColor="text-accent"
                badge={
                  <span className="text-xs font-mono text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-lg">
                    {team.teamCode}
                  </span>
                }
              >
                <InfoRow icon={Users} label="Team Name" value={team.name} />
                <InfoRow icon={Hash} label="Team Number" value={team.teamNumber ? `#${team.teamNumber}` : undefined} />
                <InfoRow
                  icon={User}
                  label="Team Lead"
                  value={
                    typeof (team as any).leaderId === 'object' && (team as any).leaderId?.name
                      ? (team as any).leaderId.name
                      : undefined
                  }
                />
                <InfoRow
                  icon={Users}
                  label="Members"
                  value={`${team.membersCount ?? members.length ?? 0} of 6 (2–6 allowed)`}
                />
                <InfoRow icon={Layers} label="Table" value={team.tableNumber || 'TBA'} />

                {/* Teammates list */}
                {members.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border/40">
                    <p className="text-xs font-semibold text-foreground-subtle uppercase tracking-wider mb-3">
                      Teammates
                    </p>
                    <div className="space-y-2">
                      {members.map((m) => (
                        <div
                          key={m.id}
                          className="flex items-center gap-3 p-2.5 bg-background-subtle rounded-xl border border-border/50"
                        >
                          <div className="h-7 w-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                            <User className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-foreground truncate">{m.name}</p>
                            <p className="text-[10px] text-foreground-subtle truncate">{m.email}</p>
                          </div>
                          <span className="text-[10px] font-semibold text-foreground-muted capitalize bg-card px-2 py-0.5 rounded-md border border-border">
                            {m.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </SectionCard>
            )}

            {/* Startup Idea */}
            <SectionCard
              title="Startup Idea"
              icon={Lightbulb}
              iconColor="text-warning"
            >
              {idea ? (
                <div>
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <Badge variant="warning">{idea.industry || 'Startup'}</Badge>
                    <Badge variant="success">Assigned</Badge>
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-2 leading-snug">
                    {idea.ideaTitle}
                  </h3>
                  <p className="text-xs text-foreground-muted flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                    Locked and assigned — time to build!
                  </p>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="h-12 w-12 rounded-2xl bg-foreground-subtle/5 border border-border flex items-center justify-center mx-auto mb-3">
                    <Lightbulb className="h-5 w-5 text-foreground-subtle/30" />
                  </div>
                  <p className="text-sm text-foreground-muted font-medium">No idea assigned yet</p>
                  <p className="text-xs text-foreground-subtle mt-1">Your Team Lead will roll the dice</p>
                </div>
              )}
            </SectionCard>
          </div>

          {/* Right column: 1/3 */}
          <div className="space-y-5">
            {/* Submission Status */}
            <SectionCard
              title="Submission"
              icon={FileText}
              iconColor="text-accent"
            >
              <div className="text-center py-2">
                {submission?.submitted ? (
                  <>
                    <div className="h-12 w-12 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 className="h-6 w-6 text-success" />
                    </div>
                    <p className="text-sm font-bold text-success">Submitted!</p>
                    <p className="text-xs text-foreground-muted mt-1 leading-relaxed">
                      Your team has finalized all deliverables
                    </p>
                  </>
                ) : (
                  <>
                    <div className="h-12 w-12 rounded-2xl bg-warning/10 border border-warning/20 flex items-center justify-center mx-auto mb-3">
                      <AlertCircle className="h-6 w-6 text-warning" />
                    </div>
                    <p className="text-sm font-bold text-warning">In Progress</p>
                    <p className="text-xs text-foreground-muted mt-1 leading-relaxed">
                      Team Lead is preparing the deliverables
                    </p>
                  </>
                )}
              </div>
            </SectionCard>

            {/* Countdown */}
            <motion.div variants={fadeUp}>
              <EventCountdown settings={settings} />
            </motion.div>

            {/* Quick Links */}
            <motion.div
              variants={fadeUp}
              className="bg-card border border-border rounded-2xl p-4 hover:border-border-hover transition-colors"
            >
              <p className="text-xs font-semibold text-foreground-subtle uppercase tracking-wider mb-3">
                Quick Links
              </p>
              <div className="space-y-1">
                <Link
                  to="/team/instructions"
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-foreground-muted hover:text-foreground hover:bg-background-subtle transition-all group"
                >
                  <FileText className="h-4 w-4 shrink-0 group-hover:text-primary transition-colors" />
                  <span>Event Instructions</span>
                </Link>
              </div>
            </motion.div>

            {/* Info notice */}
            <motion.div
              variants={fadeUp}
              className="p-3.5 rounded-xl border border-border bg-background-subtle flex items-start gap-2.5"
            >
              <Info className="h-4 w-4 text-foreground-subtle shrink-0 mt-0.5" />
              <p className="text-xs text-foreground-subtle leading-relaxed">
                For any changes to team info or submissions, contact your Team Lead.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
