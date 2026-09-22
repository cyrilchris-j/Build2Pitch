import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  ArrowRight,
  Users,
  Lightbulb,
  Code2,
  Megaphone,
  Trophy,
  CheckCircle2,
  ChevronDown,
  Target,
  Rocket,
  Star,
  Layers,
  GitBranch,
  Globe,
  Linkedin,
  FileText,
  Image,
  Shield,
  Flame,
} from 'lucide-react';
import { EventCountdown } from '@/components/countdown/EventCountdown';
import { useEventSettings } from '@/hooks/useEventSettings';
import { ParticleText } from '@/components/ui/ParticleText';

// ─── Animated Section Header ──────────────────────────────────────────────────
const SectionLabel: React.FC<{ text: string }> = ({ text }) => (
  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-[0.2em] mb-4">
    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
    {text}
  </div>
);

// ─── Step Card ────────────────────────────────────────────────────────────────
const StepCard: React.FC<{
  step: number;
  title: string;
  desc: string;
  icon: React.ElementType;
  color: string;
}> = ({ step, title, desc, icon: Icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: step * 0.08 }}
    className="relative bg-card border border-border rounded-2xl p-6 group hover:border-primary/30 hover:shadow-glow-sm transition-all duration-300"
  >
    <div className="flex items-start gap-4">
      <div className={`h-12 w-12 rounded-2xl ${color} flex items-center justify-center shrink-0 shadow-lg`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        <div className="text-xs text-foreground-subtle font-bold uppercase tracking-wider mb-1">
          Step {step}
        </div>
        <h3 className="text-base font-bold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-foreground-muted leading-relaxed">{desc}</p>
      </div>
    </div>
    <div className="absolute top-4 right-4 text-3xl font-black text-foreground-subtle/10 font-display select-none">
      0{step}
    </div>
  </motion.div>
);

// ─── Feature Stat ─────────────────────────────────────────────────────────────
const FeatureStat: React.FC<{ value: string; label: string; accent?: boolean }> = ({
  value,
  label,
  accent = false,
}) => (
  <div className="text-center">
    <div className={`text-4xl font-black font-display tracking-tight mb-1 ${accent ? 'gradient-text' : 'text-foreground'}`}>
      {value}
    </div>
    <div className="text-xs text-foreground-muted uppercase tracking-wider font-semibold">{label}</div>
  </div>
);

// ─── Deliverable Card ─────────────────────────────────────────────────────────
const DeliverableCard: React.FC<{
  icon: React.ElementType;
  title: string;
  desc: string;
  required?: boolean;
}> = ({ icon: Icon, title, desc, required = true }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.96 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className="bg-card border border-border rounded-xl p-4 flex items-start gap-3 hover:border-accent/30 transition-all"
  >
    <div className="h-8 w-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
      <Icon className="h-4 w-4 text-accent" />
    </div>
    <div>
      <div className="flex items-center gap-2">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        {required && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-danger/10 text-danger font-bold border border-danger/20">
            REQ
          </span>
        )}
      </div>
      <p className="text-xs text-foreground-muted mt-0.5">{desc}</p>
    </div>
  </motion.div>
);

// ─── FAQ Item ─────────────────────────────────────────────────────────────────
const FAQItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border border-border rounded-xl overflow-hidden cursor-pointer hover:border-primary/30 transition-colors"
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between px-5 py-4 gap-4">
        <p className="text-sm font-semibold text-foreground">{q}</p>
        <ChevronDown
          className={`h-4 w-4 text-foreground-muted shrink-0 transition-transform duration-200 ${open ? 'rotate-180 text-primary' : ''}`}
        />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-sm text-foreground-muted leading-relaxed border-t border-border/60 pt-3">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Main Landing Page ────────────────────────────────────────────────────────
