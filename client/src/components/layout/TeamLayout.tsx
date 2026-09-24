import React from 'react';
import { Outlet } from 'react-router-dom';

export const TeamLayout: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] w-full">
      <Outlet />
    </div>
  );
};
