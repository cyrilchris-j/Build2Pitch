import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Rocket, Lightbulb, Users, Trophy, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Form Your Team',
      desc: 'Form a 6-member cross-functional student startup squad with designated roles.',
      icon: Users,
    },
    {
      step: '02',
      title: 'Receive Startup Idea',
      desc: 'Unlock your unique randomly assigned problem statement and industry vertical.',
      icon: Lightbulb,
    },
    {
      step: '03',
      title: 'Build & Brand',
      desc: 'Architect a working product demo, landing page, branding identity, and pitch deck.',
      icon: Rocket,
    },
    {
      step: '04',
      title: 'Pitch to Investors',
      desc: 'Deliver an elevator pitch and demo before judges in the grand finale.',
      icon: Trophy,
    },
  ];

  return (
    <PageContainer maxWidth="wide">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 text-center space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
          <Clock className="h-3.5 w-3.5" />
          ONE-DAY RAPID INCUBATION HACKATHON
        </div>

        <h1 className="mx-auto max-w-4xl font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-tight">
          From Concept to Capital in <span className="bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent">One Intense Day</span>
        </h1>

        <p className="mx-auto max-w-2xl text-base sm:text-lg text-foreground-muted leading-relaxed">
          6-member student teams receive a unique startup challenge, build real product prototypes, submit live deliverables, and pitch to venture judges.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link to="/register">
            <Button variant="primary" size="lg" className="gap-2 shadow-glow-primary">
              <span>Register Team</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/team/dashboard">
            <Button variant="outline" size="lg" className="gap-2">
              <Users className="h-4 w-4" />
              <span>Team Workspace</span>
            </Button>
          </Link>
          <Link to="/member-login">
            <Button variant="ghost" size="lg" className="gap-2">
              <ShieldCheck className="h-4 w-4" />
              <span>Member Pass</span>
            </Button>
          </Link>
        </div>
      </section>

      {/* Workflow Steps Grid */}
      <section className="py-12">
        <div className="text-center mb-12">
          <Badge variant="accent">Event Mechanics</Badge>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-foreground">
            The BUILD2PITCH Playbook
          </h2>
          <p className="text-sm text-foreground-muted max-w-lg mx-auto mt-1">
            An end-to-end simulation of the startup journey condensed into 12 high-velocity hours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.step} glow="cyan" className="relative group hover:border-primary/50 transition-all">
                <span className="font-mono text-3xl font-black text-foreground-subtle/30 absolute top-4 right-4 group-hover:text-primary/30 transition-colors">
                  {item.step}
                </span>
                <CardHeader>
                  <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-2">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{item.desc}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </PageContainer>
  );
};
