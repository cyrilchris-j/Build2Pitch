import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  LogOut,
  User,
  Menu,
  X,
  Shield,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { clsx } from 'clsx';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const role = user?.role?.toUpperCase() || '';
  const isAdmin = role === 'ADMIN';
  const isLead = role === 'TEAM_LEAD';
  const isMember = role === 'TEAM_MEMBER' || role === 'MEMBER';

  const dashboardPath = isAdmin
    ? '/admin/dashboard'
    : isLead
    ? '/team/dashboard'
    : '/member/dashboard';

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileOpen(false);
  };

  // For authenticated users: Sidebar handles nav, navbar is just a slim top bar
  const isAuthenticated_ = isAuthenticated && (isAdmin || isLead || isMember);

  return (
    <header
      className={clsx(
        'sticky top-0 z-50 transition-all duration-200',
        scrolled
          ? 'border-b border-border/60 bg-background/95 backdrop-blur-xl shadow-[0_1px_20px_rgba(0,0,0,0.4)]'
          : 'border-b border-border/30 bg-background/80 backdrop-blur-lg'
      )}
    >
      <nav className="mx-auto max-w-screen-2xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* ── Logo ─────────────────────────────────────── */}
        <Link
          to={isAuthenticated ? dashboardPath : '/'}
          className="flex items-center gap-2.5 shrink-0 group"
        >
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow-sm group-hover:shadow-glow-primary transition-shadow duration-200">
            <Zap className="h-4 w-4 text-background font-bold" />
          </div>
          <span className="font-display text-lg font-black tracking-tight text-foreground leading-none">
            BUILD<span className="text-primary">2</span>PITCH
          </span>
          {isAdmin && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple/10 border border-purple/30 text-purple-light text-[10px] font-bold uppercase tracking-wider">
              <Shield className="h-3 w-3" />
              Admin
            </span>
          )}
        </Link>

        {/* ── Right Side ───────────────────────────────── */}
        <div className="flex items-center gap-2">
          {isAuthenticated_ ? (
            <>
              {/* User pill — shown on desktop for all roles */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border">
                <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center">
                  <User className="h-3 w-3 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground max-w-[110px] truncate leading-none">
                    {user?.name?.split(' ')[0]}
                  </p>
                  <p className="text-[10px] text-foreground-subtle leading-none mt-0.5 capitalize">
                    {isAdmin ? 'Administrator' : isLead ? 'Team Lead' : 'Member'}
                  </p>
                </div>
              </div>

              {/* Logout button — desktop (only shown when no sidebar / for member portal) */}
              {isMember && (
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-foreground-muted hover:text-danger hover:bg-danger/10 border border-transparent hover:border-danger/20 transition-all duration-150"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline font-medium">Sign Out</span>
                </button>
              )}

              {/* Mobile hamburger for member portal only (team has FAB) */}
              {isMember && (
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="sm:hidden p-2 rounded-xl text-foreground-muted hover:text-foreground hover:bg-card border border-transparent hover:border-border transition-all"
                >
                  {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              )}
            </>
          ) : (
            <>
              {/* Public nav */}
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-card transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm font-bold bg-primary text-background hover:bg-primary-hover shadow-glow-sm hover:shadow-glow-primary transition-all duration-200"
                >
                  Join Build2Pitch
                </Link>
              </div>

              {/* Mobile hamburger (public) */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="sm:hidden p-2 rounded-xl text-foreground-muted hover:text-foreground hover:bg-card border border-transparent hover:border-border transition-all"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </>
          )}
        </div>
      </nav>

      {/* ── Mobile Dropdown (public pages only) ─────────── */}
      <AnimatePresence>
        {mobileOpen && !isAuthenticated_ && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="sm:hidden border-t border-border/60 bg-background-subtle/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-sm text-foreground-muted hover:text-foreground hover:bg-card transition-all"
              >
                Team Lead Login
                <ChevronRight className="h-4 w-4 opacity-30" />
              </Link>
              <Link
                to="/member-login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-sm text-foreground-muted hover:text-foreground hover:bg-card transition-all"
              >
                Member Login
                <ChevronRight className="h-4 w-4 opacity-30" />
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-bold bg-primary text-background hover:bg-primary-hover transition-all mt-2 shadow-glow-sm"
              >
                Join Build2Pitch
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
