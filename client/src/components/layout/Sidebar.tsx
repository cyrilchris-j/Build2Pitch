import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Lightbulb,
  FileText,
  UploadCloud,
  Shield,
  GraduationCap,
  Sparkles,
  Inbox,
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface SidebarProps {
  type?: 'team' | 'admin';
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ type = 'team', className }) => {
  const teamItems = [
    { label: 'Overview', path: '/team/dashboard', icon: LayoutDashboard },
    { label: 'Team Members', path: '/team/members', icon: Users },
    { label: 'Assigned Idea', path: '/team/idea', icon: Lightbulb },
    { label: 'Instructions', path: '/team/instructions', icon: FileText },
    { label: 'Submit Deliverable', path: '/team/submission', icon: UploadCloud },
  ];

  const adminItems = [
    { label: 'Admin Overview', path: '/admin/dashboard', icon: Shield },
    { label: 'Teams Management', path: '/admin/teams', icon: Users },
    { label: 'Students Directory', path: '/admin/students', icon: GraduationCap },
    { label: 'Idea Bank', path: '/admin/ideas', icon: Sparkles },
    { label: 'Submissions', path: '/admin/submissions', icon: Inbox },
  ];

  const navItems = type === 'team' ? teamItems : adminItems;

  return (
    <aside
      className={cn(
        'w-64 shrink-0 border-r border-[#242424] bg-[#070707] p-4 flex flex-col justify-between min-h-[calc(100vh-4rem)] text-[#FFFFFF]',
        className
      )}
    >
      <div className="space-y-6">
        <div className="px-3 py-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8A]">
            {type === 'team' ? 'Team Workspace' : 'Command Center'}
          </p>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3.5 h-11 rounded-lg text-sm font-medium transition-colors duration-150',
                    isActive
                      ? 'bg-[#111111] border border-[#242424] text-[#E63946]'
                      : 'text-[#8A8A8A] hover:bg-[#111111] hover:text-[#FFFFFF]'
                  )
                }
              >
                <Icon className="h-4 w-4 shrink-0 text-current" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="rounded-xl border border-[#242424] bg-[#111111] p-3.5 text-xs text-[#8A8A8A]">
        <div className="flex items-center justify-between mb-1.5 font-medium text-[#FFFFFF]">
          <span>Sprint Status</span>
          <span className="text-[#E63946] font-semibold">Active</span>
        </div>
        <p className="leading-relaxed text-[11px] text-[#8A8A8A]">
          2 to 6 member team incubator track. Deliverables close at event conclusion.
        </p>
      </div>
    </aside>
  );
};