export const LandingPage: React.FC = () => {
  const { settings } = useEventSettings();

  const steps = [
    {
      title: 'Form Your Squad',
      desc: 'Team Lead registers and adds 5 members. Each person gets their own account and access credentials.',
      icon: Users,
      color: 'bg-gradient-to-br from-primary to-primary-dark',
    },
    {
      title: 'Read the Brief',
      desc: 'Study the event rules, judging criteria, and deliverable checklist before the challenge starts.',
      icon: FileText,
      color: 'bg-gradient-to-br from-accent to-accent-hover',
    },
    {
      title: 'Roll Your Startup Idea',
      desc: 'You have 2 attempts to roll a unique startup idea from our curated vault. Lock it in when you are ready.',
      icon: Zap,
      color: 'bg-gradient-to-br from-purple to-purple-dark',
    },
    {
      title: 'Build in One Day',
      desc: 'Work as a team — design, code, brand, research, and pitch. Everyone contributes.',
      icon: Code2,
      color: 'bg-gradient-to-br from-success to-success-hover',
    },
    {
      title: 'Submit Deliverables',
      desc: 'Upload all required assets: logo, poster, GitHub repo, pitch deck, and demo video.',
      icon: Rocket,
      color: 'bg-gradient-to-br from-warning to-amber-600',
    },
    {
      title: 'Present & Win',
      desc: 'Pitch your startup to the judges. The top teams get recognized across multiple award categories.',
      icon: Trophy,
      color: 'bg-gradient-to-br from-danger to-danger-hover',
    },
  ];

  const deliverables = [
    { icon: Image, title: 'Company Logo', desc: 'Professional brand logo (URL)', required: true },
    { icon: Star, title: 'Visiting Card', desc: 'Digital business card design', required: true },
    { icon: Layers, title: 'Event Poster', desc: 'A3 promotional poster', required: true },
    { icon: Linkedin, title: 'LinkedIn Banner', desc: 'Professional social header', required: true },
    { icon: GitBranch, title: 'GitHub Repository', desc: 'Source code, public or private', required: true },
    { icon: Globe, title: 'Deployed URL', desc: 'Live working product link', required: true },
    { icon: FileText, title: 'Pitch Deck', desc: 'Investor-style slide deck', required: true },
    { icon: Megaphone, title: 'Demo Video', desc: 'Product walkthrough (60s–3min)', required: true },
  ];

  const faqs = [
    { q: 'Who can participate in Build2Pitch?', a: 'All 3rd-year engineering students from any department. Teams must be exactly 6 members, with at least 1 female participant.' },
    { q: 'What do we build in one day?', a: 'A real startup product with a working demo, branding package, and pitch deck — all built from scratch based on your assigned idea from the vault.' },
    { q: 'How does the idea roll work?', a: 'Each team gets 2 dice rolls to claim a unique startup idea. Once your team locks an idea, no other team can get it. The roll is atomic and fair.' },
    { q: 'Can we use AI tools and no-code platforms?', a: 'Yes! You are encouraged to use any tools — AI assistants, no-code builders, design tools, etc. What matters is the final product and pitch quality.' },
    { q: 'How are winners chosen?', a: 'Judges evaluate presentation, product demo, business model, design, branding, and teamwork. Multiple award categories exist — innovation, design, technical depth, best pitch, etc.' },
    { q: 'What is the Team Lead responsible for?', a: 'The Team Lead registers the team, adds all 5 members, rolls and locks the idea, and submits the final deliverables. Members get read-only access to track progress.' },
    { q: 'Is prior startup or coding experience required?', a: 'Not at all. Teams need a diverse mix of skills — a coder, a designer, a pitcher, a researcher, and a marketer. Multidisciplinary teams perform best.' },
  ];

  const rules = [
    'Teams must have exactly 6 members (including the Team Lead)',
    'At least 1 female participant is required per team',
    'Each team gets a maximum of 2 idea roll attempts',
    'All 8 deliverables must be submitted before the deadline',
    'The Team Lead can lock the submission — once final, it cannot be changed',
    'Plagiarism, pre-built projects, or copied work will result in disqualification',
    'All members must be physically present at the event venue',
    'Final pitches are 5 minutes each, with a 2-minute Q&A from judges',
  ];

  return (
    <div className="relative bg-background text-foreground overflow-x-hidden">
      {/* ─── SECTION 1: HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-20 overflow-hidden">
        {/* Cinematic background */}
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 grid-texture opacity-50" />
        {/* Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple/5 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }} />

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Event badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-bold mb-8"
          >
            <Flame className="h-4 w-4 animate-pulse" />
            <span>Build2Pitch 2026 Edition — One Day. Real Startup.</span>
          </motion.div>

          {/* Main title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 flex justify-center"
          >
            <h1 className="sr-only">Build2Pitch</h1>
            <ParticleText
              text="Build2Pitch"
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-none tracking-tighter"
            />
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl sm:text-2xl md:text-3xl font-light text-foreground-muted tracking-wide mb-4"
          >
            Shape What's Next.
          </motion.p>

          {/* Sub tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm sm:text-base text-foreground-subtle max-w-2xl mx-auto mb-10"
          >
            A one-day college innovation challenge where teams of 6 build a real startup from idea to pitch.
            Creativity. Teamwork. Technical skills. All in a single day.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 items-center justify-center"
          >
            <Link
              to="/register"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-background font-black text-base hover:bg-primary-hover shadow-glow-primary transition-all duration-200 hover:scale-105 active:scale-100"
            >
              Register Your Team
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-border text-foreground-muted hover:text-foreground hover:border-border-hover font-semibold text-base transition-all duration-200"
            >
              Team Lead Login
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-16 grid grid-cols-3 gap-6 max-w-sm mx-auto"
          >
            <FeatureStat value="6" label="Per Team" accent />
            <FeatureStat value="30+" label="Ideas" accent />
            <FeatureStat value="1" label="Day" accent />
          </motion.div>
        </div>
      </section>

      {/* ─── SECTION 2: EVENT CONCEPT ─────────────────────────────────────── */}
      <section className="px-4 py-20 sm:px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <SectionLabel text="The Challenge" />
          <h2 className="font-display text-4xl sm:text-5xl font-black tracking-tight mb-4">
            One Day. Real Startup.
          </h2>
          <p className="text-foreground-muted max-w-2xl mx-auto leading-relaxed">
            Build2Pitch is not a hackathon — it's an entrepreneurship simulation. Your team will build
            a complete startup: product, brand identity, business model, and investor pitch.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Lightbulb, title: 'Idea Vault', desc: '30+ curated startup problem statements across industries. Roll the dice and claim your unique idea.', color: 'primary' },
            { icon: Code2, title: 'Build for Real', desc: 'Write code, create designs, craft branding, and deploy a live product — all in a single day.', color: 'accent' },
            { icon: Megaphone, title: 'Pitch Like a Founder', desc: 'Present your startup to a panel of judges in a 5-minute pitch session. Confidence, clarity, and conviction.', color: 'purple-light' },
          ].map(({ icon: Icon, title, desc, color }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card border border-border rounded-2xl p-6 text-center hover:border-primary/20 transition-all group"
            >
              <div className={`h-14 w-14 rounded-2xl bg-${color}/10 border border-${color}/20 flex items-center justify-center mx-auto mb-4`}>
                <Icon className={`h-7 w-7 text-${color}`} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-foreground-muted leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── SECTION 3: HOW IT WORKS ──────────────────────────────────────── */}
      <section className="px-4 py-20 sm:px-6 bg-background-subtle border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <SectionLabel text="Journey" />
            <h2 className="font-display text-4xl sm:text-5xl font-black tracking-tight mb-4">
              How It Works
            </h2>
            <p className="text-foreground-muted max-w-xl mx-auto">
              Six clear steps from registration to final pitch
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {steps.map((step, i) => (
              <StepCard key={step.title} {...step} step={i + 1} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: COUNTDOWN ─────────────────────────────────────────── */}
      <section className="px-4 py-20 sm:px-6 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <SectionLabel text="Countdown" />
          <h2 className="font-display text-4xl sm:text-5xl font-black tracking-tight mb-4">
            The Clock Is Running
          </h2>
          <p className="text-foreground-muted">
            Don't miss the starting gun. Register your team before the event day.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <EventCountdown settings={settings} />
        </motion.div>
      </section>

      {/* ─── SECTION 5: DELIVERABLES ──────────────────────────────────────── */}
      <section className="px-4 py-20 sm:px-6 bg-background-subtle border-y border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <SectionLabel text="Deliverables" />
            <h2 className="font-display text-4xl sm:text-5xl font-black tracking-tight mb-4">
              What You Will Submit
            </h2>
            <p className="text-foreground-muted max-w-xl mx-auto">
              All 8 items are required. The Team Lead submits via the platform before the deadline.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {deliverables.map((d) => (
              <DeliverableCard key={d.title} {...d} />
            ))}
          </div>

          {/* Plus optional */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DeliverableCard
              icon={Target}
              title="Business Model (Optional)"
              desc="Revenue model, target market, monetization strategy"
              required={false}
            />
            <DeliverableCard
              icon={FileText}
              title="Pitch Notes (Optional)"
              desc="Judge-facing pitch script or notes"
              required={false}
            />
          </div>
        </div>
      </section>

      {/* ─── SECTION 6: RULES ─────────────────────────────────────────────── */}
      <section className="px-4 py-20 sm:px-6 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <SectionLabel text="Rules" />
          <h2 className="font-display text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Ground Rules
          </h2>
          <p className="text-foreground-muted max-w-xl mx-auto">
            Fair play, creativity, and grit. That's all we ask.
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
          {rules.map((rule, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="flex items-start gap-3"
            >
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm text-foreground-muted leading-relaxed">{rule}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── SECTION 7: ROLES ─────────────────────────────────────────────── */}
      <section className="px-4 py-20 sm:px-6 bg-background-subtle border-y border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel text="Team Roles" />
            <h2 className="font-display text-4xl sm:text-5xl font-black tracking-tight mb-4">
              Assemble Your Squad
            </h2>
            <p className="text-foreground-muted max-w-xl mx-auto">
              Great startups need diverse skills. Assign specialized roles to maximize impact.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { role: 'Team Lead', desc: 'Registers team, rolls idea, submits final deliverables', icon: Shield, color: 'text-primary border-primary/30 bg-primary/5' },
              { role: 'Developer', desc: 'Builds the product: web app, mobile, or prototype', icon: Code2, color: 'text-accent border-accent/30 bg-accent/5' },
              { role: 'Designer', desc: 'Creates logo, poster, UI, and brand identity', icon: Image, color: 'text-purple-light border-purple/30 bg-purple/5' },
              { role: 'Pitcher', desc: 'Crafts the pitch deck and delivers the investor pitch', icon: Megaphone, color: 'text-success border-success/30 bg-success/5' },
              { role: 'Researcher', desc: 'Market research, competitor analysis, target audience', icon: Target, color: 'text-warning border-warning/30 bg-warning/5' },
              { role: 'Marketer', desc: 'Social media banners, branding, go-to-market strategy', icon: Globe, color: 'text-danger border-danger/30 bg-danger/5' },
            ].map(({ role, desc, icon: Icon, color }) => (
              <motion.div
                key={role}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className={`border rounded-2xl p-5 text-center ${color}`}
              >
                <Icon className="h-6 w-6 mx-auto mb-3" />
                <h3 className="text-sm font-bold mb-1">{role}</h3>
                <p className="text-xs text-foreground-muted leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 8: FAQ ───────────────────────────────────────────────── */}
      <section className="px-4 py-20 sm:px-6 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <SectionLabel text="FAQ" />
          <h2 className="font-display text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Got Questions?
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <FAQItem key={faq.q} {...faq} />
          ))}
        </div>
      </section>

      {/* ─── SECTION 9: CTA ───────────────────────────────────────────────── */}
      <section className="px-4 py-24 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 grid-texture opacity-30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-bold mb-8">
              <Rocket className="h-4 w-4" />
              Registration is Open
            </div>
            <h2 className="font-display text-5xl sm:text-6xl font-black tracking-tighter mb-6">
              Ready to{' '}
              <span className="gradient-text">Build?</span>
            </h2>
            <p className="text-foreground-muted text-lg mb-10 max-w-xl mx-auto">
              Register your 6-member team and take the first step toward building
              something that could change the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Link
                to="/register"
                className="group inline-flex items-center gap-2.5 px-10 py-4 rounded-2xl bg-primary text-background font-black text-lg hover:bg-primary-hover shadow-glow-primary transition-all duration-200 hover:scale-105 active:scale-100"
              >
                Register Now
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/member-login"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-border text-foreground-muted hover:text-foreground hover:border-border-hover font-semibold text-base transition-all"
              >
                Member Login
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-border px-4 py-10 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Zap className="h-4 w-4 text-background" />
            </div>
            <span className="font-display text-base font-black tracking-tight">
              BUILD<span className="text-primary">2PITCH</span>
            </span>
          </div>
          <p className="text-xs text-foreground-subtle text-center">
            Build2Pitch 2026 — College Innovation Challenge.<br className="sm:hidden" />
            Shape What's Next.
          </p>
          <div className="flex items-center gap-4 text-xs text-foreground-subtle">
            <Link to="/login" className="hover:text-foreground-muted transition-colors">Team Lead Login</Link>
            <Link to="/member-login" className="hover:text-foreground-muted transition-colors">Member Login</Link>
            <Link to="/admin/login" className="hover:text-foreground-muted transition-colors">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
