import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { AlertTriangle, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <PageContainer maxWidth="narrow">
      <Card glow="amber" className="text-center py-12 space-y-4">
        <CardContent className="flex flex-col items-center space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h1 className="font-display text-4xl font-black text-foreground">
            404
          </h1>
          <p className="text-foreground-muted text-base max-w-sm">
            The requested page or route could not be found within the BUILD2PITCH platform.
          </p>
          <Link to="/">
            <Button variant="primary" size="md" className="gap-2 mt-4">
              <Home className="h-4 w-4" />
              <span>Return to Platform Home</span>
            </Button>
          </Link>
        </CardContent>
      </Card>
    </PageContainer>
  );
};
