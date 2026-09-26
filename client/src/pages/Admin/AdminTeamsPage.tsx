import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { adminService } from '@/services/api';
import {
  Users, Search, Filter, ChevronLeft, ChevronRight,
  ChevronDown, ChevronUp, UserPlus, Trash2, Shield,
  Hash, Layers, User, X, CheckCircle2, AlertCircle, Loader2,
  Edit3, Plus, Phone, Mail, Check,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface MemberEntry {
  id?: string;
  _id?: string;
  userId?: string;
  name: string;
  email?: string;
  role: string;
  registerNumber?: string;
  gender?: string;
  section?: string;
  mobile?: string;
  mobileNumber?: string;
}

interface TeamLeader {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  registerNumber?: string;
  gender?: string;
  section?: string;
  mobile?: string;
  mobileNumber?: string;
}

interface TeamItem {
  id: string;
  teamNumber: number;
  name: string;
  teamCode: string;
  leaderId?: string | null;
  leader: TeamLeader | null;
  members: MemberEntry[];
  ideaAssignment?: { ideaTitle?: string; industry?: string; assignedAt?: string };
  tableNumber?: string;
  submissionStatus?: string;
}

const emptyForm = { name: '', registerNumber: '', gender: 'MALE', section: '' };
const emptyLeadForm = { name: '', registerNumber: '', gender: 'MALE', section: '', email: '', mobile: '' };

const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
];

const ROLE_OPTIONS = [
  { value: 'developer', label: 'Developer' },
  { value: 'designer', label: 'Designer' },
  { value: 'pitcher', label: 'Pitcher' },
  { value: 'researcher', label: 'Researcher' },
  { value: 'marketer', label: 'Marketer' },
];

const inputCls =
  'w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl text-sm text-foreground placeholder-foreground-subtle focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors';

const modalInputCls =
  'w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors';

