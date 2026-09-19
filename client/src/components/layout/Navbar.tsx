import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Rocket, Shield, Users, LogIn, LogOut, Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Event', path: '/' },
    { label: 'Team Portal', path: '/team/dashboard', icon: Users },
    { label: 'Member Access', path: '/member/dashboard', icon: Rocket },
    { label: 'Admin', path: '/admin/dashboard', icon: Shield },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatRoleBadge = (role?: string) => {
    if (!role) return '';
    const upper = role.toUpperCase();
    if (upper === 'TEAM_LEAD' || upper === 'LEADER') return 'Team Lead';
    if (upper === 'TEAM_MEMBER' || upper === 'MEMBER') return 'Member';
    if (upper === 'ADMIN') return 'Admin';
    return role;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#242424] bg-[#070707]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E63946] text-[#FFFFFF] font-black shadow-glow-primary transition-transform group-hover:scale-105">
            <Rocket className="h-5 w-5 fill-[#FFFFFF]" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg font-extrabold tracking-tight text-[#FFFFFF] transition-colors">
              BUILD<span className="text-[#E63946]">2</span>PITCH
            </span>
            <span className="text-[10px] -mt-1 font-semibold uppercase tracking-widest text-[#8A8A8A]">
              Startup Hackathon
            </span>
          </div>
        </Link>

        {/* Live Status Pill */}
        <div className="hidden lg:flex items-center gap-2 rounded-full border border-[#242424] bg-[#111111] px-3 py-1 text-xs font-semibold text-[#E63946]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E63946] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E63946]"></span>
          </span>
          LIVE 2026 EDITION
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'text-[#E63946] bg-[#111111] border border-[#242424]'
                    : 'text-[#8A8A8A] hover:text-[#FFFFFF] hover:bg-[#111111]'
                }`}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border">
                <div className="h-7 w-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary text-xs font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : <User className="h-3.5 w-3.5" />}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-foreground leading-none">
                    {user.name}
                  </span>
                  <span className="text-[10px] font-semibold text-primary mt-0.5 uppercase tracking-wider">
                    {formatRoleBadge(user.role)}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-1.5 hover:border-danger/50 hover:text-danger"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Register Team
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="flex md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-[#8A8A8A] hover:text-[#FFFFFF] rounded-lg focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-[#242424] bg-[#070707] px-4 pt-2 pb-6 space-y-2">
          {isAuthenticated && user && (
            <div className="p-3 mb-2 rounded-lg bg-[#111111] border border-[#242424] flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-[#E63946]/20 border border-[#E63946]/40 flex items-center justify-center text-[#E63946] text-xs font-bold">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <p className="text-sm font-bold text-[#FFFFFF]">{user.name}</p>
                <p className="text-xs text-[#E63946] font-semibold">{formatRoleBadge(user.role)}</p>
              </div>
            </div>
          )}
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-[#FFFFFF] hover:bg-[#111111] hover:text-[#E63946] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-[#242424] flex flex-col gap-2">
            {isAuthenticated ? (
              <Button
                variant="outline"
                className="w-full text-[#E63946] border-[#E63946]/40"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
              >
                Sign Out
              </Button>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Sign In</Button>
                </Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full">Register Team</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
