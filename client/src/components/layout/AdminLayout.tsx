import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Lightbulb,
  Send,
  Shield,
  ChevronRight,
  BarChart3,
  Menu,
  X,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { to: '/admin/dashboard', label: 'Control Center', icon: LayoutDashboard, desc: 'Overview & stats' },
  { to: '/admin/teams', label: 'Teams', icon: Users, desc: 'Manage teams' },
  { to: '/admin/students', label: 'Students', icon: BarChart3, desc: 'Roster view' },
  { to: '/admin/ideas', label: 'Idea Pool', icon: Lightbulb, desc: 'Manage ideas' },
  { to: '/admin/submissions', label: 'Submissions', icon: Send, desc: 'Review deliverables' },
];

export const AdminLayout: React.FC = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-40 top-16 h-[calc(100vh-4rem)]',
          'transition-transform duration-300 ease-in-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:relative lg:top-auto lg:translate-x-0 lg:flex lg:flex-col',
          'w-64 shrink-0 border-r border-border bg-background-subtle overflow-y-auto'
        )}
      >
        {/* Admin Badge */}
        <div className="px-4 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple/20 to-purple-light/20 border border-purple/30 flex items-center justify-center shrink-0">
              <Shield className="h-4 w-4 text-purple-light" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <p className="text-[10px] text-purple-light uppercase tracking-wider font-bold">
                  Administrator
                </p>
              </div>
              <p className="text-sm font-bold text-foreground truncate">
                {user?.name || 'Admin'}
              </p>
              <p className="text-[10px] text-foreground-subtle truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 pb-2 text-[10px] text-foreground-subtle uppercase tracking-wider font-semibold">
            Event Management
          </p>
          {navItems.map(({ to, label, icon: Icon, desc }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                  isActive
                    ? 'bg-purple/10 text-purple-light border border-purple/20'
                    : 'text-foreground-muted hover:text-foreground hover:bg-card border border-transparent'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={clsx('h-4 w-4 shrink-0', isActive ? 'text-purple-light' : 'text-foreground-subtle group-hover:text-foreground-muted')} />
                  <div className="flex-1 min-w-0">
                    <p className="truncate">{label}</p>
                    <p className="text-[10px] text-foreground-subtle truncate">{desc}</p>
                  </div>
                  {isActive && <ChevronRight className="h-3 w-3 text-purple-light shrink-0" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-border">
          <div className="px-3 py-2.5 rounded-xl bg-purple/5 border border-purple/10">
            <p className="text-[10px] text-foreground-subtle uppercase tracking-wider font-semibold mb-1">
              Platform
            </p>
            <p className="text-xs font-bold text-purple-light">Build2Pitch 2026</p>
            <p className="text-[10px] text-foreground-subtle">Build2Pitch Event Platform</p>
          </div>
        </div>
      </aside>

      {/* Mobile toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed bottom-6 right-6 z-50 lg:hidden h-12 w-12 rounded-full bg-purple text-white shadow-glow-purple flex items-center justify-center"
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Page content */}
      <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};
