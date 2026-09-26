import type { StartupIdea } from '@/types';

export default function IdeaCard({ idea }: { idea: StartupIdea | null }) {
  if (!idea) return null;

  return (
    <div className="panel idea-card" style={{ width: 'min(720px, 94vw)' }}>
      <span className="corner tl" />
      <span className="corner br" />

      {/* Top badges */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <span className="idea-category">{idea.industry || idea.category || 'Startup Challenge'}</span>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 10,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--silver-2)',
            padding: '4px 10px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 4,
          }}
        >
          {(idea.complexityLevel || idea.difficulty || 'Intermediate').toUpperCase()}
        </span>
      </div>

      {/* Title */}
      <h2 className="idea-title">{idea.title}</h2>

      {/* Problem Statement */}
      <div style={{ marginTop: 16 }}>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 10,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--blood-bright)',
            fontWeight: 700,
            marginBottom: 6,
          }}
        >
          Problem Statement
        </div>
        <p className="idea-desc" style={{ marginTop: 0 }}>
          {idea.problemStatement || idea.shortDescription}
        </p>
      </div>

      {/* Target Audience & Revenue Model Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 14,
          marginTop: 18,
        }}
      >
        <div className="problem-meta-box" style={{ margin: 0 }}>
          <div className="problem-meta-label">Target Audience</div>
          <div className="problem-meta-val">
            {idea.targetAudience || idea.targetUsers || 'Not specified'}
          </div>
        </div>

        <div className="problem-meta-box" style={{ margin: 0 }}>
          <div className="problem-meta-label">Revenue Model & Monetization</div>
          <div className="problem-meta-val" style={{ color: '#ffd166' }}>
            {idea.revenueModel || 'Subscription / Platform Commission / Transaction fees'}
          </div>
        </div>
      </div>

      {/* Key Features */}
      {idea.keyFeatures && idea.keyFeatures.length > 0 && (
        <div style={{ marginTop: 18 }}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--blood-bright)',
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            Key Features & Solution Highlights
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {idea.keyFeatures.map((feat, idx) => (
              <span key={idx} className="problem-feature-tag">
                ✓ {feat}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}