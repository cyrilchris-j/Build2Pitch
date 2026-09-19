import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';

export const AdminLayout: React.FC = () => {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar type="admin" className="hidden md:flex" />
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};
