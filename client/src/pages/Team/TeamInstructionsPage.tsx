import React from 'react';
import { motion, type Variants } from 'framer-motion';
import {
  Rocket,
  Lightbulb,
  Users,
  UserCheck,
  ListChecks,
  Repeat,
  Target,
  Palette,
  CreditCard,
  Image as ImageIcon,
  Linkedin,
  Globe,
  Github,
  CloudUpload,
  Video,
  Mic,
  AlertTriangle,
  Workflow,
  Sparkles,
  CircleDollarSign,
  Telescope,
  CheckCircle2,
  type LucideIcon,
} from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface RuleItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface DeliverableItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface PitchItem {
  step: string;
  title: string;
  question: string;
  icon: LucideIcon;
}

interface ChecklistItem {
  icon: LucideIcon;
  label: string;
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const RULES: RuleItem[] = [
  {
    icon: Users,
    title: 'Six Members',
    description: 'Each team must have 6 members.',
  },
  {
    icon: UserCheck,
    title: 'Balanced Team',
    description: 'Every team must include at least one boy and one girl.',
  },
  {
    icon: Lightbulb,
    title: 'One Startup Idea',
    description: 'Teams work together on one shared startup idea.',
  },
  {
    icon: Rocket,
    title: 'Everyone Builds',
    description: 'Each member is responsible for contributing to the startup journey.',
  },
  {
    icon: ListChecks,
    title: 'Complete Deliverables',
    description: 'Teams must finish all required deliverables before the final pitch.',
  },
];

const IDEA_CHANCES = [
  {
    icon: Repeat,
    title: 'Two Chances',
    description: 'Your team gets two chances to select a startup idea.',
  },
  {
    icon: Target,
    title: 'Evaluate Wisely',
    description: 'Carefully evaluate the idea before locking in your choice.',
  },
  {
    icon: Rocket,
    title: 'Commit & Build',
    description: 'Once assigned, proceed with the challenge deliverables right away.',
  },
];

const DELIVERABLES: DeliverableItem[] = [
  { icon: Palette, title: 'Logo Design', description: 'A memorable mark that represents your startup.' },
  { icon: CreditCard, title: 'Visiting Card', description: 'A crisp calling card for your brand.' },
  { icon: ImageIcon, title: 'Poster / Show Banner', description: 'A bold visual banner for your startup.' },
  { icon: Linkedin, title: 'LinkedIn Banner', description: 'A polished banner for your brand profile.' },
  { icon: Globe, title: 'Working Website', description: 'A functioning website for your product.' },
  { icon: Github, title: 'GitHub Repository', description: 'Your team source code, ready for review.' },
  { icon: CloudUpload, title: 'Deployed Website', description: 'Your website published and live online.' },
  { icon: Video, title: '5-Minute Video', description: 'A short pitch video presenting your startup.' },
  { icon: Mic, title: 'Final Pitch', description: 'Your live pitch to the judging panel.' },
];

const PITCH_REQUIREMENTS: PitchItem[] = [
  { step: '01', title: 'Problem', question: 'What problem are you solving?', icon: AlertTriangle },
  { step: '02', title: 'Target Users', question: 'Who experiences this problem?', icon: Users },
  { step: '03', title: 'Solution', question: 'How does your startup solve it?', icon: Lightbulb },
  { step: '04', title: 'Workflow', question: 'How does the solution work?', icon: Workflow },
  { step: '05', title: 'Uniqueness', question: 'What makes your solution different?', icon: Sparkles },
  {
    step: '06',
    title: 'Business Model',
    question: 'How can the startup create value and revenue?',
    icon: CircleDollarSign,
  },
  { step: '07', title: 'Future Scope', question: 'How can the startup grow in the future?', icon: Telescope },
];

const CHECKLIST: ChecklistItem[] = [
  { icon: Users, label: 'Team is complete' },
  { icon: Lightbulb, label: 'Startup idea is finalized' },
  { icon: Palette, label: 'Logo is ready' },
  { icon: CreditCard, label: 'Visiting card is ready' },
  { icon: ImageIcon, label: 'Poster / show banner is ready' },
  { icon: Linkedin, label: 'LinkedIn banner is ready' },
  { icon: Globe, label: 'Website is working' },
  { icon: Github, label: 'GitHub repository is ready' },
  { icon: CloudUpload, label: 'Website is deployed' },
  { icon: Video, label: '5-minute video is ready' },
  { icon: Mic, label: 'Final pitch is prepared' },
];

const SectionEyebrow: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-[#E63946]">
    <span className="h-1.5 w-1.5 rounded-full bg-[#E63946] shadow-[0_0_8px_rgba(230,57,70,0.9)]" />
    {label}
  </div>
);

const SectionHeading: React.FC<{
  eyebrow: string;
  title: string;
  description: string;
}> = ({ eyebrow, title, description }) => (
  <div className="space-y-1.5">
    <SectionEyebrow label={eyebrow} />
    <CardTitle className="text-white">{title}</CardTitle>
    <CardDescription className="text-[#8A8A8A]">{description}</CardDescription>
  </div>
);

export const TeamInstructionsPage: React.FC = () => {
  return (
    <PageContainer className="min-h-[calc(100vh-4rem)] bg-[#070707]">
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
        {/* HERO */}
        <motion.section variants={fadeUp}>
          <Card
            glass={false}
            className="relative overflow-hidden border-[#242424] shadow-[0_0_50px_-10px_rgba(230,57,70,0.45)]"
          >
            <div className="pointer-events-none absolute -inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E63946]/60 to-transparent" />
            <div className="pointer-events-none absolute -top-32 -right-24 h-80 w-80 rounded-full bg-[#E63946]/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 -left-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />

            <div className="relative flex flex-col gap-7">
              <div className="flex items-center gap-2 text-white">
                <Rocket className="h-5 w-5 text-[#E63946]" />
                <span className="font-display text-sm font-extrabold uppercase tracking-[0.2em]">
                  BUILD<span className="text-[#E63946]">2</span>PITCH
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h1 className="font-display text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                    CHALLENGE
                    <br />
                    INSTRUCTIONS
                  </h1>
                  <div className="hidden h-28 w-1 shrink-0 bg-gradient-to-b from-[#E63946] via-[#E63946]/40 to-transparent lg:block" />
                </div>
                <p className="max-w-2xl text-base text-[#8A8A8A] sm:text-lg">
                  Everything your team needs to know before building, submitting, and pitching your
                  startup.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 border-t border-[#242424]/60 pt-5">
                <Badge className="bg-[#E63946]/15 text-[#E63946] border-[#E63946]/30">
                  IDEATION → BUILD → DEPLOY → PITCH
                </Badge>
                <Badge variant="muted" className="text-[#8A8A8A] border-[#242424] bg-[#111111]">
                  OFFICIAL CHALLENGE BRIEF
                </Badge>
              </div>
            </div>
          </Card>
        </motion.section>

        {/* WHAT IS BUILD2PITCH */}
        <motion.section variants={fadeUp}>
          <Card glass={false} className="border-[#242424]">
            <CardHeader>
              <SectionHeading
                eyebrow="THE MISSION"
                title="What Is BUILD2PITCH?"
                description="One day. One startup. One winning pitch."
              />
              <CardDescription className="text-[#8A8A8A]">
                BUILD2PITCH is a startup-building challenge where student teams transform an idea
                into a startup concept, build their brand and product, and present their solution
                through a final pitch.
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.section>

        {/* TEAM RULES */}
        <motion.section variants={fadeUp}>
          <Card glass={false} className="border-[#242424]">
            <CardHeader>
              <SectionHeading
                eyebrow="THE TEAM"
                title="Team Rules"
                description="How your squad must operate."
              />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {RULES.map(({ icon: Icon, title, description }) => (
                  <motion.div
                    key={title}
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.2 }}
                    className="group flex items-start gap-3 rounded-lg border border-[#242424]/70 bg-[#161616]/70 p-4 transition-colors hover:border-[#E63946]/40"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E63946]/30 bg-[#E63946]/10 text-[#E63946]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">{title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-[#8A8A8A]">{description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* IDEA SELECTION */}
        <motion.section variants={fadeUp}>
          <Card
            glass={false}
            className="relative overflow-hidden border-[#E63946]/30 shadow-[0_0_40px_-10px_rgba(230,57,70,0.35)]"
          >
            <div className="pointer-events-none absolute -inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E63946]/60 to-transparent" />
            <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#E63946]/10 blur-3xl" />

            <CardHeader>
              <SectionHeading
                eyebrow="IDEA SELECTION"
                title="You Get Two Chances"
                description="Pick smart — then commit to the build. Once your idea is finalized and assigned, proceed straight into the challenge deliverables."
              />
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-[#E63946]/40 bg-gradient-to-b from-[#1A0D0F] to-[#111111] px-6 py-8 text-center">
                  <span className="font-display text-7xl font-black leading-none text-[#E63946] drop-shadow-[0_0_18px_rgba(230,57,70,0.55)]">
                    2
                  </span>
                  <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#8A8A8A]">
                    Chances Available
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-1 lg:col-span-2">
                  {IDEA_CHANCES.map(({ icon: Icon, title, description }) => (
                    <div
                      key={title}
                      className="flex items-start gap-3 rounded-lg border border-[#242424]/70 bg-[#161616]/70 p-4"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E63946]/30 bg-[#E63946]/10 text-[#E63946]">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white">{title}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-[#8A8A8A]">{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* DELIVERABLES */}
        <motion.section variants={fadeUp}>
          <Card glass={false} className="border-[#242424]">
            <CardHeader>
              <SectionHeading
                eyebrow="WHAT TO BUILD"
                title="The 9 Deliverables"
                description="Ship everything before the final pitch. This page is informational — completion is tracked on your dashboard."
              />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {DELIVERABLES.map(({ icon: Icon, title, description }, index) => (
                  <motion.div
                    key={title}
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.2 }}
                    className="group flex items-start gap-3 rounded-lg border border-[#242424]/70 bg-[#161616]/70 p-4 transition-colors hover:border-[#E63946]/40"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#242424] bg-[#111111] text-[#E63946]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-[#6E6E6E]">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <p className="truncate text-sm font-semibold text-white">{title}</p>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-[#8A8A8A]">{description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* FINAL PITCH REQUIREMENTS */}
        <motion.section variants={fadeUp}>
          <Card
            glass={false}
            className="relative overflow-hidden border-[#E63946]/30 shadow-[0_0_40px_-10px_rgba(230,57,70,0.35)]"
          >
            <div className="pointer-events-none absolute -inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E63946]/60 to-transparent" />

            <CardHeader>
              <SectionHeading
                eyebrow="THE STAGE"
                title="Final Pitch Requirements"
                description="Cover all seven beats in your pitch so judges can follow your startup story."
              />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {PITCH_REQUIREMENTS.map(({ step, title, question, icon: Icon }) => (
                  <div
                    key={step}
                    className="flex items-start gap-3 rounded-lg border border-[#242424]/70 bg-[#161616]/70 p-4"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-mono text-xs font-bold text-[#E63946]">{step}</span>
                      <Icon className="h-4 w-4 text-[#8A8A8A]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">{title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-[#8A8A8A]">{question}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* TEAM CHECKLIST */}
        <motion.section variants={fadeUp}>
          <Card glass={false} className="border-[#242424]">
            <CardHeader>
              <SectionHeading
                eyebrow="FINAL CHECK"
                title="Before You Pitch"
                description="Run through this list before submission. An informational checklist — actual status lives on your dashboard."
              />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {CHECKLIST.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 rounded-lg border border-[#242424]/70 bg-[#161616]/60 px-4 py-3"
                  >
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-[#E63946]" />
                    <span className="flex-1 text-sm text-white">{label}</span>
                    <Icon className="h-4 w-4 shrink-0 text-[#6E6E6E]" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* FINAL CTA */}
        <motion.section variants={fadeUp}>
          <Card
            glass={false}
            className="relative overflow-hidden border-[#242424] py-12 text-center shadow-[0_0_50px_-10px_rgba(230,57,70,0.4)]"
          >
            <div className="pointer-events-none absolute -inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E63946]/60 to-transparent" />
            <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-96 -translate-x-1/2 rounded-full bg-[#E63946]/10 blur-3xl" />

            <div className="relative space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#E63946]/40 bg-[#E63946]/10 text-[#E63946] shadow-[0_0_20px_-4px_rgba(230,57,70,0.7)]">
                <Rocket className="h-5 w-5" />
              </div>
              <h2 className="font-display text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                BUILD<span className="text-[#E63946]">.</span>&nbsp;BRAND<span className="text-[#E63946]">.</span>&nbsp;DEPLOY
                <span className="text-[#E63946]">.</span>&nbsp;PITCH<span className="text-[#E63946]">.</span>
              </h2>
              <p className="text-sm text-[#8A8A8A] sm:text-base">
                Turn your idea into something real.
              </p>
            </div>
          </Card>
        </motion.section>
      </motion.div>
    </PageContainer>
  );
};