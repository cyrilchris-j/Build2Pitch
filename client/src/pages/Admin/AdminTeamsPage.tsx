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
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface MemberEntry {
  id?: string;
  name: string;
  email?: string;
  role: string;
  registerNumber?: string;
  gender?: string;
  section?: string;
}

interface TeamItem {
  id: string;
  teamNumber: number;
  name: string;
  teamCode: string;
  leaderId: string;
  leader: { name?: string; email?: string; registerNumber?: string; gender?: string; section?: string };
  members: MemberEntry[];
  ideaAssignment?: { ideaTitle?: string; industry?: string; assignedAt?: string };
  tableNumber?: string;
  submissionStatus?: string;
}

const emptyForm = { name: '', registerNumber: '', gender: 'MALE', section: '' };
const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
];

const inputCls =
  'w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl text-sm text-foreground placeholder-foreground-subtle focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors';

export const AdminTeamsPage: React.FC = () => {
  const [teams, setTeams] = useState<TeamItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null);

  // Add member form state per-team
  const [addingToTeam, setAddingToTeam] = useState<string | null>(null);
  const [addForm, setAddForm] = useState(emptyForm);
  const [addLoading, setAddLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  useEffect(() => { fetchTeams(); }, [page, filter]);

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

  const handleAddMember = async (teamId: string) => {
    if (!addForm.name || !addForm.registerNumber || !addForm.section) {
      showToast('error', 'All fields are required.');
      return;
    }
    setAddLoading(true);
    try {
      const res = await adminService.adminAddMember(teamId, addForm);
      const newMember = res.data?.data;
      setTeams((prev) =>
        prev.map((t) =>
          t.id === teamId
            ? { ...t, members: [...t.members, { ...newMember, role: 'developer' }] }
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

  const handleRemoveMember = async (teamId: string, memberId: string, memberName: string) => {
    if (!window.confirm(`Remove "${memberName}" from this team?`)) return;
    try {
      await adminService.adminRemoveMember(teamId, memberId);
      setTeams((prev) =>
        prev.map((t) =>
          t.id === teamId
            ? { ...t, members: t.members.filter((m) => (m.id || '') !== memberId) }
            : t
        )
      );
      showToast('success', `${memberName} removed from team.`);
    } catch (err: any) {
      showToast('error', err?.response?.data?.message || 'Failed to remove member');
    }
  };

  const handleRemoveLead = async (teamId: string, leadName: string) => {
    if (!window.confirm(`Remove Team Lead "${leadName}"? This will deactivate their account.`)) return;
    try {
      await adminService.adminRemoveTeamLead(teamId);
      setTeams((prev) =>
        prev.map((t) =>
          t.id === teamId
            ? { ...t, leader: {}, members: t.members.filter((m) => m.role !== 'leader') }
            : t
        )
      );
      showToast('success', `Team Lead removed.`);
    } catch (err: any) {
      showToast('error', err?.response?.data?.message || 'Failed to remove team lead');
    }
  };

  return (
    <PageContainer title="Teams Management" subtitle="Inspect, add, or remove team leads and members for all registered teams.">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className={`fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium shadow-lg ${
              toast.type === 'success'
                ? 'bg-success/10 border-success/30 text-success'
                : 'bg-danger/10 border-danger/30 text-danger'
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
          onSubmit={(e) => { e.preventDefault(); setPage(1); fetchTeams(); }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
            <input
              type="text" placeholder="Search Team ID, Name, or Lead..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl bg-background border border-border pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-foreground-muted" />
              <select
                value={filter}
                onChange={(e) => { setFilter(e.target.value); setPage(1); }}
                className="rounded-xl bg-background border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
              >
                <option value="all">All Teams</option>
                <option value="registered">Registered</option>
                <option value="idea_selected">Idea Selected</option>
                <option value="submitted">Submitted</option>
              </select>
            </div>
            <Button type="submit" variant="primary" size="sm">Search</Button>
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
                <tr><td colSpan={7} className="text-center py-12 text-foreground-muted">
                  <Loader2 className="h-6 w-6 animate-spin inline-block text-primary" />
                </td></tr>
              ) : teams.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-foreground-muted">No teams found.</td></tr>
              ) : (
                teams.map((team) => {
                  const isExpanded = expandedTeamId === team.id;
                  const leadName = team.leader?.name || team.members.find((m) => m.role === 'leader')?.name || 'N/A';
                  return (
                    <React.Fragment key={team.id}>
                      <tr className="hover:bg-card-hover transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-primary">{team.teamCode || team.id}</td>
                        <td className="py-3.5 px-4 font-semibold">{team.name}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <Shield className="h-3.5 w-3.5 text-primary shrink-0" />
                            {leadName}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 font-semibold">
                            <Users className="h-3.5 w-3.5 text-primary" />
                            {team.members.length}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-foreground-muted text-xs">{team.ideaAssignment?.ideaTitle || 'Not Selected'}</td>
                        <td className="py-3.5 px-4">
                          <Badge variant="accent">{team.submissionStatus || 'REGISTERED'}</Badge>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setExpandedTeamId(isExpanded ? null : team.id)}
                            className="p-1.5 rounded-lg bg-background border border-border text-foreground-muted hover:text-foreground hover:border-primary/40 transition-colors"
                          >
                            {isExpanded ? <ChevronUp className="h-4 w-4 text-primary" /> : <ChevronDown className="h-4 w-4" />}
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
                                  <Users className="h-4 w-4" /> Team Roster — {team.members.length}/6 Members
                                </h4>
                                {team.members.length < 6 && (
                                  <button
                                    onClick={() => { setAddingToTeam(addingToTeam === team.id ? null : team.id); setAddForm(emptyForm); }}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all"
                                  >
                                    <UserPlus className="h-3.5 w-3.5" />
                                    {addingToTeam === team.id ? 'Cancel' : 'Add Member'}
                                  </button>
                                )}
                              </div>

                              {/* Team Lead Card */}
                              {(team.leader?.name || team.members.find((m) => m.role === 'leader')) && (
                                <div>
                                  <p className="text-[10px] uppercase tracking-wider text-foreground-subtle font-semibold mb-2">Team Lead</p>
                                  <div className="flex items-start justify-between p-3 rounded-xl border border-primary/20 bg-primary/5">
                                    <div className="flex items-start gap-3">
                                      <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                        <Shield className="h-4 w-4 text-primary" />
                                      </div>
                                      <div className="text-xs space-y-0.5">
                                        <p className="font-bold text-foreground">{team.leader?.name || 'N/A'}</p>
                                        <p className="text-foreground-muted font-mono">{team.leader?.registerNumber || '—'}</p>
                                        <div className="flex gap-3 text-foreground-subtle">
                                          <span className="capitalize">{team.leader?.gender?.toLowerCase() || '—'}</span>
                                          <span>{team.leader?.section || '—'}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => handleRemoveLead(team.id, team.leader?.name || 'Team Lead')}
                                      className="p-1.5 rounded-lg text-foreground-subtle hover:text-danger hover:bg-danger/10 border border-transparent hover:border-danger/20 transition-all text-xs flex items-center gap-1"
                                      title="Remove Team Lead"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Members Grid */}
                              <div>
                                <p className="text-[10px] uppercase tracking-wider text-foreground-subtle font-semibold mb-2">Members</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {team.members.filter((m) => m.role !== 'leader').map((member, mIdx) => (
                                    <div key={mIdx} className="p-3 rounded-xl border border-border bg-card flex items-start justify-between gap-2">
                                      <div className="flex items-start gap-2.5 min-w-0">
                                        <div className="h-8 w-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                                          <User className="h-4 w-4 text-accent" />
                                        </div>
                                        <div className="text-xs min-w-0 space-y-0.5">
                                          <p className="font-bold text-foreground truncate">{member.name}</p>
                                          <p className="text-foreground-muted font-mono">{member.registerNumber || '—'}</p>
                                          <div className="flex gap-2 text-foreground-subtle">
                                            <span className="inline-flex items-center gap-0.5"><Hash className="h-2.5 w-2.5" />{member.section || '—'}</span>
                                            <span className="inline-flex items-center gap-0.5"><Layers className="h-2.5 w-2.5" />{member.gender?.toLowerCase() || '—'}</span>
                                          </div>
                                        </div>
                                      </div>
                                      <button
                                        onClick={() => handleRemoveMember(team.id, member.id || '', member.name)}
                                        className="p-1.5 rounded-lg text-foreground-subtle hover:text-danger hover:bg-danger/10 border border-transparent hover:border-danger/20 transition-all shrink-0"
                                        title="Remove member"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                  ))}
                                  {team.members.filter((m) => m.role !== 'leader').length === 0 && (
                                    <p className="text-xs text-foreground-subtle col-span-3">No members added yet.</p>
                                  )}
                                </div>
                              </div>

                              {/* Add Member Inline Form */}
                              <AnimatePresence>
                                {addingToTeam === team.id && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="border-t border-border pt-4">
                                      <p className="text-xs font-bold text-foreground mb-3 flex items-center gap-1.5">
                                        <UserPlus className="h-4 w-4 text-primary" /> Add New Member to {team.name}
                                      </p>
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <div className="relative">
                                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-subtle" />
                                          <input type="text" placeholder="Full Name *" value={addForm.name}
                                            onChange={(e) => setAddForm((p) => ({ ...p, name: e.target.value }))}
                                            className={inputCls} />
                                        </div>
                                        <div className="relative">
                                          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-subtle" />
                                          <input type="text" placeholder="Register No *" value={addForm.registerNumber}
                                            onChange={(e) => setAddForm((p) => ({ ...p, registerNumber: e.target.value }))}
                                            className={inputCls} />
                                        </div>
                                        <select value={addForm.gender}
                                          onChange={(e) => setAddForm((p) => ({ ...p, gender: e.target.value }))}
                                          className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary">
                                          {GENDER_OPTIONS.map(({ value, label }) => (
                                            <option key={value} value={value}>{label}</option>
                                          ))}
                                        </select>
                                        <div className="relative">
                                          <Layers className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-subtle" />
                                          <input type="text" placeholder="Section/Dept *" value={addForm.section}
                                            onChange={(e) => setAddForm((p) => ({ ...p, section: e.target.value }))}
                                            className={inputCls} />
                                        </div>
                                      </div>
                                      <div className="flex gap-2 mt-3">
                                        <button
                                          onClick={() => handleAddMember(team.id)}
                                          disabled={addLoading}
                                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-background hover:bg-primary-hover disabled:opacity-60 transition-all"
                                        >
                                          {addLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserPlus className="h-3.5 w-3.5" />}
                                          Add Member
                                        </button>
                                        <button
                                          onClick={() => { setAddingToTeam(null); setAddForm(emptyForm); }}
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
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="gap-1">
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="gap-1">
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};

export default AdminTeamsPage;
