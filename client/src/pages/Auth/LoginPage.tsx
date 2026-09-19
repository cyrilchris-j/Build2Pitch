import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Rocket,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Shield,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/api';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState(false);

  const fromPath = (location.state as any)?.from?.pathname;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.email.trim() || !formData.password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.login({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      if (response.data && response.data.success && response.data.data) {
        const { token, user, team } = response.data.data;
        setSuccessNotice(true);

        login(token, user, team || null);

        // Redirect based on role or original requested path
        setTimeout(() => {
          if (fromPath) {
            navigate(fromPath, { replace: true });
          } else {
            const role = (user.role || '').toUpperCase();
            if (role === 'ADMIN') {
              navigate('/admin/dashboard', { replace: true });
            } else if (role === 'TEAM_MEMBER' || role === 'MEMBER') {
              navigate('/member/dashboard', { replace: true });
            } else {
              navigate('/team/dashboard', { replace: true });
            }
          }
        }, 500);
      } else {
        setErrorMessage(response.data?.message || 'Login failed. Please verify your credentials.');
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Invalid email or password. Please try again.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-[#070707] selection:bg-[#E63946]/30">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#E63946]/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-md bg-[#111111] border border-[#242424] rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl"
      >
        {/* Header Badge */}
        <div className="text-center pb-6 border-b border-[#242424]">
          <div className="mx-auto h-12 w-12 rounded-xl bg-gradient-to-br from-[#E63946] to-[#991b1b] flex items-center justify-center text-white shadow-lg shadow-[#E63946]/20 mb-3">
            <Rocket className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Team Lead Sign In</h1>
          <p className="text-xs text-[#8A8A8A] mt-1">
            Access your team workspace, view assigned ideas, and manage pitch submissions
          </p>
        </div>

        {/* Success Banner */}
        {successNotice && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-sm flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
            <span>Login successful! Opening your workspace...</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-red-950/40 border border-[#E63946]/50 text-[#FF6B6B] text-sm flex items-center gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-[#8A8A8A] mb-1.5">
              Team Lead Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A8A8A]" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="leader@build2pitch.dev"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#070707] border border-[#242424] rounded-lg text-sm text-white placeholder-[#8A8A8A]/50 focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946] transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-[#8A8A8A]">Password</label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A8A8A]" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full pl-10 pr-10 py-2.5 bg-[#070707] border border-[#242424] rounded-lg text-sm text-white placeholder-[#8A8A8A]/50 focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8A8A] hover:text-white"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || successNotice}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#E63946] hover:bg-[#D32F2F] text-white font-bold shadow-lg shadow-[#E63946]/30 hover:shadow-[#E63946]/50 transition-all disabled:opacity-50 active:scale-[0.99]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Authenticating...</span>
                </div>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Portal Switcher & Register Link */}
        <div className="mt-6 pt-6 border-t border-[#242424] space-y-3 text-xs text-center text-[#8A8A8A]">
          <div>
            Don't have a registered team?{' '}
            <Link to="/register" className="text-[#E63946] hover:underline font-semibold">
              Register New Team
            </Link>
          </div>

          <div className="pt-2 flex items-center justify-center gap-4 text-[11px]">
            <Link
              to="/member-login"
              className="inline-flex items-center gap-1 text-[#8A8A8A] hover:text-white transition-colors"
            >
              <Users className="h-3.5 w-3.5 text-[#E63946]" />
              Member Login
            </Link>
            <span className="text-[#242424]">&bull;</span>
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1 text-[#8A8A8A] hover:text-white transition-colors"
            >
              <Shield className="h-3.5 w-3.5 text-amber-500" />
              Admin Portal
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
