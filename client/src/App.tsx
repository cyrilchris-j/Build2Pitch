import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { AppRoutes } from '@/routes';
import { warmUpBackend } from '@/services/api';

export const App: React.FC = () => {
  useEffect(() => {
    warmUpBackend();
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30 selection:text-primary-light">
          <Navbar />
          <div className="flex-1">
            <AppRoutes />
          </div>
          <footer className="border-t border-border/60 bg-card/20 py-4 px-4 sm:px-6 lg:px-8 text-center text-xs text-foreground-subtle">
            <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2">
              <span className="font-medium text-foreground-muted">
                BUILD<span className="text-primary font-bold">2</span>PITCH &copy; 2026 Entrepreneurship Event Platform
              </span>
              <span className="text-[11px] text-foreground-subtle">
                Shared Foundation Architecture &bull; 2–6 Member Teams &bull; Open Roster
              </span>
            </div>
          </footer>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
