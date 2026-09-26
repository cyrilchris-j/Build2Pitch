import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Lightbulb,
  FileText,
  Send,
  ChevronRight,
  Menu,
  X,
  LogOut,
  User,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { to: '/team/dashboard', label: 'Dashboard', icon: LayoutDashboard, desc: 'Overview & status' },
  { to: '/team/members', label: 'Team', icon: Users, desc: 'Manage your squad' },
  { to: '/team/idea', label: 'My Idea', icon: Lightbulb, desc: 'Your startup concept' },
  { to: '/team/instructions', label: 'Guide', icon: FileText, desc: 'Event instructions' },
  { to: '/team/submission', label: 'Submit', icon: Send, desc: 'Deliverables & final lock' },
];

export const TeamLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">

      {/* ── Mobile Backdrop ──────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────── */}
      {/* Desktop: always visible in flex row (w-64, relative)
          Mobile:  fixed drawer that slides in from left */}
      <aside
        className={clsx(
          // Mobile: fixed drawer
          'fixed inset-y-0 left-0 z-40 top-16 h-[calc(100vh-4rem)]',
          'transition-transform duration-300 ease-in-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          // Desktop: back in flow, always visible
          'lg:relative lg:top-auto lg:translate-x-0 lg:flex lg:flex-col',
          // Common sizing & styles
          'w-64 shrink-0 border-r border-border bg-background-subtle overflow-y-auto'
        )}
      >
        <div className="flex flex-col h-full">
          {/* User Profile */}
          <div className="px-4 py-5 border-b border-border shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center shrink-0">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-primary uppercase tracking-wider font-bold mb-0.5">
                  Team Lead
                </p>
                <p className="text-sm font-bold text-foreground truncate">
                  {user?.name || 'Team Lead'}
                </p>
                <p className="text-[10px] text-foreground-subtle truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            <p className="px-3 pb-3 text-[10px] text-foreground-subtle uppercase tracking-wider font-semibold">
              Team Workspace
            </p>
            {navItems.map(({ to, label, icon: Icon, desc }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group border',
                    isActive
                      ? 'bg-primary/10 text-primary border-primary/20'
                      : 'text-foreground-muted hover:text-foreground hover:bg-card border-transparent'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={clsx(
                        'h-4 w-4 shrink-0',
                        isActive
                          ? 'text-primary'
                          : 'text-foreground-subtle group-hover:text-foreground-muted'
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="truncate leading-none mb-0.5">{label}</p>
                      <p className="text-[10px] text-foreground-subtle truncate">{desc}</p>
                    </div>
                    {isActive && <ChevronRight className="h-3 w-3 text-primary shrink-0" />}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Footer: sprint status + sign out */}
          <div className="px-4 py-4 border-t border-border space-y-3 shrink-0">
            <div className="px-3 py-2.5 rounded-xl bg-primary/5 border border-primary/10">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] text-foreground-subtle uppercase tracking-wider font-semibold">
                  Sprint
                </p>
                <span className="text-[10px] font-bold text-success">Active</span>
              </div>
              <p className="text-xs font-bold text-primary">Build2Pitch 2026</p>
              <p className="text-[10px] text-foreground-subtle mt-0.5">2–6 members · Startup track</p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground-muted hover:text-danger hover:bg-danger/10 border border-transparent hover:border-danger/20 transition-all"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────── */}
      <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
        <Outlet />
      </main>

      {/* ── Mobile FAB (hamburger) ───────────────────────── */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed bottom-6 right-6 z-50 lg:hidden h-12 w-12 rounded-full bg-primary text-background shadow-glow-primary flex items-center justify-center transition-transform active:scale-95"
        aria-label="Toggle navigation"
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
    </div>
  );
};
