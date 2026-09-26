import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { StartupIdea } from '@/types';

export default function LockedScreen({ idea }: { idea: StartupIdea | null }) {
  if (!idea) return null;

  const rows: Array<[string, string]> = [
    ['Problem Statement', idea.problemStatement || ''],
    ['Target Audience', idea.targetAudience || idea.targetUsers || ''],
    ['Revenue Model', idea.revenueModel || 'Direct sales / Subscription / Platform fees'],
    ['Industry Track', idea.industry || idea.category || 'General Innovation'],
    ['Complexity Level', (idea.complexityLevel || idea.difficulty || 'Intermediate').toUpperCase()],
  ];

  return (
    <motion.section
      className="locked-screen"
      initial={{ opacity: 0, scale: 0.94, filter: 'blur(14px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.6, ease: 'easeOut' }}
      >
        <span className="locked-badge">✦ Problem Statement Locked ✦</span>
      </motion.div>

      <motion.h1
        className="locked-title"
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.7, ease: 'easeOut' }}
      >
        EXCLUSIVE TEAM ALLOCATION CONFIRMED
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.7, ease: 'easeOut' }}
      >
        <h2 className="brand" style={{ fontSize: 'clamp(28px, 6vw, 54px)', marginTop: 18 }}>
          {idea.title}
        </h2>
      </motion.div>

      <motion.div
        className="detail-grid"
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.7 } } }}
      >
        {rows.map(([label, value]) => (
          <motion.div
            key={label}
            className="panel detail-box"
            variants={{
              hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
              show: { opacity: 1, y: 0, filter: 'blur(0px)' },
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="detail-label">{label}</div>
            <div className="detail-text">{value}</div>
          </motion.div>
        ))}

        {idea.keyFeatures && idea.keyFeatures.length > 0 && (
          <motion.div
            className="panel detail-box"
            style={{ gridColumn: '1 / -1' }}
            variants={{
              hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
              show: { opacity: 1, y: 0, filter: 'blur(0px)' },
            }}
          >
            <div className="detail-label">Key Features & Highlights</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
              {idea.keyFeatures.map((f, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 13,
                    padding: '4px 10px',
                    borderRadius: 6,
                    background: 'rgba(230, 57, 70, 0.15)',
                    border: '1px solid rgba(230, 57, 70, 0.3)',
                    color: 'var(--silver-1)',
                  }}
                >
                  ✓ {f}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        style={{
          marginTop: 36,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          justifyContent: 'center',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <Link
          to="/team"
          className="btn"
          style={{
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span>Team Dashboard →</span>
        </Link>
        <Link
          to="/team/submission"
          className="btn-select-idea"
          style={{
            textDecoration: 'none',
            maxWidth: 240,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span>Project Deliverables →</span>
        </Link>
      </motion.div>

      <motion.p
        style={{
          marginTop: 26,
          fontFamily: 'var(--font-display)',
          fontSize: 11,
          letterSpacing: '0.28em',
          color: 'var(--silver-3)',
          textTransform: 'uppercase',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        ✦ Exclusive Lock Active: No other team can choose this problem statement ✦
      </motion.p>
    </motion.section>
  );
}