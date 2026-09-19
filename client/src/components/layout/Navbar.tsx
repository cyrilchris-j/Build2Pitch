import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Rocket, Shield, Users, LogIn, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const Navbar: React.FC = () => {
  const location = useLocation();
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

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-background font-black shadow-glow-primary transition-transform group-hover:scale-105">
            <Rocket className="h-5 w-5 fill-background" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors">
              BUILD<span className="text-primary">2</span>PITCH
            </span>
            <span className="text-[10px] -mt-1 font-semibold uppercase tracking-widest text-foreground-subtle">
              Startup Hackathon
            </span>
          </div>
        </Link>

        {/* Live Status Pill */}
        <div className="hidden lg:flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-semibold text-success">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
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
                    ? 'text-primary bg-primary/10 border border-primary/20'
                    : 'text-foreground-muted hover:text-foreground hover:bg-card/60'
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
        </div>

        {/* Mobile Hamburger */}
        <div className="flex md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-foreground-muted hover:text-foreground rounded-lg focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-card/95 px-4 pt-2 pb-6 space-y-2 backdrop-blur-xl">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-border flex flex-col gap-2">
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full">Sign In</Button>
            </Link>
            <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="primary" className="w-full">Register Team</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
