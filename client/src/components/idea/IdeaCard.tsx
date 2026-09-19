import type { StartupIdea } from '@/types';

export default function IdeaCard({ idea }: { idea: StartupIdea | null }) {
  if (!idea) return null;
  return (
    <div className="panel idea-card">
      <span className="corner tl" />
      <span className="corner br" />
      <span className="idea-category">{idea.category || idea.industry || 'Startup'}</span>
      <h2 className="idea-title">{idea.title}</h2>
      <p className="idea-desc">
        {idea.shortDescription || 'Your challenge awaits — study it, own it, build it.'}
      </p>
    </div>
  );
}