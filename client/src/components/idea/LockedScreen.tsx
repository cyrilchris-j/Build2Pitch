import { motion } from 'framer-motion';
import type { StartupIdea } from '@/types';

export default function LockedScreen({ idea }: { idea: StartupIdea | null }) {
  if (!idea) return null;
  const rows: Array<[string, string]> = [
    ['Problem', idea.problemStatement],
    ['Target Users', idea.targetAudience],
    ['Category', idea.category || idea.industry],
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
        <span className="locked-badge">✦ Idea Locked ✦</span>
      </motion.div>

      <motion.h1
        className="locked-title"
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.7, ease: 'easeOut' }}
      >
        YOUR STARTUP HAS BEEN SELECTED
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
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.8 } } }}
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
      </motion.div>

      <motion.p
        style={{ marginTop: 30, fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.28em', color: 'var(--silver-3)', textTransform: 'uppercase' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
      >
        This idea is locked to your team. No changes, no re-rolls.
      </motion.p>
    </motion.section>
  );
}