import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  LogOut,
  User,
  Menu,
  X,
  LayoutDashboard,
  Users,
  Lightbulb,
  FileText,
  Send,
  Shield,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { clsx } from 'clsx';

const teamLeadLinks = [
  { to: '/team/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/team/members', label: 'Team', icon: Users },
  { to: '/team/idea', label: 'My Idea', icon: Lightbulb },
  { to: '/team/instructions', label: 'Guide', icon: FileText },
  { to: '/team/submission', label: 'Submit', icon: Send },
];

const memberLinks = [
  { to: '/member/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

const adminLinks = [
  { to: '/admin/dashboard', label: 'Control Center', icon: LayoutDashboard },
  { to: '/admin/teams', label: 'Teams', icon: Users },
  { to: '/admin/ideas', label: 'Ideas', icon: Lightbulb },
  { to: '/admin/submissions', label: 'Submissions', icon: Send },
];

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

  const navLinks = isAdmin ? adminLinks : isLead ? teamLeadLinks : isMember ? memberLinks : [];

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

  return (
    <header
      className={clsx(
        'sticky top-0 z-50 transition-all duration-200',
        scrolled
          ? 'border-b border-border/60 bg-background/90 backdrop-blur-xl shadow-[0_1px_20px_rgba(0,0,0,0.4)]'
          : 'border-b border-border/30 bg-background/70 backdrop-blur-lg'
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* ── Logo ───────────────────────────────────────── */}
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

        {/* ── Desktop Links ───────────────────────────────── */}
        {isAuthenticated && navLinks.length > 0 && (
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-foreground-muted hover:text-foreground hover:bg-card'
                  )
                }
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </NavLink>
            ))}
          </div>
        )}

        {/* ── Right Side ──────────────────────────────────── */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              {/* User pill */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border">
                <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center">
                  <User className="h-3 w-3 text-primary" />
                </div>
                <span className="text-xs font-medium text-foreground-muted max-w-[110px] truncate">
                  {user?.name?.split(' ')[0]}
                </span>
              </div>
              {/* Logout */}
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-foreground-muted hover:text-danger hover:bg-danger/10 border border-transparent hover:border-danger/20 transition-all duration-150"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">Sign Out</span>
              </button>
            </>
          ) : (
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
          )}

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl text-foreground-muted hover:text-foreground hover:bg-card border border-transparent hover:border-border transition-all"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu ───────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="md:hidden border-t border-border/60 bg-background-subtle/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {isAuthenticated ? (
                <>
                  {/* User card */}
                  <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-card rounded-2xl border border-border">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{user?.name}</p>
                      <p className="text-xs text-foreground-subtle truncate">{user?.email}</p>
                    </div>
                  </div>

                  {navLinks.map(({ to, label, icon: Icon }) => (
                    <NavLink
                      key={to}
                      to={to}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        clsx(
                          'flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all',
                          isActive
                            ? 'bg-primary/10 text-primary border border-primary/20'
                            : 'text-foreground-muted hover:text-foreground hover:bg-card'
                        )
                      }
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4" />
                        {label}
                      </div>
                      <ChevronRight className="h-4 w-4 opacity-30" />
                    </NavLink>
                  ))}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium text-danger hover:bg-danger/10 border border-danger/20 transition-all mt-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