export const AdminTeamsPage: React.FC = () => {
  const [teams, setTeams] = useState<TeamItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null);

  // Add member inline form state per-team
  const [addingToTeam, setAddingToTeam] = useState<string | null>(null);
  const [addForm, setAddForm] = useState(emptyForm);
  const [addLoading, setAddLoading] = useState(false);

  // Edit Team Lead Modal state
  const [editingLead, setEditingLead] = useState<{
    teamId: string;
    teamName: string;
    name: string;
    registerNumber: string;
    gender: string;
    section: string;
    email: string;
    mobile: string;
  } | null>(null);
  const [leadModalLoading, setLeadModalLoading] = useState(false);

  // Add Team Lead Modal state (when team has no lead)
  const [addingLeadToTeam, setAddingLeadToTeam] = useState<{
    teamId: string;
    teamName: string;
  } | null>(null);
  const [addLeadForm, setAddLeadForm] = useState(emptyLeadForm);
  const [addLeadLoading, setAddLeadLoading] = useState(false);

  // Edit Member Modal state
  const [editingMember, setEditingMember] = useState<{
    teamId: string;
    teamName: string;
    memberId: string;
    name: string;
    registerNumber: string;
    gender: string;
    section: string;
    role: string;
  } | null>(null);
  const [memberModalLoading, setMemberModalLoading] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  useEffect(() => {
    fetchTeams();
  }, [page, filter]);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchTeams = async () => {
    try {
      setIsLoading(true);
      const response = await adminService.getTeams({ page, limit: 10, search, filter });
      if (response.data?.data) {
        setTeams(response.data.data);
        if (response.data.meta) {
          setTotalPages(response.data.meta.totalPages || 1);
          setTotalRecords(response.data.meta.total || response.data.data.length);
        }
      }
    } catch (err) {
      console.error('Failed to fetch teams:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Add Member ─────────────────────────────────────────────────────────────
  const handleAddMember = async (teamId: string) => {
    if (!addForm.name || !addForm.registerNumber || !addForm.section) {
      showToast('error', 'Name, register number, and section are required.');
      return;
    }
    setAddLoading(true);
    try {
      const res = await adminService.adminAddMember(teamId, addForm);
      const newMember = res.data?.data;
      setTeams((prev) =>
        prev.map((t) =>
          t.id === teamId
            ? {
                ...t,
                members: [
                  ...t.members,
                  {
                    id: newMember.id || newMember._id,
                    _id: newMember._id || newMember.id,
                    name: newMember.name,
                    registerNumber: newMember.registerNumber,
                    gender: newMember.gender,
                    section: newMember.section,
                    role: newMember.role || 'developer',
                  },
                ],
              }
            : t
        )
      );
      setAddForm(emptyForm);
      setAddingToTeam(null);
      showToast('success', `${addForm.name} added to team!`);
    } catch (err: any) {
      showToast('error', err?.response?.data?.message || 'Failed to add member');
    } finally {
      setAddLoading(false);
    }
  };

  // ─── Edit Member ────────────────────────────────────────────────────────────
  const handleSaveMemberEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    if (!editingMember.name.trim() || !editingMember.registerNumber.trim() || !editingMember.section.trim()) {
      showToast('error', 'Name, register number, and section are required.');
      return;
    }

    setMemberModalLoading(true);
    try {
      await adminService.adminUpdateMember(editingMember.teamId, editingMember.memberId, {
        name: editingMember.name.trim(),
        registerNumber: editingMember.registerNumber.trim(),
        gender: editingMember.gender,
        section: editingMember.section.trim(),
        role: editingMember.role,
      });

      setTeams((prev) =>
        prev.map((t) =>
          t.id === editingMember.teamId
            ? {
                ...t,
                members: t.members.map((m) =>
                  (m.id === editingMember.memberId || m._id === editingMember.memberId || m.userId === editingMember.memberId)
                    ? {
                        ...m,
                        name: editingMember.name.trim(),
                        registerNumber: editingMember.registerNumber.trim(),
                        gender: editingMember.gender,
                        section: editingMember.section.trim(),
                        role: editingMember.role,
                      }
                    : m
                ),
              }
            : t
        )
      );

      showToast('success', `Member "${editingMember.name}" updated successfully!`);
      setEditingMember(null);
    } catch (err: any) {
      showToast('error', err?.response?.data?.message || 'Failed to update member');
    } finally {
      setMemberModalLoading(false);
    }
  };

  // ─── Remove Member ──────────────────────────────────────────────────────────
  const handleRemoveMember = async (teamId: string, memberId: string, memberName: string) => {
    if (!window.confirm(`Remove "${memberName}" from this team?`)) return;
    try {
      await adminService.adminRemoveMember(teamId, memberId);
      setTeams((prev) =>
        prev.map((t) =>
          t.id === teamId
            ? {
                ...t,
                members: t.members.filter(
                  (m) => (m.id || m._id || m.userId || '') !== memberId
                ),
              }
            : t
        )
      );
      showToast('success', `${memberName} removed from team.`);
    } catch (err: any) {
      showToast('error', err?.response?.data?.message || 'Failed to remove member');
    }
  };

  // ─── Add Team Lead ──────────────────────────────────────────────────────────
  const handleAddTeamLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addingLeadToTeam) return;
    if (!addLeadForm.name.trim() || !addLeadForm.registerNumber.trim() || !addLeadForm.section.trim()) {
      showToast('error', 'Name, register number, and section are required.');
      return;
    }

    setAddLeadLoading(true);
    try {
      const res = await adminService.adminAddTeamLead(addingLeadToTeam.teamId, {
        name: addLeadForm.name.trim(),
        registerNumber: addLeadForm.registerNumber.trim(),
        gender: addLeadForm.gender,
        section: addLeadForm.section.trim(),
        email: addLeadForm.email.trim() || undefined,
        mobile: addLeadForm.mobile.trim() || undefined,
      });

      const leaderData = res.data?.data?.leader;
      setTeams((prev) =>
        prev.map((t) =>
          t.id === addingLeadToTeam.teamId
            ? {
                ...t,
                leader: leaderData,
                leaderId: leaderData?.id || leaderData?._id,
                members: [
                  {
                    name: leaderData.name,
                    email: leaderData.email,
                    role: 'leader',
                    userId: leaderData.id || leaderData?._id,
                    registerNumber: leaderData.registerNumber,
                    mobileNumber: leaderData.mobile || '',
                    gender: leaderData.gender,
                    section: leaderData.section,
                  },
                  ...t.members.filter((m) => m.role !== 'leader'),
                ],
              }
            : t
        )
      );

      showToast('success', `Team Lead "${addLeadForm.name}" added successfully!`);
      setAddingLeadToTeam(null);
      setAddLeadForm(emptyLeadForm);
    } catch (err: any) {
      showToast('error', err?.response?.data?.message || 'Failed to add team lead');
    } finally {
      setAddLeadLoading(false);
    }
  };

  // ─── Edit Team Lead ─────────────────────────────────────────────────────────
  const handleSaveLeadEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead) return;
    if (!editingLead.name.trim() || !editingLead.registerNumber.trim() || !editingLead.section.trim()) {
      showToast('error', 'Name, register number, and section are required.');
      return;
    }

    setLeadModalLoading(true);
    try {
      const res = await adminService.adminUpdateTeamLead(editingLead.teamId, {
        name: editingLead.name.trim(),
        registerNumber: editingLead.registerNumber.trim(),
        gender: editingLead.gender,
        section: editingLead.section.trim(),
        email: editingLead.email.trim() || undefined,
        mobile: editingLead.mobile.trim() || undefined,
      });

      const updatedLead = res.data?.data?.leader;

      setTeams((prev) =>
        prev.map((t) =>
          t.id === editingLead.teamId
            ? {
                ...t,
                leader: {
                  ...t.leader,
                  ...(updatedLead || {}),
                  name: editingLead.name.trim(),
                  registerNumber: editingLead.registerNumber.trim(),
                  gender: editingLead.gender,
                  section: editingLead.section.trim(),
                  email: editingLead.email.trim(),
                  mobile: editingLead.mobile.trim(),
                },
                members: t.members.map((m) =>
                  m.role === 'leader'
                    ? {
                        ...m,
                        name: editingLead.name.trim(),
                        registerNumber: editingLead.registerNumber.trim(),
                        gender: editingLead.gender,
                        section: editingLead.section.trim(),
                        email: editingLead.email.trim() || m.email,
                        mobileNumber: editingLead.mobile.trim() || m.mobileNumber,
                      }
                    : m
                ),
              }
            : t
        )
      );

      showToast('success', `Team Lead "${editingLead.name}" updated successfully!`);
      setEditingLead(null);
    } catch (err: any) {
      showToast('error', err?.response?.data?.message || 'Failed to update team lead');
    } finally {
      setLeadModalLoading(false);
    }
  };

  // ─── Remove Team Lead ───────────────────────────────────────────────────────
  const handleRemoveLead = async (teamId: string, leadName: string) => {
    if (!window.confirm(`Remove Team Lead "${leadName}"? This will detach them from the team.`)) return;
    try {
      await adminService.adminRemoveTeamLead(teamId);
      setTeams((prev) =>
        prev.map((t) =>
          t.id === teamId
            ? { ...t, leader: null, leaderId: null, members: t.members.filter((m) => m.role !== 'leader') }
            : t
        )
      );
      showToast('success', 'Team Lead removed from team.');
    } catch (err: any) {
      showToast('error', err?.response?.data?.message || 'Failed to remove team lead');
    }
  };

  return (
    <PageContainer
      title="Teams Management"
      subtitle="Inspect, add, edit, or remove team leads and members for all registered teams."
    >
      {/* Toast Feedback */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className={`fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium shadow-xl ${
              toast.type === 'success'
                ? 'bg-success/15 border-success/30 text-success backdrop-blur-md'
                : 'bg-danger/15 border-danger/30 text-danger backdrop-blur-md'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search & Filter */}
      <Card className="bg-card border-border p-4 mb-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            fetchTeams();
          }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
            <input
              type="text"
              placeholder="Search Team Code, Name, or Lead..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl bg-background border border-border pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-foreground-muted" />
              <select
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setPage(1);
                }}
                className="rounded-xl bg-background border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
              >
                <option value="all">All Teams</option>
                <option value="registered">Registered</option>
                <option value="idea_selected">Idea Selected</option>
                <option value="submitted">Submitted</option>
              </select>
            </div>
            <Button type="submit" variant="primary" size="sm">
              Search
            </Button>
          </div>
        </form>
      </Card>

      {/* Teams Table */}
      <Card className="bg-card border-border p-0 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-foreground">
            <thead className="bg-background border-b border-border text-xs font-semibold uppercase tracking-wider text-foreground-muted">
              <tr>
                <th className="py-3.5 px-4">Team Code</th>
                <th className="py-3.5 px-4">Team Name</th>
                <th className="py-3.5 px-4">Team Lead</th>
                <th className="py-3.5 px-4">Members</th>
                <th className="py-3.5 px-4">Startup Idea</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Roster</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-foreground-muted">
                    <Loader2 className="h-6 w-6 animate-spin inline-block text-primary" />
                  </td>
                </tr>
              ) : teams.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-foreground-muted">
                    No teams found.
                  </td>
                </tr>
              ) : (
                teams.map((team) => {
                  const isExpanded = expandedTeamId === team.id;
                  const leadMember = team.members.find((m) => m.role === 'leader');
                  const leadName = team.leader?.name || leadMember?.name || 'No Lead';
                  const leadObj = team.leader || leadMember;
                  const hasLeader = Boolean(leadObj?.name);
                  const nonLeadMembers = team.members.filter((m) => m.role !== 'leader');

                  return (
                    <React.Fragment key={team.id}>
                      <tr className="hover:bg-card-hover transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-primary">
                          {team.teamCode || team.id}
                        </td>
                        <td className="py-3.5 px-4 font-semibold">{team.name}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <Shield
                              className={`h-3.5 w-3.5 shrink-0 ${hasLeader ? 'text-primary' : 'text-foreground-muted'}`}
                            />
                            <span className={hasLeader ? 'font-medium' : 'text-foreground-muted italic'}>
                              {leadName}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 font-semibold">
                            <Users className="h-3.5 w-3.5 text-primary" />
                            {team.members.length} / 6
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-foreground-muted text-xs">
                          {team.ideaAssignment?.ideaTitle || 'Not Selected'}
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge variant="accent">{team.submissionStatus || 'REGISTERED'}</Badge>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setExpandedTeamId(isExpanded ? null : team.id)}
                            className="p-1.5 rounded-lg bg-background border border-border text-foreground-muted hover:text-foreground hover:border-primary/40 transition-colors"
                            title={isExpanded ? 'Collapse Roster' : 'Expand Roster'}
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4 text-primary" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </button>
                        </td>
                      </tr>

                      {/* ── Expanded Roster Panel ── */}
                      {isExpanded && (
                        <tr className="bg-background-subtle">
                          <td colSpan={7} className="p-5 border-b border-border">
                            <div className="space-y-5">
                              {/* Panel header */}
                              <div className="flex items-center justify-between">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                                  <Users className="h-4 w-4" /> Team Roster — {team.members.length}/6 Total (Lead + Members)
                                </h4>
                                {team.members.length < 6 && (
                                  <button
                                    onClick={() => {
                                      setAddingToTeam(addingToTeam === team.id ? null : team.id);
                                      setAddForm(emptyForm);
                                    }}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all"
                                  >
                                    <UserPlus className="h-3.5 w-3.5" />
                                    {addingToTeam === team.id ? 'Cancel' : 'Add Member'}
                                  </button>
                                )}
                              </div>

                              {/* ─── Team Lead Section ─── */}
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-[10px] uppercase tracking-wider text-foreground-subtle font-bold">
                                    Team Lead
                                  </p>
                                </div>
                                {hasLeader ? (
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-primary/25 bg-primary/5 gap-3 hover:border-primary/40 transition-all">
                                    <div className="flex items-start gap-3 min-w-0">
                                      <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                        <Shield className="h-4.5 w-4.5 text-primary" />
                                      </div>
                                      <div className="text-xs space-y-0.5 min-w-0">
                                        <div className="flex items-center gap-2">
                                          <p className="font-bold text-foreground text-sm truncate">
                                            {leadObj?.name || 'N/A'}
                                          </p>
                                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">
                                            Lead
                                          </span>
                                        </div>
                                        <p className="text-foreground-muted font-mono">
                                          Reg No: <span className="text-foreground font-semibold">{leadObj?.registerNumber || '—'}</span>
                                        </p>
                                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-foreground-subtle pt-0.5">
                                          <span className="capitalize">{leadObj?.gender?.toLowerCase() || '—'}</span>
                                          <span>•</span>
                                          <span>Dept: {leadObj?.section || '—'}</span>
                                          {leadObj?.email && (
                                            <>
                                              <span>•</span>
                                              <span className="text-foreground-muted truncate max-w-[220px]">
                                                {leadObj.email}
                                              </span>
                                            </>
                                          )}
                                          {(leadObj?.mobile || leadObj?.mobileNumber) && (
                                            <>
                                              <span>•</span>
                                              <span>{leadObj.mobile || leadObj.mobileNumber}</span>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                                      <button
                                        onClick={() =>
                                          setEditingLead({
                                            teamId: team.id,
                                            teamName: team.name,
                                            name: leadObj?.name || '',
                                            registerNumber: leadObj?.registerNumber || '',
                                            gender: (leadObj?.gender || 'MALE').toUpperCase(),
                                            section: leadObj?.section || '',
                                            email: leadObj?.email || '',
                                            mobile: leadObj?.mobile || leadObj?.mobileNumber || '',
                                          })
                                        }
                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-primary bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all"
                                        title="Change / Edit Team Lead Details"
                                      >
                                        <Edit3 className="h-3.5 w-3.5" />
                                        <span>Edit Lead</span>
                                      </button>
                                      <button
                                        onClick={() => handleRemoveLead(team.id, leadObj?.name || 'Team Lead')}
                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-danger bg-danger/10 border border-danger/20 hover:bg-danger/20 transition-all"
                                        title="Remove Team Lead"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                        <span>Remove</span>
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-dashed border-border bg-card/60">
                                    <div className="flex items-center gap-2.5 text-xs text-foreground-muted">
                                      <AlertCircle className="h-4 w-4 text-warning" />
                                      <span>No Team Lead currently assigned to this team.</span>
                                    </div>
                                    <button
                                      onClick={() => {
                                        setAddingLeadToTeam({ teamId: team.id, teamName: team.name });
                                        setAddLeadForm(emptyLeadForm);
                                      }}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-background hover:bg-primary-hover transition-all"
                                    >
                                      <Plus className="h-3.5 w-3.5" /> Add Team Lead
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* ─── Members Grid ─── */}
                              <div>
                                <p className="text-[10px] uppercase tracking-wider text-foreground-subtle font-bold mb-2">
                                  Team Members ({nonLeadMembers.length})
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {nonLeadMembers.map((member, mIdx) => {
                                    const memberUniqueId =
                                      member.id || member._id || member.userId || `m-${mIdx}`;
                                    return (
                                      <div
                                        key={memberUniqueId}
                                        className="p-3.5 rounded-xl border border-border bg-card flex items-start justify-between gap-2 hover:border-primary/30 transition-all shadow-sm"
                                      >
                                        <div className="flex items-start gap-2.5 min-w-0">
                                          <div className="h-8 w-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                                            <User className="h-4 w-4 text-accent" />
                                          </div>
                                          <div className="text-xs min-w-0 space-y-0.5">
                                            <div className="flex items-center gap-1.5">
                                              <p className="font-bold text-foreground truncate">{member.name}</p>
                                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-background border border-border capitalize text-foreground-muted font-medium">
                                                {member.role || 'developer'}
                                              </span>
                                            </div>
                                            <p className="text-foreground-muted font-mono">
                                              Reg: <span className="text-foreground font-semibold">{member.registerNumber || '—'}</span>
                                            </p>
                                            <div className="flex gap-2 text-foreground-subtle text-[11px]">
                                              <span className="inline-flex items-center gap-0.5">
                                                <Hash className="h-2.5 w-2.5" />
                                                {member.section || '—'}
                                              </span>
                                              <span>•</span>
                                              <span className="capitalize">{member.gender?.toLowerCase() || '—'}</span>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                          <button
                                            onClick={() =>
                                              setEditingMember({
                                                teamId: team.id,
                                                teamName: team.name,
                                                memberId: memberUniqueId,
                                                name: member.name,
                                                registerNumber: member.registerNumber || '',
                                                gender: (member.gender || 'MALE').toUpperCase(),
                                                section: member.section || '',
                                                role: member.role || 'developer',
                                              })
                                            }
                                            className="p-1.5 rounded-lg text-foreground-subtle hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all"
                                            title="Edit member details"
                                          >
                                            <Edit3 className="h-3.5 w-3.5" />
                                          </button>
                                          <button
                                            onClick={() =>
                                              handleRemoveMember(team.id, memberUniqueId, member.name)
                                            }
                                            className="p-1.5 rounded-lg text-foreground-subtle hover:text-danger hover:bg-danger/10 border border-transparent hover:border-danger/20 transition-all"
                                            title="Remove member"
                                          >
                                            <Trash2 className="h-3.5 w-3.5" />
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                  {nonLeadMembers.length === 0 && (
                                    <div className="p-4 rounded-xl border border-dashed border-border text-center text-xs text-foreground-subtle col-span-3">
                                      No members added yet. Click &quot;Add Member&quot; to add up to 5 members.
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* ─── Add Member Inline Form ─── */}
                              <AnimatePresence>
                                {addingToTeam === team.id && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="border-t border-border pt-4">
                                      <p className="text-xs font-bold text-foreground mb-3 flex items-center gap-1.5">
                                        <UserPlus className="h-4 w-4 text-primary" /> Add New Member to{' '}
                                        <span className="text-primary">{team.name}</span>
                                      </p>
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <div className="relative">
                                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-subtle" />
                                          <input
                                            type="text"
                                            placeholder="Full Name *"
                                            value={addForm.name}
                                            onChange={(e) => setAddForm((p) => ({ ...p, name: e.target.value }))}
                                            className={inputCls}
                                          />
                                        </div>
                                        <div className="relative">
                                          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-subtle" />
                                          <input
                                            type="text"
                                            placeholder="Register No *"
                                            value={addForm.registerNumber}
                                            onChange={(e) =>
                                              setAddForm((p) => ({ ...p, registerNumber: e.target.value }))
                                            }
                                            className={inputCls}
                                          />
                                        </div>
                                        <select
                                          value={addForm.gender}
                                          onChange={(e) => setAddForm((p) => ({ ...p, gender: e.target.value }))}
                                          className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
                                        >
                                          {GENDER_OPTIONS.map(({ value, label }) => (
                                            <option key={value} value={value}>
                                              {label}
                                            </option>
                                          ))}
                                        </select>
                                        <div className="relative">
                                          <Layers className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-subtle" />
                                          <input
                                            type="text"
                                            placeholder="Section/Dept *"
                                            value={addForm.section}
                                            onChange={(e) =>
                                              setAddForm((p) => ({ ...p, section: e.target.value }))
                                            }
                                            className={inputCls}
                                          />
                                        </div>
                                      </div>
                                      <div className="flex gap-2 mt-3">
                                        <button
                                          onClick={() => handleAddMember(team.id)}
                                          disabled={addLoading}
                                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-background hover:bg-primary-hover disabled:opacity-60 transition-all shadow-md"
                                        >
                                          {addLoading ? (
                                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                          ) : (
                                            <UserPlus className="h-3.5 w-3.5" />
                                          )}
                                          Add Member
                                        </button>
                                        <button
                                          onClick={() => {
                                            setAddingToTeam(null);
                                            setAddForm(emptyForm);
                                          }}
                                          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs text-foreground-muted border border-border hover:bg-card transition-all"
                                        >
                                          <X className="h-3.5 w-3.5" /> Cancel
                                        </button>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs text-foreground-muted">
          Page <span className="font-bold text-foreground">{page}</span> of{' '}
          <span className="font-bold text-foreground">{totalPages}</span> ({totalRecords} records)
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="gap-1"
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* ─── MODAL: Edit Team Lead Details ─────────────────────────────────── */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {editingLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-border bg-card-subtle">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Edit Team Lead Details</h3>
                    <p className="text-xs text-foreground-muted">Team: {editingLead.teamName}</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingLead(null)}
                  className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-card-hover transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSaveLeadEdit} className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Full Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingLead.name}
                      onChange={(e) => setEditingLead({ ...editingLead, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className={modalInputCls}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Register Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingLead.registerNumber}
                      onChange={(e) => setEditingLead({ ...editingLead, registerNumber: e.target.value })}
                      placeholder="e.g. 21CS001"
                      className={modalInputCls}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Gender <span className="text-danger">*</span>
                    </label>
                    <select
                      value={editingLead.gender}
                      onChange={(e) => setEditingLead({ ...editingLead, gender: e.target.value })}
                      className={modalInputCls}
                    >
                      {GENDER_OPTIONS.map(({ value, label }) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Section / Department <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingLead.section}
                      onChange={(e) => setEditingLead({ ...editingLead, section: e.target.value })}
                      placeholder="e.g. CSE-A"
                      className={modalInputCls}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Email Address (Optional)
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-subtle" />
                      <input
                        type="email"
                        value={editingLead.email}
                        onChange={(e) => setEditingLead({ ...editingLead, email: e.target.value })}
                        placeholder="lead@college.edu"
                        className={`${modalInputCls} pl-9`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Mobile Number (Optional)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-subtle" />
                      <input
                        type="text"
                        value={editingLead.mobile}
                        onChange={(e) => setEditingLead({ ...editingLead, mobile: e.target.value })}
                        placeholder="+91 9876543210"
                        className={`${modalInputCls} pl-9`}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingLead(null)}
                    disabled={leadModalLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={leadModalLoading}
                    className="gap-1.5"
                  >
                    {leadModalLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                    Save Changes
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* ─── MODAL: Add Team Lead (if team has none) ─────────────────────────── */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {addingLeadToTeam && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-border bg-card-subtle">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                    <UserPlus className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Add Team Lead</h3>
                    <p className="text-xs text-foreground-muted">Assign Lead to: {addingLeadToTeam.teamName}</p>
                  </div>
                </div>
                <button
                  onClick={() => setAddingLeadToTeam(null)}
                  className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-card-hover transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleAddTeamLead} className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Full Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      value={addLeadForm.name}
                      onChange={(e) => setAddLeadForm({ ...addLeadForm, name: e.target.value })}
                      placeholder="e.g. Jane Lead"
                      className={modalInputCls}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Register Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      value={addLeadForm.registerNumber}
                      onChange={(e) => setAddLeadForm({ ...addLeadForm, registerNumber: e.target.value })}
                      placeholder="e.g. 21CS100"
                      className={modalInputCls}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Gender <span className="text-danger">*</span>
                    </label>
                    <select
                      value={addLeadForm.gender}
                      onChange={(e) => setAddLeadForm({ ...addLeadForm, gender: e.target.value })}
                      className={modalInputCls}
                    >
                      {GENDER_OPTIONS.map(({ value, label }) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Section / Department <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      value={addLeadForm.section}
                      onChange={(e) => setAddLeadForm({ ...addLeadForm, section: e.target.value })}
                      placeholder="e.g. IT-B"
                      className={modalInputCls}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Email Address (Optional)
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-subtle" />
                      <input
                        type="email"
                        value={addLeadForm.email}
                        onChange={(e) => setAddLeadForm({ ...addLeadForm, email: e.target.value })}
                        placeholder="lead@example.com"
                        className={`${modalInputCls} pl-9`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Mobile Number (Optional)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-subtle" />
                      <input
                        type="text"
                        value={addLeadForm.mobile}
                        onChange={(e) => setAddLeadForm({ ...addLeadForm, mobile: e.target.value })}
                        placeholder="+91 9988776655"
                        className={`${modalInputCls} pl-9`}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAddingLeadToTeam(null)}
                    disabled={addLeadLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={addLeadLoading}
                    className="gap-1.5"
                  >
                    {addLeadLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                    Add Team Lead
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* ─── MODAL: Edit Member Details ─────────────────────────────────────── */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {editingMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-border bg-card-subtle">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Edit Member Details</h3>
                    <p className="text-xs text-foreground-muted">Team: {editingMember.teamName}</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingMember(null)}
                  className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-card-hover transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSaveMemberEdit} className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Full Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingMember.name}
                      onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                      placeholder="e.g. Alex Mercer"
                      className={modalInputCls}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Register Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingMember.registerNumber}
                      onChange={(e) => setEditingMember({ ...editingMember, registerNumber: e.target.value })}
                      placeholder="e.g. 21CS050"
                      className={modalInputCls}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Gender <span className="text-danger">*</span>
                    </label>
                    <select
                      value={editingMember.gender}
                      onChange={(e) => setEditingMember({ ...editingMember, gender: e.target.value })}
                      className={modalInputCls}
                    >
                      {GENDER_OPTIONS.map(({ value, label }) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Section / Department <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingMember.section}
                      onChange={(e) => setEditingMember({ ...editingMember, section: e.target.value })}
                      placeholder="e.g. CS-B"
                      className={modalInputCls}
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Role / Track
                    </label>
                    <select
                      value={editingMember.role}
                      onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                      className={modalInputCls}
                    >
                      {ROLE_OPTIONS.map(({ value, label }) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingMember(null)}
                    disabled={memberModalLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={memberModalLoading}
                    className="gap-1.5"
                  >
                    {memberModalLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                    Save Changes
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

export default AdminTeamsPage;
