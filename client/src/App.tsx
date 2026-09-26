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
        {/* h-screen so navbar + content exactly fill the viewport.
            The sidebar layouts use h-[calc(100vh-4rem)] to fill remaining space. */}
        <div className="h-screen flex flex-col bg-background text-foreground font-sans selection:bg-primary/30 selection:text-primary-light overflow-hidden">
          <Navbar />
          {/* flex-1 + overflow-hidden: lets each layout manage its own scroll */}
          <div className="flex-1 overflow-hidden">
            <AppRoutes />
          </div>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
