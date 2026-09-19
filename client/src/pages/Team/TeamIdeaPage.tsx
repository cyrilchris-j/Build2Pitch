import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ideaRollService } from '@/services/api';
import type { StartupIdea } from '@/types';
import CinematicBackdrop from '@/components/idea/CinematicBackdrop';
import Dice3D from '@/components/idea/Dice3D';
import IdeaCard from '@/components/idea/IdeaCard';
import LockedScreen from '@/components/idea/LockedScreen';
import '@/components/idea/ideaStage.css';

const ROLL_DURATION_MS = 2300;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

type DicePhase = 'loading' | 'idle' | 'rolling' | 'reveal-1' | 'reveal-2' | 'locked';

export const TeamIdeaPage: React.FC = () => {
  const [phase, setPhase] = useState<DicePhase>('loading');
  const [idea, setIdea] = useState<StartupIdea | null>(null);
  const [attemptsUsed, setAttemptsUsed] = useState(0);
  const [vaultCount, setVaultCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const attemptsRemaining = Math.max(0, 2 - attemptsUsed);

  const loadVault = useCallback(async () => {
    try {
      const res = await ideaRollService.getVault();
      setVaultCount(res.count);
    } catch {
      setVaultCount(null);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const state = await ideaRollService.myIdea();
        if (state.status === 'LOCKED') {
          setIdea(state.idea);
          setAttemptsUsed(state.attemptsUsed);
          setPhase('locked');
        } else if (state.status === 'ROLLED') {
          setIdea(state.idea);
          setAttemptsUsed(state.attemptsUsed);
          setPhase(state.attemptsUsed >= 2 ? 'reveal-2' : 'reveal-1');
        } else {
          setPhase('idle');
        }
      } catch {
        setPhase('idle');
      }
      loadVault();
    })();
  }, [loadVault]);

  useEffect(() => {
    if (phase === 'locked') loadVault();
  }, [phase, loadVault]);

  const handleRoll = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    setPhase('rolling');
    try {
      const [res] = await Promise.all([ideaRollService.roll(), sleep(ROLL_DURATION_MS)]);
      setIdea(res.idea);
      setAttemptsUsed(res.attempt);
      setPhase(res.attempt >= 2 ? 'reveal-2' : 'reveal-1');
    } catch (err) {
      const message = (err as { message?: string })?.message;
      setError(message || 'Connection lost. Try again.');
      setPhase('idle');
    } finally {
      setBusy(false);
    }
  };

  const handleLock = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await ideaRollService.lock();
      setIdea(res.idea);
      setAttemptsUsed(2);
      setPhase('locked');
    } catch (err) {
      const message = (err as { message?: string })?.message;
      setError(message || 'Could not lock your idea. Connection lost.');
    } finally {
      setBusy(false);
    }
  };

  const hud = useMemo(
    () => ({
      attempts: attemptsRemaining,
      vault: vaultCount,
      locked: phase === 'locked',
    }),
    [attemptsRemaining, vaultCount, phase]
  );

  return (
    <div className="stage">
      <CinematicBackdrop />

      <header className="title-block">
        <h1 className="brand">
          BUILD<span className="brand-accent">2</span>PITCH
        </h1>
        <p className="tagline">Your Startup Awaits</p>
        <div className="rule" />
      </header>

      <main className="stage-main" style={{ position: 'relative', zIndex: 10, paddingTop: '5vh', paddingBottom: '14vh' }}>
        <AnimatePresence mode="wait">
          {phase === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'grid', placeItems: 'center', minHeight: 320 }}
            >
              <span className="loader" />
            </motion.div>
          )}

          {phase === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{ display: 'grid', placeItems: 'center', gap: 34 }}
            >
              <Dice3D rolling={false} />
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.3em', color: 'var(--silver-3)', fontSize: 12 }}>
                  ATTEMPTS REMAINING{' '}
                  <span style={{ color: 'var(--blood-bright)', fontSize: 15, fontWeight: 700 }}>
                    {hud.attempts}
                  </span>
                </p>
              </div>
              <button className="btn btn-solid" onClick={handleRoll} disabled={busy}>
                Roll For Your Idea
              </button>
            </motion.div>
          )}

          {phase === 'rolling' && (
            <motion.div
              key="rolling"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'grid', placeItems: 'center', gap: 34 }}
            >
              <Dice3D rolling />
              <p style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.34em', color: 'var(--blood-bright)', fontSize: 13, textTransform: 'uppercase', textShadow: '0 0 18px rgba(230,57,70,0.7)' }}>
                Rolling the dice…
              </p>
              <p style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.2em', color: 'var(--silver-3)', fontSize: 11 }}>
                CHANCE {Math.min(attemptsUsed + 1, 2)} OF 2
              </p>
            </motion.div>
          )}

          {(phase === 'reveal-1' || phase === 'reveal-2') && (
            <motion.div
              key={`reveal-${idea ? idea.id : phase}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              style={{ display: 'grid', placeItems: 'center', gap: 28, padding: '0 16px' }}
            >
              <RevealFlash />
              <motion.div
                initial={{ rotateY: 75, opacity: 0, scale: 0.6, filter: 'blur(16px)' }}
                animate={{ rotateY: 0, opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformPerspective: 1400 }}
              >
                <span className="idea-category" style={{ marginBottom: 14, background: 'rgba(230,57,70,0.1)' }}>
                  CHANCE {phase === 'reveal-1' ? '1' : '2'} OF 2 — REVEALED
                </span>
              </motion.div>
              <motion.div
                style={{ transformPerspective: 1400 }}
                initial={{ rotateY: -70, opacity: 0, scale: 0.7, filter: 'blur(18px)' }}
                animate={{ rotateY: 0, opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <IdeaCard idea={idea} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85, duration: 0.5 }}
              >
                <p style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.28em', color: 'var(--silver-3)', fontSize: 12, textAlign: 'center', marginBottom: 16 }}>
                  ATTEMPTS REMAINING:{' '}
                  <span style={{ color: 'var(--blood-bright)', fontWeight: 700, fontSize: 14 }}>
                    {hud.attempts}
                  </span>
                </p>
                <div className="btn-row">
                  {phase === 'reveal-1' ? (
                    <>
                      <button className="btn btn-solid" onClick={handleLock} disabled={busy}>
                        Keep This Idea
                      </button>
                      <button className="btn btn-ghost" onClick={handleRoll} disabled={busy}>
                        Roll Again
                      </button>
                    </>
                  ) : (
                    <button className="btn btn-solid" onClick={handleLock} disabled={busy}>
                      Lock Idea
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}

          {phase === 'locked' && (
            <motion.div
              key="locked"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <LockedScreen idea={idea} />
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="error-banner" role="alert">
            {error}
          </div>
        )}
      </main>

      <footer className="hud">
        <span className={`hud-chip ${hud.attempts > 0 ? '' : 'done'}`}>
          <span className="dot" />
          {hud.attempts} roll{hud.attempts === 1 ? '' : 's'} left
        </span>
        <span className="hud-chip">
          <span className="dot" />
          {hud.vault === null ? '—' : hud.vault} ideas in vault
        </span>
        <span className={`hud-chip ${hud.locked ? 'done' : ''}`}>
          <span className="dot" />
          {hud.locked ? 'Idea locked' : 'Roll to claim'}
        </span>
      </footer>
    </div>
  );
};

function RevealFlash() {
  return (
    <motion.div
      className="reveal-flash"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.9, delay: 0.1 }}
    />
  );
}

export default TeamIdeaPage;