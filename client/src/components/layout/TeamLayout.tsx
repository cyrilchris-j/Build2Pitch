import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Lightbulb,
  FileText,
  Send,
  ChevronRight,
  Zap,
  Menu,
  X,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { to: '/team/dashboard', label: 'Dashboard', icon: LayoutDashboard, desc: 'Command center' },
  { to: '/team/members', label: 'Team Members', icon: Users, desc: 'Manage team' },
  { to: '/team/idea', label: 'Your Idea', icon: Lightbulb, desc: 'Startup idea' },
  { to: '/team/instructions', label: 'Instructions', icon: FileText, desc: 'Event guide' },
  { to: '/team/submission', label: 'Submission', icon: Send, desc: 'Launch work' },
];

export const TeamLayout: React.FC = () => {
  const { team, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const teamCode = (team as unknown as { teamCode?: string })?.teamCode || '';
  const teamName = (team as unknown as { name?: string })?.name || user?.name?.split(' ')[0] || '';

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        className={clsx(
          'fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)]',
          'w-64 border-r border-border bg-background-subtle',
          'flex flex-col shrink-0',
          'lg:translate-x-0 lg:animate-none transition-transform duration-300 ease-in-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Team Badge */}
        <div className="px-4 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center shrink-0">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-foreground-subtle uppercase tracking-wider font-semibold mb-0.5">
                Your Team
              </p>
              <p className="text-sm font-bold text-foreground truncate">
                {teamName || 'Loading...'}
              </p>
              {teamCode && (
                <p className="text-xs text-primary font-mono">{teamCode}</p>
              )}
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon, desc }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-glow-sm'
                    : 'text-foreground-muted hover:text-foreground hover:bg-card border border-transparent'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={clsx('h-4 w-4 shrink-0 transition-colors', isActive ? 'text-primary' : 'text-foreground-subtle group-hover:text-foreground-muted')} />
                  <div className="flex-1 min-w-0">
                    <p className="truncate">{label}</p>
                    <p className="text-[10px] text-foreground-subtle truncate">{desc}</p>
                  </div>
                  {isActive && <ChevronRight className="h-3 w-3 text-primary shrink-0" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Phase indicator */}
        <div className="px-4 py-4 border-t border-border">
          <div className="px-3 py-2.5 rounded-xl bg-primary/5 border border-primary/10">
            <p className="text-[10px] text-foreground-subtle uppercase tracking-wider font-semibold mb-1">Event Phase</p>
            <p className="text-xs font-bold text-primary flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              BUILD IN PROGRESS
            </p>
          </div>
        </div>
      </motion.aside>

      {/* Mobile toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed bottom-6 right-6 z-50 lg:hidden h-12 w-12 rounded-full bg-primary text-background shadow-glow-primary flex items-center justify-center"
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Page content */}
      <main className="flex-1 min-w-0 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};
