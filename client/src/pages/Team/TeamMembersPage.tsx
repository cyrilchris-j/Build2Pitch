import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserPlus,
  Mail,
  Hash,
  Phone,
  User,
  Layers,
  Lock,
  Eye,
  EyeOff,
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
  { value: 'OTHER', label: 'Other' },
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
  const color = (roleColors[member.role] || 'default') as 'primary' | 'accent' | 'purple' | 'success' | 'warning' | 'danger' | 'default';

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
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-foreground">{member.name}</p>
              {isLead && (
                <Badge variant="primary" className="text-[10px]">LEAD</Badge>
              )}
            </div>
            <p className="text-xs text-foreground-muted mt-0.5">{member.email}</p>
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

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-foreground-muted">
        <div className="flex items-center gap-1.5">
          <Hash className="h-3 w-3 shrink-0" />
          <span className="truncate">{member.registerNumber || '—'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Phone className="h-3 w-3 shrink-0" />
          <span className="truncate">{member.mobile || '—'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <User className="h-3 w-3 shrink-0" />
          <span>{member.gender || '—'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Layers className="h-3 w-3 shrink-0" />
          <span className="truncate">{member.section || '—'}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <Badge variant={color}>{member.role}</Badge>
      </div>
    </motion.div>
  );
};

const emptyForm = {
  name: '',
  registerNumber: '',
  email: '',
  mobile: '',
  gender: 'MALE',
  section: '',
  password: '',
  confirmPassword: '',
};

export const TeamMembersPage: React.FC = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isTeamLead = user?.role?.toUpperCase() === 'TEAM_LEAD';
  // Total 6 members = 1 lead + 5 members. Lead is not in this list from the API.
  const MAX_ADDITIONAL_MEMBERS = 5;
  const memberCount = members.length;
  const canAddMore = memberCount < MAX_ADDITIONAL_MEMBERS && isTeamLead;

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const res = await teamService.getMembers();
      const data = res.data?.data;
      if (Array.isArray(data)) {
        setMembers(data);
      }
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

    const { name, registerNumber, email, mobile, gender, section, password, confirmPassword } = formData;
    if (!name || !registerNumber || !email || !mobile || !gender || !section || !password) {
      setErrorMessage('All fields are required.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsAdding(true);
    try {
      const res = await teamService.addMember({
        name: name.trim(),
        registerNumber: registerNumber.trim(),
        email: email.trim().toLowerCase(),
        mobile: mobile.trim(),
        gender,
        section: section.trim(),
        password,
      });

      const newMember = res.data?.data;
      if (newMember) {
        setMembers((prev) => [...prev, newMember as TeamMember]);
        setSuccessMessage(`${name.trim()} has been added to your team!`);
        setFormData(emptyForm);
        setShowForm(false);
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to add member');
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

  const genderCount = { MALE: 0, FEMALE: 0, OTHER: 0 };
  members.forEach((m) => {
    const g = (m.gender || 'MALE').toUpperCase();
    if (g in genderCount) genderCount[g as keyof typeof genderCount]++;
  });
  const hasFemale = genderCount.FEMALE > 0;

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
              {memberCount}/{MAX_ADDITIONAL_MEMBERS} members added (6 total including you)
            </p>
          </div>
        </div>
        <ProgressBar
          value={memberCount}
          max={MAX_ADDITIONAL_MEMBERS}
          color={memberCount >= MAX_ADDITIONAL_MEMBERS ? 'success' : 'primary'}
          className="mt-3"
        />
      </div>

      {/* Gender compliance warning */}
      {!hasFemale && memberCount > 0 && (
        <div className="mb-4 p-3 rounded-xl border border-warning/30 bg-warning/5 flex items-center gap-2 text-warning text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>At least 1 female member is required per team rule.</span>
        </div>
      )}
      {hasFemale && (
        <div className="mb-4 p-3 rounded-xl border border-success/30 bg-success/5 flex items-center gap-2 text-success text-sm">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Gender requirement met — team has {genderCount.FEMALE} female member{genderCount.FEMALE > 1 ? 's' : ''}.</span>
        </div>
      )}

      {/* Success / Error banners */}
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
          {Array.from({ length: MAX_ADDITIONAL_MEMBERS - memberCount }).map((_, i) => (
            <motion.div
              key={`empty-${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border border-dashed border-border rounded-2xl p-5 flex flex-col items-center justify-center min-h-[140px] text-center"
            >
              <div className="h-9 w-9 rounded-xl border border-dashed border-border flex items-center justify-center mb-2">
                <UserPlus className="h-4 w-4 text-foreground-subtle" />
              </div>
              <p className="text-xs text-foreground-subtle">Empty Slot</p>
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
          Add Team Member ({memberCount}/{MAX_ADDITIONAL_MEMBERS})
        </Button>
      )}

      {memberCount >= MAX_ADDITIONAL_MEMBERS && (
        <div className="flex items-center justify-center gap-2 py-4 px-5 rounded-xl border border-success/30 bg-success/5 text-success text-sm font-semibold">
          <CheckCircle2 className="h-5 w-5" />
          Team is full! All 6 members registered.
        </div>
      )}

      {/* Add Member Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-6 bg-card border border-border rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <UserPlus className="h-5 w-5 text-primary" />
                <h2 className="text-base font-bold text-foreground">Add New Member</h2>
              </div>
              <button
                onClick={() => { setShowForm(false); setErrorMessage(null); setFormData(emptyForm); }}
                className="text-foreground-subtle hover:text-foreground p-1 rounded-lg hover:bg-card-hover transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-medium text-foreground-muted mb-1.5">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Riya Sharma" required
                      className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder-foreground-subtle focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors" />
                  </div>
                </div>

                {/* Register Number */}
                <div>
                  <label className="block text-xs font-medium text-foreground-muted mb-1.5">Register Number *</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
                    <input type="text" name="registerNumber" value={formData.registerNumber} onChange={handleChange} placeholder="e.g. 21CS043" required
                      className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder-foreground-subtle focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors" />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-foreground-muted mb-1.5">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="member@college.edu" required
                      className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder-foreground-subtle focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors" />
                  </div>
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-xs font-medium text-foreground-muted mb-1.5">Mobile *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
                    <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="9876543210" required
                      className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder-foreground-subtle focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors" />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-medium text-foreground-muted mb-1.5">Gender *</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} required
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors">
                    {GENDER_OPTIONS.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                {/* Section */}
                <div>
                  <label className="block text-xs font-medium text-foreground-muted mb-1.5">Section / Dept *</label>
                  <div className="relative">
                    <Layers className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
                    <input type="text" name="section" value={formData.section} onChange={handleChange} placeholder="e.g. CSE-A" required
                      className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder-foreground-subtle focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors" />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground-muted mb-1.5">Login Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
                    <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="Min 6 characters" required
                      className="w-full pl-9 pr-10 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder-foreground-subtle focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-subtle hover:text-foreground">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground-muted mb-1.5">Confirm Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
                    <input type={showPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Repeat password" required
                      className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder-foreground-subtle focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors" />
                  </div>
                </div>
              </div>

              {/* Hint */}
              <p className="text-xs text-foreground-subtle">
                The member will use their email + password to login at <strong className="text-foreground-muted">/member-login</strong>
              </p>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button type="submit" isLoading={isAdding} leftIcon={<UserPlus className="h-4 w-4" />} className="flex-1">
                  Add Member
                </Button>
                <Button type="button" variant="secondary" onClick={() => { setShowForm(false); setFormData(emptyForm); }}>
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
