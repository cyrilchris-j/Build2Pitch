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

const SectionHeader: React.FC<{ icon: React.ElementType; title: string }> = ({
  icon: Icon,
  title,
}) => (
  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground-subtle mb-3">
    <Icon className="h-3.5 w-3.5 text-primary" />
    {title}
  </div>
);

const FieldLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="block text-xs font-semibold text-foreground-muted mb-1.5 uppercase tracking-wide">
    {children} <span className="text-primary normal-case tracking-normal font-normal">*</span>
  </label>
);

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
      setErrorMessage('Please fill in all registration fields.');
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
        login(token, user, team || null);

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

  const inputClass = 'form-input pl-10';
  const iconClass = 'absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle';

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10 bg-background overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
      <div className="absolute inset-0 grid-texture opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple/4 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-2xl"
      >
        {/* Card */}
        <div className="auth-card p-8">
          {/* Header */}
          <div className="flex items-start justify-between pb-6 border-b border-border mb-6">
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center shadow-glow-sm">
                <Rocket className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                  Team Lead Registration
                </h1>
                <p className="text-xs text-foreground-muted mt-0.5">
                  Register your startup & build your 2–6 member team
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold shrink-0">
              <Sparkles className="h-3.5 w-3.5" />
              2026
            </div>
          </div>

          {/* Alerts */}
          {successNotice && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-5 p-3.5 rounded-xl bg-success/10 border border-success/30 text-success text-sm flex items-center gap-2.5"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Registration successful! Launching your Team Dashboard…</span>
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Team Details */}
            <div>
              <SectionHeader icon={Users} title="Startup Team Details" />
              <div>
                <FieldLabel>Team Name</FieldLabel>
                <div className="relative">
                  <Users className={iconClass} />
                  <input
                    type="text"
                    name="teamName"
                    value={formData.teamName}
                    onChange={handleChange}
                    placeholder="e.g. Apex AI Innovations"
                    required
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Leader Details */}
            <div>
              <SectionHeader icon={User} title="Team Leader Information" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <FieldLabel>Full Name</FieldLabel>
                  <div className="relative">
                    <User className={iconClass} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Arjun Kumar"
                      required
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Register Number */}
                <div>
                  <FieldLabel>Register Number</FieldLabel>
                  <div className="relative">
                    <Hash className={iconClass} />
                    <input
                      type="text"
                      name="registerNumber"
                      value={formData.registerNumber}
                      onChange={handleChange}
                      placeholder="e.g. 21CS042"
                      required
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <FieldLabel>College Email</FieldLabel>
                  <div className="relative">
                    <Mail className={iconClass} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="leader@college.edu"
                      required
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Mobile */}
                <div>
                  <FieldLabel>Mobile Number</FieldLabel>
                  <div className="relative">
                    <Phone className={iconClass} />
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="e.g. 9876543210"
                      required
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <FieldLabel>Gender</FieldLabel>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="form-input"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other / Prefer not to say</option>
                  </select>
                </div>

                {/* Section */}
                <div>
                  <FieldLabel>Section / Dept</FieldLabel>
                  <div className="relative">
                    <Layers className={iconClass} />
                    <input
                      type="text"
                      name="section"
                      value={formData.section}
                      onChange={handleChange}
                      placeholder="e.g. CSE-B or IT"
                      required
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Security */}
            <div>
              <SectionHeader icon={Lock} title="Account Security" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Password */}
                <div>
                  <FieldLabel>Password</FieldLabel>
                  <div className="relative">
                    <Lock className={iconClass} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min 6 characters"
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

                {/* Confirm Password */}
                <div>
                  <FieldLabel>Confirm Password</FieldLabel>
                  <div className="relative">
                    <Lock className={iconClass} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repeat password"
                      required
                      className="form-input pl-10 pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground-subtle hover:text-foreground-muted transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-1">
              <button
                type="submit"
                id="register-submit"
                disabled={isLoading || successNotice}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-primary text-background font-bold text-sm hover:bg-primary-hover shadow-glow-sm hover:shadow-glow-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Registering & Setting Up Dashboard…</span>
                  </>
                ) : (
                  <>
                    <span>Create Team & Enter Dashboard</span>
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

          {/* Footer */}
          <div className="mt-7 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-foreground-muted">
            <span>
              Already registered?{' '}
              <Link to="/login" className="text-primary hover:text-primary-light font-semibold transition-colors">
                Sign In as Team Lead
              </Link>
            </span>
            <span>
              Team member?{' '}
              <Link to="/member-login" className="text-foreground hover:text-primary font-semibold transition-colors">
                Member Access Portal
              </Link>
            </span>
          </div>
        </div>

        <p className="text-center text-xs text-foreground-subtle mt-5">
          Build2Pitch 2026 — 3rd-year engineering students only
        </p>
      </motion.div>
    </div>
  );
};
