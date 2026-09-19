import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, Team, AuthState, UserRole } from '@/types';
import { authService } from '@/services/api';

interface AuthContextType extends AuthState {
  login: (token: string, user: User, team?: Team | null) => void;
  logout: () => void;
  setTeam: (team: Team | null) => void;
  refreshUser: () => Promise<void>;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialToken = localStorage.getItem('build2pitch_token');

  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    team: null,
    token: initialToken,
    isAuthenticated: false,
    isLoading: !!initialToken,
  });

  const logout = useCallback(() => {
    localStorage.removeItem('build2pitch_token');
    setAuthState({
      user: null,
      team: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const login = useCallback((token: string, user: User, team?: Team | null) => {
    localStorage.setItem('build2pitch_token', token);
    setAuthState({
      user,
      team: team || null,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const setTeam = useCallback((team: Team | null) => {
    setAuthState((prev) => ({ ...prev, team }));
  }, []);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('build2pitch_token');
    if (!token) {
      setAuthState({
        user: null,
        team: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return;
    }

    try {
      const response = await authService.getProfile();
      if (response.data && response.data.success && response.data.data) {
        const { user, team } = response.data.data;
        setAuthState({
          user,
          team: team || null,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        logout();
      }
    } catch (error) {
      console.warn('[AuthContext] Session verification failed, logging out:', error);
      logout();
    }
  }, [logout]);

  // Re-hydrate authentication state on initial page load
  useEffect(() => {
    if (initialToken) {
      refreshUser();
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [initialToken, refreshUser]);

  const hasRole = useCallback(
    (roles: UserRole | UserRole[]): boolean => {
      if (!authState.user || !authState.user.role) return false;
      const allowed = Array.isArray(roles) ? roles : [roles];
      const normalize = (r: string) => {
        const upper = r.toUpperCase();
        if (upper === 'MEMBER') return 'TEAM_MEMBER';
        return upper;
      };
      const currentRole = normalize(authState.user.role);
      return allowed.some((r) => normalize(r) === currentRole);
    },
    [authState.user]
  );

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        setTeam,
        refreshUser,
        hasRole,
      }}
    >
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

