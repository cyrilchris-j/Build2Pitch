import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { adminService } from '@/services/api';
import {
  Users,
  GraduationCap,
  Lightbulb,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Shield,
} from 'lucide-react';

interface StatsData {
  totalTeams: number;
  totalStudents: number;
  ideasAssigned: number;
  submitted: number;
  inProgress: number;
  incomplete: number;
}

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<StatsData>({
    totalTeams: 0,
    totalStudents: 0,
    ideasAssigned: 0,
    submitted: 0,
    inProgress: 0,
    incomplete: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const response = await adminService.getStats();
      if (response.data?.data) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'TOTAL TEAMS',
      value: stats.totalTeams,
      icon: Users,
      description: 'Registered participating teams',
    },
    {
      title: 'TOTAL STUDENTS',
      value: stats.totalStudents,
      icon: GraduationCap,
      description: 'Active student participants',
    },
    {
      title: 'IDEAS ASSIGNED',
      value: stats.ideasAssigned,
      icon: Lightbulb,
      description: 'Startup challenges allocated',
    },
    {
      title: 'SUBMITTED',
      value: stats.submitted,
      icon: CheckCircle2,
      description: 'Finalized & locked projects',
    },
    {
      title: 'IN PROGRESS',
      value: stats.inProgress,
      icon: Clock,
      description: 'Active deliverable drafts',
    },
    {
      title: 'INCOMPLETE',
      value: stats.incomplete,
      icon: AlertCircle,
      description: 'Pending submission setup',
    },
  ];

  return (
    <PageContainer
      title="Admin Command Center"
      subtitle="Real-time pulse of teams, student rosters, idea distribution, and startup submissions."
      actions={
        <div className="flex items-center gap-2">
          <Badge variant="accent" className="gap-1.5 py-1 px-3">
            <Shield className="h-3.5 w-3.5" /> ADMIN ACCESS ONLY
          </Badge>
        </div>
      }
    >
      {/* 6 Statistic Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Card key={idx} className="bg-[#111111] border-[#242424] hover:border-[#333333] transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8A8A8A]">
                  {card.title}
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#111111] border border-[#242424] text-[#E63946]">
                  <Icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-[#FFFFFF] font-display">
                  {isLoading ? '...' : card.value}
                </div>
                <p className="text-xs text-[#8A8A8A] mt-1">{card.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* System Status & Pipeline Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-[#111111] border-[#242424]">
          <CardHeader>
            <div className="flex items-center gap-2 text-[#E63946]">
              <TrendingUp className="h-5 w-5" />
              <CardTitle className="text-[#FFFFFF]">Submission Pipeline Overview</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-[#8A8A8A]">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#070707] border border-[#242424]">
              <span className="text-[#FFFFFF]">Final Locked Submissions</span>
              <span className="font-mono font-bold text-[#E63946]">{stats.submitted} Teams</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#070707] border border-[#242424]">
              <span className="text-[#FFFFFF]">In-Progress Deliverable Drafts</span>
              <span className="font-mono font-bold text-[#FFFFFF]">{stats.inProgress} Teams</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#070707] border border-[#242424]">
              <span className="text-[#FFFFFF]">Incomplete / Not Started</span>
              <span className="font-mono font-bold text-[#8A8A8A]">{stats.incomplete} Teams</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] border-[#242424]">
          <CardHeader>
            <div className="flex items-center gap-2 text-[#E63946]">
              <Shield className="h-5 w-5" />
              <CardTitle className="text-[#FFFFFF]">Security &amp; Authorization Enforcements</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-[#8A8A8A]">
            <div className="p-3 rounded-lg bg-[#070707] border border-[#242424] space-y-1">
              <span className="font-bold text-[#FFFFFF] block">Backend Authorization</span>
              <p>Every admin endpoint strictly validates JWT claims with <code className="text-[#E63946]">requireAuth + requireRole("ADMIN")</code>.</p>
            </div>
            <div className="p-3 rounded-lg bg-[#070707] border border-[#242424] space-y-1">
              <span className="font-bold text-[#FFFFFF] block">Submission State Guard</span>
              <p>Locked submissions cannot be mutated by Team Leads or Members once final submission is performed.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default AdminDashboardPage;
