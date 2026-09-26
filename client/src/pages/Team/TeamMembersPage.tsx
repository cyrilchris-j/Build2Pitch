import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserPlus,
  Hash,
  User,
  Layers,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Trash2,
  Shield,
  Code2,
  Image,
  Megaphone,
  Target,
  Globe,
  Info,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { teamService } from '@/services/api';
import type { TeamMember } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';

const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other / Prefer not to say' },
];

const MemberRoleIcon: Record<string, React.ElementType> = {
  leader: Shield,
  developer: Code2,
  designer: Image,
  pitcher: Megaphone,
  researcher: Target,
  marketer: Globe,
};

const MemberCard: React.FC<{
  member: TeamMember;
  isLead?: boolean;
  onRemove?: (id: string) => void;
  canRemove?: boolean;
}> = ({ member, isLead, onRemove, canRemove }) => {
  const Icon = MemberRoleIcon[member.role] || User;
  const roleColors: Record<string, string> = {
    leader: 'primary',
    developer: 'accent',
    designer: 'purple',
    pitcher: 'success',
    researcher: 'warning',
    marketer: 'danger',
  };
  const color = (roleColors[member.role] || 'default') as
    | 'primary'
    | 'accent'
    | 'purple'
    | 'success'
    | 'warning'
    | 'danger'
    | 'default';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      className="bg-card border border-border rounded-2xl p-5 hover:border-border-hover transition-all group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-xl bg-${color}/10 border border-${color}/20 flex items-center justify-center shrink-0`}>
            <Icon className={`h-5 w-5 text-${color}`} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-bold text-foreground">{member.name}</p>
              {isLead && <Badge variant="primary" className="text-[10px]">LEAD</Badge>}
            </div>
            <p className="text-xs text-foreground-subtle mt-0.5 font-mono">
              {member.registerNumber || '—'}
            </p>
          </div>
        </div>
        {canRemove && onRemove && (
          <button
            onClick={() => onRemove(member.id)}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-foreground-subtle hover:text-danger hover:bg-danger/10 transition-all"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Details row */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-foreground-muted">
        <div className="flex items-center gap-1.5">
          <User className="h-3 w-3 shrink-0" />
          <span className="capitalize">{member.gender?.toLowerCase() || '—'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Layers className="h-3 w-3 shrink-0" />
          <span className="truncate">{member.section || '—'}</span>
        </div>
      </div>

      <div className="mt-3">
        <Badge variant={color}>{member.role}</Badge>
      </div>
    </motion.div>
  );
};

const emptyForm = {
  name: '',
  registerNumber: '',
  gender: 'MALE',
  section: '',
};

export const TeamMembersPage: React.FC = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isTeamLead = user?.role?.toUpperCase() === 'TEAM_LEAD';
  const MIN_TEAM_SIZE = 2;
  const MAX_TEAM_SIZE = 6;
  const memberCount = members.length;
  const canAddMore = memberCount < MAX_TEAM_SIZE && isTeamLead;

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const res = await teamService.getMembers();
      const data = res.data?.data;
      if (Array.isArray(data)) setMembers(data);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to load team members');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const { name, registerNumber, gender, section } = formData;
    if (!name.trim() || !registerNumber.trim() || !gender || !section.trim()) {
      setErrorMessage('All 4 fields are required.');
      return;
    }

    setIsAdding(true);
    try {
      const res = await teamService.addMember({
        name: name.trim(),
        registerNumber: registerNumber.trim(),
        gender,
        section: section.trim(),
      });

      const newMember = res.data?.data;
      if (newMember) {
        setMembers((prev) => [...prev, newMember as TeamMember]);
        setSuccessMessage(`${name.trim()} added to your team!`);
        setFormData(emptyForm);
        setShowForm(false);
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || err?.message || 'Failed to add member');
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemove = async (memberId: string) => {
    if (!window.confirm('Remove this team member?')) return;
    try {
      await teamService.removeMember(memberId);
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
      setSuccessMessage('Member removed from team.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to remove member');
    }
  };

  const inputCls =
    'w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder-foreground-subtle focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors';
  const labelCls = 'block text-xs font-semibold text-foreground-muted mb-1.5 uppercase tracking-wide';

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-black text-foreground tracking-tight">Team Members</h1>
            <p className="text-xs text-foreground-muted">
              {memberCount}/{MAX_TEAM_SIZE} members registered · 2 to 6 members allowed
            </p>
          </div>
        </div>
        <ProgressBar
          value={memberCount}
          max={MAX_TEAM_SIZE}
          color={memberCount >= MIN_TEAM_SIZE ? 'success' : 'primary'}
          className="mt-3"
        />
      </div>

      {/* Info notice */}
      <div className="mb-5 p-3.5 rounded-xl border border-border bg-background-subtle flex items-start gap-2.5">
        <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <p className="text-xs text-foreground-muted leading-relaxed">
          <span className="font-semibold text-foreground">No gender restrictions</span> — Teams can have 2 to 6 members (including Team Lead).
          Members are registered with their <span className="font-semibold">name, register number, gender, and section</span> only.
        </p>
      </div>

      {/* Status banners */}
      {memberCount < MIN_TEAM_SIZE && (
        <div className="mb-4 p-3 rounded-xl border border-warning/30 bg-warning/5 flex items-center gap-2 text-warning text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>
            Add at least {MIN_TEAM_SIZE - memberCount} more member{MIN_TEAM_SIZE - memberCount > 1 ? 's' : ''} to meet the minimum of 2.
          </span>
        </div>
      )}
      {memberCount >= MIN_TEAM_SIZE && (
        <div className="mb-4 p-3 rounded-xl border border-success/30 bg-success/5 flex items-center gap-2 text-success text-sm">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Team requirement met — {memberCount}/{MAX_TEAM_SIZE} members registered.</span>
        </div>
      )}

      {/* Success / Error */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3 rounded-xl border border-success/30 bg-success/5 flex items-center justify-between gap-2 text-success text-sm"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              {successMessage}
            </div>
            <button onClick={() => setSuccessMessage(null)}><X className="h-4 w-4" /></button>
          </motion.div>
        )}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3 rounded-xl border border-danger/30 bg-danger/5 flex items-center justify-between gap-2 text-danger text-sm"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {errorMessage}
            </div>
            <button onClick={() => setErrorMessage(null)}><X className="h-4 w-4" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Member Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <AnimatePresence>
            {members.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                isLead={member.role === 'leader'}
                canRemove={isTeamLead && member.role !== 'leader'}
                onRemove={handleRemove}
              />
            ))}
          </AnimatePresence>

          {/* Empty slots */}
          {Array.from({ length: Math.max(0, MAX_TEAM_SIZE - memberCount) }).map((_, i) => (
            <motion.div
              key={`empty-${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border border-dashed border-border rounded-2xl p-5 flex flex-col items-center justify-center min-h-[130px] text-center"
            >
              <div className="h-9 w-9 rounded-xl border border-dashed border-border flex items-center justify-center mb-2">
                <UserPlus className="h-4 w-4 text-foreground-subtle" />
              </div>
              <p className="text-xs text-foreground-subtle">Open Slot</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Member Button */}
      {canAddMore && !showForm && (
        <Button
          onClick={() => setShowForm(true)}
          leftIcon={<UserPlus className="h-4 w-4" />}
          className="w-full"
        >
          Add Team Member ({memberCount}/{MAX_TEAM_SIZE})
        </Button>
      )}

      {memberCount >= MAX_TEAM_SIZE && (
        <div className="flex items-center justify-center gap-2 py-4 px-5 rounded-xl border border-success/30 bg-success/5 text-success text-sm font-semibold">
          <CheckCircle2 className="h-5 w-5" />
          Team is full — all 6 members registered!
        </div>
      )}

      {/* ── Add Member Form ─────────────────────────────── */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-6 bg-card border border-border rounded-2xl p-6"
          >
            {/* Form Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <UserPlus className="h-5 w-5 text-primary" />
                <div>
                  <h2 className="text-base font-bold text-foreground">Add New Member</h2>
                  <p className="text-xs text-foreground-muted mt-0.5">
                    Only 4 fields required — no login credentials needed
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setShowForm(false); setErrorMessage(null); setFormData(emptyForm); }}
                className="text-foreground-subtle hover:text-foreground p-1.5 rounded-lg hover:bg-card-hover transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Name */}
                <div>
                  <label className={labelCls}>Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Riya Sharma"
                      required
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Register Number */}
                <div>
                  <label className={labelCls}>Register Number *</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
                    <input
                      type="text"
                      name="registerNumber"
                      value={formData.registerNumber}
                      onChange={handleChange}
                      placeholder="e.g. 21CS043"
                      required
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className={labelCls}>Gender *</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
                  >
                    {GENDER_OPTIONS.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                {/* Section */}
                <div>
                  <label className={labelCls}>Section / Dept *</label>
                  <div className="relative">
                    <Layers className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
                    <input
                      type="text"
                      name="section"
                      value={formData.section}
                      onChange={handleChange}
                      placeholder="e.g. CSE-A or IT"
                      required
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button type="submit" isLoading={isAdding} leftIcon={<UserPlus className="h-4 w-4" />} className="flex-1">
                  Add Member
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => { setShowForm(false); setFormData(emptyForm); }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
