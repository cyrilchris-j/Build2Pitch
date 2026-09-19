import React, { createContext, useContext, useState } from 'react';
import type { User, Team, AuthState } from '@/types';

interface AuthContextType extends AuthState {
  login: (token: string, user: User, team?: Team) => void;
  logout: () => void;
  setTeam: (team: Team | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Placeholder state - Authentication logic to be completed in Auth sprint
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    team: null,
    token: localStorage.getItem('build2pitch_token'),
    isAuthenticated: false,
    isLoading: false,
  });

  const login = (token: string, user: User, team?: Team) => {
    localStorage.setItem('build2pitch_token', token);
    setAuthState({
      user,
      team: team || null,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem('build2pitch_token');
    setAuthState({
      user: null,
      team: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const setTeam = (team: Team | null) => {
    setAuthState((prev) => ({ ...prev, team }));
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, setTeam }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
