import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Code, ExternalLink, Sparkles, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface PlaceholderViewProps {
  title: string;
  routePath: string;
  module: 'Landing' | 'Auth' | 'Team' | 'Member' | 'Admin';
  description: string;
  expectedModels?: string[];
  nextSteps?: string[];
  primaryAction?: {
    label: string;
    to: string;
  };
}

export const PlaceholderView: React.FC<PlaceholderViewProps> = ({
  title,
  routePath,
  module,
  description,
  expectedModels = [],
  nextSteps = [],
  primaryAction,
}) => {
  const moduleColorMap = {
    Landing: 'accent',
    Auth: 'primary',
    Team: 'primary',
    Member: 'accent',
    Admin: 'danger',
  } as const;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Route Badge & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <Badge variant={moduleColorMap[module]}>{module} Module</Badge>
            <span className="font-mono text-xs text-foreground-subtle bg-card/80 px-2 py-0.5 rounded border border-border">
              {routePath}
            </span>
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mt-2">
            {title}
          </h2>
          <p className="text-sm text-foreground-muted">
            {description}
          </p>
        </div>

        {primaryAction && (
          <Link to={primaryAction.to}>
            <Button variant="primary" size="sm" className="gap-2">
              <span>{primaryAction.label}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </Link>
        )}
      </div>

      {/* Developer Foundation Card */}
      <Card glow="cyan">
        <CardHeader>
          <div className="flex items-center gap-2 text-primary text-sm font-semibold">
            <Terminal className="h-4 w-4" />
            <span>Architecture Scaffold State: Ready for Feature Development</span>
          </div>
          <CardTitle>Developer Guidance & Next Implementation Steps</CardTitle>
          <CardDescription>
            This route is wired into the central router with all necessary layout containers and design tokens.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Associated Types & Models */}
            <div className="rounded-lg bg-background/50 border border-border p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                <Code className="h-3.5 w-3.5 text-primary" />
                <span>Bound Data Models</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {expectedModels.length > 0 ? (
                  expectedModels.map((model) => (
                    <span
                      key={model}
                      className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-xs font-mono text-primary-light"
                    >
                      {model}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-foreground-subtle">No specific model required</span>
                )}
              </div>
            </div>

            {/* Next Steps Checklist */}
            <div className="rounded-lg bg-background/50 border border-border p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                <span>Feature Sprint Scope</span>
              </div>
              <ul className="text-xs text-foreground-muted space-y-1.5 list-disc list-inside">
                {nextSteps.length > 0 ? (
                  nextSteps.map((step, idx) => <li key={idx}>{step}</li>)
                ) : (
                  <li>Implement dedicated UI widgets and connect to API service</li>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
