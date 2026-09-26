import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { adminService } from '@/services/api';
import {
  Users,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Mail,
  BookOpen,
} from 'lucide-react';

interface TeamItem {
  id: string;
  teamNumber: number;
  name: string;
  teamCode: string;
  leaderId: string;
  leader: {
    name?: string;
    email?: string;
    registerNumber?: string;
    mobileNumber?: string;
    gender?: string;
    section?: string;
  };
  members: {
    id?: string;
    name: string;
    email: string;
    role: string;
    registerNumber?: string;
    mobileNumber?: string;
    gender?: string;
    section?: string;
  }[];
  ideaAssignment?: {
    ideaTitle?: string;
    industry?: string;
    assignedAt?: string;
  };
  tableNumber?: string;
  submissionStatus?: string;
}

export const AdminTeamsPage: React.FC = () => {
  const [teams, setTeams] = useState<TeamItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null);

  useEffect(() => {
    fetchTeams();
  }, [page, filter]);

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchTeams();
  };

  const toggleExpandRoster = (id: string) => {
    setExpandedTeamId(expandedTeamId === id ? null : id);
  };

  return (
    <PageContainer
      title="Teams Management"
      subtitle="Inspect and manage all registered teams, rosters, table assignments, and startup ideas."
    >
      {/* Search & Filter Controls */}
      <Card className="bg-card border-border p-4 mb-6">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
            <input
              type="text"
              placeholder="Search Team ID, Name, or Lead..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg bg-background border border-border pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary"
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
                className="rounded-lg bg-background border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
              >
                <option value="all">All Teams</option>
                <option value="registered">Registered</option>
                <option value="idea_selected">Idea Selected</option>
                <option value="in_progress">In Progress</option>
                <option value="submitted">Submitted</option>
              </select>
            </div>
            <Button type="submit" variant="primary" size="sm">
              Search
            </Button>
          </div>
        </form>
      </Card>

      {/* Dark Table Layout */}
      <Card className="bg-card border-border p-0 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-foreground">
            <thead className="bg-background border-b border-border text-xs font-semibold uppercase tracking-wider text-foreground-muted">
              <tr>
                <th className="py-3.5 px-4">Team ID / Code</th>
                <th className="py-3.5 px-4">Team Name</th>
                <th className="py-3.5 px-4">Team Lead</th>
                <th className="py-3.5 px-4">Members</th>
                <th className="py-3.5 px-4">Startup Idea</th>
                <th className="py-3.5 px-4">Assignment Time</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242424]">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-foreground-muted">
                    Loading team records...
                  </td>
                </tr>
              ) : teams.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-foreground-muted">
                    No teams found matching search/filter criteria.
                  </td>
                </tr>
              ) : (
                teams.map((team) => {
                  const isExpanded = expandedTeamId === team.id;
                  const leadName = team.leader?.name || team.members.find((m) => m.role === 'leader')?.name || 'N/A';
                  return (
                    <React.Fragment key={team.id}>
                      <tr className="hover:bg-[#181818] transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-primary">
                          {team.teamCode || team.id}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-foreground">
                          {team.name}
                        </td>
                        <td className="py-3.5 px-4 text-foreground">
                          {leadName}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                            <Users className="h-3.5 w-3.5 text-primary" />
                            {team.members.length}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-foreground-muted">
                          {team.ideaAssignment?.ideaTitle || 'Not Selected'}
                        </td>
                        <td className="py-3.5 px-4 text-xs font-mono text-foreground-muted">
                          {team.ideaAssignment?.assignedAt
                            ? new Date(team.ideaAssignment.assignedAt).toLocaleDateString()
                            : 'N/A'}
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge variant="accent">
                            {team.submissionStatus || 'REGISTERED'}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => toggleExpandRoster(team.id)}
                            className="p-1 rounded bg-background border border-border text-foreground-muted hover:text-foreground transition-colors"
                            aria-label="Expand roster"
                          >
                            {isExpanded ? <ChevronUp className="h-4 w-4 text-primary" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Roster Row */}
                      {isExpanded && (
                        <tr className="bg-background">
                          <td colSpan={8} className="p-4 border-b border-border">
                            <div className="space-y-3">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                                <Users className="h-4 w-4" /> Team Roster &amp; Student Registration Details
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {team.members.map((member, mIdx) => (
                                  <div
                                    key={mIdx}
                                    className="p-3 rounded-lg border border-border bg-card space-y-1 text-xs"
                                  >
                                    <div className="flex items-center justify-between font-bold text-foreground">
                                      <span>{member.name}</span>
                                      <Badge variant="muted" className="text-[10px] lowercase">
                                        {member.role}
                                      </Badge>
                                    </div>
                                    <div className="text-foreground-muted flex items-center gap-1">
                                      <BookOpen className="h-3 w-3 text-primary" /> Reg: <span className="text-foreground font-mono">{member.registerNumber || 'REG-2026'}</span>
                                    </div>
                                    <div className="text-foreground-muted flex items-center gap-1">
                                      <Mail className="h-3 w-3 text-foreground-muted" /> {member.email}
                                    </div>
                                    <div className="text-foreground-muted flex items-center gap-1 justify-between pt-1 border-t border-border">
                                      <span>Mobile: {member.mobileNumber || 'N/A'}</span>
                                      <span>Sec: {member.section || 'A'}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
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

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs text-foreground-muted">
          Page <span className="font-bold text-foreground">{page}</span> of{' '}
          <span className="font-bold text-foreground">{totalPages}</span> ({totalRecords} Total Records)
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
    </PageContainer>
  );
};

export default AdminTeamsPage;
