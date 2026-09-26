import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/api';

export const MemberLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.email.trim() || !formData.password) {
      setErrorMessage('Please enter your registered email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.memberLogin({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      if (response.data && response.data.success && response.data.data) {
        const { token, user, team } = response.data.data;
        const userRole = (user.role || '').toUpperCase();

        if (userRole === 'TEAM_LEAD') {
          setErrorMessage(
            'This portal is for Team Members only. Please use the Team Lead Login portal.'
          );
          setIsLoading(false);
          return;
        }

        setSuccessNotice(true);
        login(token, user, team || null);

        setTimeout(() => {
          navigate('/member/dashboard', { replace: true });
        }, 500);
      } else {
        setErrorMessage(
          response.data?.message || 'Login failed. Please verify your member credentials.'
        );
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Invalid credentials. Please contact your Team Lead.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-background overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
      <div className="absolute inset-0 grid-texture opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="auth-card p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex h-14 w-14 rounded-2xl bg-gradient-to-br from-accent/20 to-purple/10 border border-accent/30 items-center justify-center mb-4 shadow-glow-accent">
              <Users className="h-7 w-7 text-accent" />
            </div>
            <h1 className="text-2xl font-black text-foreground tracking-tight">Team Member Login</h1>
            <p className="text-sm text-foreground-muted mt-1.5 leading-relaxed">
              View your team's progress, idea, and submission status
            </p>
          </div>

          {/* Notice */}
          <div className="mb-5 p-3.5 rounded-xl bg-background-subtle border border-border flex items-start gap-2.5">
            <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-foreground-muted leading-relaxed">
              <span className="font-semibold text-foreground">No public registration:</span>{' '}
              Member accounts are created by your Team Lead. Use your assigned credentials to sign in.
            </p>
          </div>

          {/* Alerts */}
          {successNotice && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-5 p-3.5 rounded-xl bg-success/10 border border-success/30 text-success text-sm flex items-center gap-2.5"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Verified! Opening your dashboard…</span>
            </motion.div>
          )}

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-5 p-3.5 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm flex items-start gap-2.5"
            >
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-foreground-muted mb-1.5 uppercase tracking-wide">
                Member Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
                <input
                  type="email"
                  name="email"
                  id="member-email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="member@build2pitch.dev"
                  required
                  className="form-input pl-10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-foreground-muted mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="member-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="form-input pl-10 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground-subtle hover:text-foreground-muted transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                id="member-submit"
                disabled={isLoading || successNotice}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-accent text-white font-bold text-sm hover:bg-accent-hover shadow-glow-accent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Verifying…</span>
                  </>
                ) : (
                  <>
                    <span>Access Member Dashboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
              {isLoading && (
                <p className="mt-2 text-center text-xs text-foreground-subtle animate-pulse">
                  Connecting — backend may be waking up, please wait…
                </p>
              )}
            </div>
          </form>

          {/* Footer links */}
          <div className="mt-7 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-foreground-muted">
            <span>
              Are you a Team Lead?{' '}
              <Link to="/login" className="text-primary hover:text-primary-light font-semibold transition-colors">
                Lead Sign In
              </Link>
            </span>
            <span>
              New team?{' '}
              <Link to="/register" className="text-foreground hover:text-primary font-semibold transition-colors">
                Register here
              </Link>
            </span>
          </div>
        </div>

        <p className="text-center text-xs text-foreground-subtle mt-5">
          Build2Pitch 2026 — Read-only member access
        </p>
      </motion.div>
    </div>
  );
};
