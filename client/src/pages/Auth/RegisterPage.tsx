import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Rocket,
  Users,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  User,
  Hash,
  Phone,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/api';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    registerNumber: '',
    email: '',
    mobile: '',
    gender: 'male',
    section: '',
    teamName: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Client-side validation
    if (
      !formData.name.trim() ||
      !formData.registerNumber.trim() ||
      !formData.email.trim() ||
      !formData.mobile.trim() ||
      !formData.gender ||
      !formData.section.trim() ||
      !formData.teamName.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setErrorMessage('Please fill in all 9 registration fields.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Password and Confirm Password do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.register({
        name: formData.name.trim(),
        registerNumber: formData.registerNumber.trim(),
        email: formData.email.trim().toLowerCase(),
        mobile: formData.mobile.trim(),
        gender: formData.gender,
        section: formData.section.trim(),
        teamName: formData.teamName.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (response.data && response.data.success && response.data.data) {
        const { token, user, team } = response.data.data;
        setSuccessNotice(true);

        // Auto login Team Lead
        login(token, user, team || null);

        // Redirect to Team Dashboard
        setTimeout(() => {
          navigate('/team/dashboard');
        }, 600);
      } else {
        setErrorMessage(response.data?.message || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'An error occurred during registration. Please check your inputs.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8 bg-[#070707] selection:bg-[#E63946]/30">
      {/* Background Cinematic Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#E63946]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#E63946]/5 rounded-full blur-2xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-2xl bg-[#111111] border border-[#242424] rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl"
      >
        {/* Header Badge */}
        <div className="flex items-center justify-between pb-6 border-b border-[#242424]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#E63946] to-[#991b1b] flex items-center justify-center text-white shadow-lg shadow-[#E63946]/20">
              <Rocket className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Team Lead Registration
              </h1>
              <p className="text-xs text-[#8A8A8A] mt-0.5">
                Register your startup venture & designated 6-member team
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E63946]/10 border border-[#E63946]/30 text-[#E63946] text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>2026 EDITION</span>
          </div>
        </div>

        {/* Success Banner */}
        {successNotice && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-sm flex items-center gap-2 animate-pulse">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
            <span>Registration successful! Launching your Team Dashboard...</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-red-950/40 border border-[#E63946]/50 text-[#FF6B6B] text-sm flex items-center gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Section: Team Details */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#8A8A8A] mb-3 flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-[#E63946]" />
              Startup Team Details
            </h2>
            <div>
              <label className="block text-xs font-medium text-[#8A8A8A] mb-1.5">
                Team Name <span className="text-[#E63946]">*</span>
              </label>
              <div className="relative">
                <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A8A8A]" />
                <input
                  type="text"
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleChange}
                  placeholder="e.g. Apex AI Innovations"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#070707] border border-[#242424] rounded-lg text-sm text-white placeholder-[#8A8A8A]/50 focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Section: Leader Personal Details */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#8A8A8A] mb-3 flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-[#E63946]" />
              Team Leader Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-medium text-[#8A8A8A] mb-1.5">
                  Full Name <span className="text-[#E63946]">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A8A8A]" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Sarah Connor"
                    required
                    className="w-full pl-10 pr-4 py-2 bg-[#070707] border border-[#242424] rounded-lg text-sm text-white placeholder-[#8A8A8A]/50 focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946] transition-colors"
                  />
                </div>
              </div>

              {/* Register Number */}
              <div>
                <label className="block text-xs font-medium text-[#8A8A8A] mb-1.5">
                  Register Number / Student ID <span className="text-[#E63946]">*</span>
                </label>
                <div className="relative">
                  <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A8A8A]" />
                  <input
                    type="text"
                    name="registerNumber"
                    value={formData.registerNumber}
                    onChange={handleChange}
                    placeholder="e.g. 21CS042"
                    required
                    className="w-full pl-10 pr-4 py-2 bg-[#070707] border border-[#242424] rounded-lg text-sm text-white placeholder-[#8A8A8A]/50 focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946] transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-[#8A8A8A] mb-1.5">
                  College / Personal Email <span className="text-[#E63946]">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A8A8A]" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="leader@college.edu"
                    required
                    className="w-full pl-10 pr-4 py-2 bg-[#070707] border border-[#242424] rounded-lg text-sm text-white placeholder-[#8A8A8A]/50 focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946] transition-colors"
                  />
                </div>
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-xs font-medium text-[#8A8A8A] mb-1.5">
                  Mobile Number <span className="text-[#E63946]">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A8A8A]" />
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="e.g. 9876543210"
                    required
                    className="w-full pl-10 pr-4 py-2 bg-[#070707] border border-[#242424] rounded-lg text-sm text-white placeholder-[#8A8A8A]/50 focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946] transition-colors"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-medium text-[#8A8A8A] mb-1.5">
                  Gender <span className="text-[#E63946]">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2 bg-[#070707] border border-[#242424] rounded-lg text-sm text-white focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946] transition-colors"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Section */}
              <div>
                <label className="block text-xs font-medium text-[#8A8A8A] mb-1.5">
                  Section / Department <span className="text-[#E63946]">*</span>
                </label>
                <div className="relative">
                  <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A8A8A]" />
                  <input
                    type="text"
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    placeholder="e.g. CSE-B or IT"
                    required
                    className="w-full pl-10 pr-4 py-2 bg-[#070707] border border-[#242424] rounded-lg text-sm text-white placeholder-[#8A8A8A]/50 focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946] transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Security */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#8A8A8A] mb-3 flex items-center gap-2">
              <Lock className="h-3.5 w-3.5 text-[#E63946]" />
              Account Security
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-[#8A8A8A] mb-1.5">
                  Password <span className="text-[#E63946]">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A8A8A]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    required
                    className="w-full pl-10 pr-10 py-2 bg-[#070707] border border-[#242424] rounded-lg text-sm text-white placeholder-[#8A8A8A]/50 focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946] transition-colors"
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

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-medium text-[#8A8A8A] mb-1.5">
                  Confirm Password <span className="text-[#E63946]">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A8A8A]" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    required
                    className="w-full pl-10 pr-10 py-2 bg-[#070707] border border-[#242424] rounded-lg text-sm text-white placeholder-[#8A8A8A]/50 focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8A8A] hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
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
                  <span>Registering & Initializing Dashboard...</span>
                </div>
              ) : (
                <>
                  <span>Create Team & Enter Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
            {isLoading && (
              <p className="mt-2.5 text-center text-xs text-[#8A8A8A] animate-pulse">
                Connecting to server... If the backend is waking up, please allow a few moments.
              </p>
            )}
          </div>
        </form>

        {/* Footer Navigation */}
        <div className="mt-6 pt-6 border-t border-[#242424] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8A8A8A]">
          <div>
            Already registered?{' '}
            <Link to="/login" className="text-[#E63946] hover:underline font-semibold">
              Sign In as Team Lead
            </Link>
          </div>
          <div>
            Are you a team member?{' '}
            <Link to="/member-login" className="text-white hover:underline font-semibold">
              Member Access Portal
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
