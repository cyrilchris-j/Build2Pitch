import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { adminService } from '@/services/api';
import { StatCard } from '@/components/ui/StatCard';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { EventCountdown } from '@/components/countdown/EventCountdown';
import { useEventSettings } from '@/hooks/useEventSettings';
import {
  Users,
  GraduationCap,
  Lightbulb,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Shield,
} from 'lucide-react';

interface StatsData {
  totalTeams: number;
  totalStudents: number;
  ideasAssigned: number;
  ideasRemaining?: number;
  submitted: number;
  inProgress: number;
  incomplete: number;
}

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<StatsData>({
    totalTeams: 0,
    totalStudents: 0,
    ideasAssigned: 0,
    ideasRemaining: 30,
    submitted: 0,
    inProgress: 0,
    incomplete: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState<string>('');
  const { settings } = useEventSettings();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getStats();
      if (response.data?.data) {
        setStats(response.data.data as StatsData);
        setLastFetch(new Date().toLocaleTimeString('en-IN'));
      }
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8 gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-purple/10 border border-purple/20 flex items-center justify-center">
            <Shield className="h-5 w-5 text-purple-light" />
          </div>
          <div>
            <h1 className="text-xl font-black text-foreground tracking-tight">Control Center</h1>
            <p className="text-xs text-foreground-muted">
              Build2Pitch 2026 — Event Administration
              {lastFetch && <span className="ml-2 text-foreground-subtle">Updated: {lastFetch}</span>}
            </p>
          </div>
        </div>
        <button
          onClick={fetchStats}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-sm text-foreground-muted hover:text-foreground hover:bg-card transition-all disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </motion.div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <StatCard
              label="Total Teams"
              value={stats.totalTeams}
              icon={<Users className="h-5 w-5" />}
              color="primary"
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
            <StatCard
              label="Total Students"
              value={stats.totalStudents}
              icon={<GraduationCap className="h-5 w-5" />}
              color="accent"
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.11 }}>
            <StatCard
              label="Ideas Assigned"
              value={stats.ideasAssigned}
              subValue={`${stats.ideasRemaining ?? '—'} remaining`}
              icon={<Lightbulb className="h-5 w-5" />}
              color="warning"
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
            <StatCard
              label="Submitted"
              value={stats.submitted}
              icon={<CheckCircle2 className="h-5 w-5" />}
              color="success"
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17 }}>
            <StatCard
              label="In Progress"
              value={stats.inProgress}
              icon={<Clock className="h-5 w-5" />}
              color="accent"
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.20 }}>
            <StatCard
              label="Not Started"
              value={stats.incomplete}
              icon={<AlertCircle className="h-5 w-5" />}
              color="danger"
            />
          </motion.div>
        </div>
      )}

      {/* Bottom row: Countdown + Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Event Countdown */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <EventCountdown settings={settings} />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-2xl overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-bold text-foreground">Quick Actions</h2>
          </div>
          <div className="p-4 space-y-2">
            {[
              { to: '/admin/teams', label: 'View All Teams', desc: 'Browse registered teams', icon: Users, color: 'text-primary' },
              { to: '/admin/ideas', label: 'Manage Ideas', desc: 'Add, edit, or disable ideas', icon: Lightbulb, color: 'text-warning' },
              { to: '/admin/submissions', label: 'Review Submissions', desc: 'Check deliverables', icon: CheckCircle2, color: 'text-success' },
              { to: '/admin/students', label: 'Student Directory', desc: 'All registered students', icon: GraduationCap, color: 'text-accent' },
            ].map(({ to, label, desc, icon: Icon, color }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-background transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-lg bg-card-hover border border-border flex items-center justify-center shrink-0`}>
                    <Icon className={`h-4 w-4 ${color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{label}</p>
                    <p className="text-xs text-foreground-muted">{desc}</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-foreground-subtle group-hover:text-foreground group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
