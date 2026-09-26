import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ideaRollService } from '@/services/api';
import type { IdeaComplexity, StartupIdea, SubmitOwnIdeaPayload } from '@/types';
import CinematicBackdrop from '@/components/idea/CinematicBackdrop';
import Dice3D from '@/components/idea/Dice3D';
import IdeaCard from '@/components/idea/IdeaCard';
import LockedScreen from '@/components/idea/LockedScreen';
import '@/components/idea/ideaStage.css';

const ROLL_DURATION_MS = 2000;
const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const INDUSTRY_PRESETS = [
  'EdTech',
  'HealthTech',
  'FinTech',
  'E-Commerce & Retail',
  'SaaS & DevTools',
  'AI & Automation',
  'AgriTech',
  'CleanTech & Energy',
  'Logistics & Mobility',
  'Social & Community',
  'Open Innovation',
];

type PagePhase = 'loading' | 'idle' | 'rolling' | 'revealed' | 'locked';

export const TeamIdeaPage: React.FC = () => {
  const [phase, setPhase] = useState<PagePhase>('loading');
  const [idea, setIdea] = useState<StartupIdea | null>(null);
  const [attemptsUsed, setAttemptsUsed] = useState(0);
  const [vaultCount, setVaultCount] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState(false);

  // Own Idea Form State
  const [ownTitle, setOwnTitle] = useState('');
  const [ownIndustry, setOwnIndustry] = useState('EdTech');
  const [customIndustry, setCustomIndustry] = useState('');
  const [ownProblem, setOwnProblem] = useState('');
  const [ownAudience, setOwnAudience] = useState('');
  const [ownRevenue, setOwnRevenue] = useState('');
  const [ownFeatures, setOwnFeatures] = useState('');
  const [ownComplexity, setOwnComplexity] = useState<IdeaComplexity>('intermediate');
  const [formError, setFormError] = useState<string | null>(null);

  const attemptsRemaining = Math.max(0, 3 - attemptsUsed);

  const loadVault = useCallback(async () => {
    try {
      const res = await ideaRollService.getVault();
      setVaultCount(res.count);
    } catch {
      setVaultCount(null);
    }
  }, []);

  const loadCurrentState = useCallback(async () => {
    setError(null);
    try {
      const state = await ideaRollService.myIdea();
      if (state.status === 'LOCKED' && state.idea) {
        setIdea(state.idea);
        setAttemptsUsed(state.attemptsUsed || 1);
        setPhase('locked');
      } else if (state.status === 'ROLLED' && state.idea) {
        setIdea(state.idea);
        setAttemptsUsed(state.attemptsUsed || 1);
        setPhase('revealed');
      } else {
        setIdea(null);
        setAttemptsUsed(0);
        setPhase('idle');
      }
    } catch {
      setPhase('idle');
    }
    loadVault();
  }, [loadVault]);

  useEffect(() => {
    loadCurrentState();
  }, [loadCurrentState]);

  // Roll the dice (up to 3 times)
  const handleRoll = async () => {
    if (busy) return;
    if (attemptsUsed >= 3) {
      setError('You have used all 3 attempts. Please lock your idea or submit your own idea.');
      return;
    }

    setBusy(true);
    setError(null);
    setPhase('rolling');

    try {
      const [res] = await Promise.all([ideaRollService.roll(), sleep(ROLL_DURATION_MS)]);
      setIdea(res.idea);
      setAttemptsUsed(res.attempt);

      // Trigger reveal flash
      setFlash(true);
      setTimeout(() => setFlash(false), 600);

      setPhase('revealed');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } }; message?: string })?.response
          ?.data?.message || (err as { message?: string })?.message;
      setError(msg || 'Roll failed. Please try again.');
      setPhase(idea ? 'revealed' : 'idle');
    } finally {
      setBusy(false);
      loadVault();
    }
  };

  // Lock the current rolled idea
  const handleLock = async () => {
    if (busy || !idea) return;

    const confirmed = window.confirm(
      `Are you sure you want to permanently lock "${idea.title}"?\n\nOnce locked, this problem statement is exclusively assigned to your team and cannot be changed or re-rolled.`
    );
    if (!confirmed) return;

    setBusy(true);
    setError(null);
    try {
      const res = await ideaRollService.lock();
      setIdea(res.idea);
      setPhase('locked');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } }; message?: string })?.response
          ?.data?.message || (err as { message?: string })?.message;
      setError(msg || 'Could not lock idea. Connection lost.');
    } finally {
      setBusy(false);
    }
  };

  // Submit own startup idea with mandatory validation
  const handleSubmitOwnIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const activeIndustry = ownIndustry === 'Custom' ? customIndustry.trim() : ownIndustry.trim();

    // Mandatory fields check
    if (!ownTitle.trim()) {
      setFormError('Startup / Idea Title is mandatory.');
      return;
    }
    if (!activeIndustry) {
      setFormError('Industry / Domain Track is mandatory.');
      return;
    }
    if (!ownProblem.trim() || ownProblem.trim().length < 10) {
      setFormError('Problem Statement is mandatory (minimum 10 characters).');
      return;
    }
    if (!ownAudience.trim()) {
      setFormError('Target Audience is mandatory.');
      return;
    }
    if (!ownRevenue.trim()) {
      setFormError('Revenue Model / Monetization Strategy is mandatory.');
      return;
    }

    const payload: SubmitOwnIdeaPayload = {
      title: ownTitle.trim(),
      industry: activeIndustry,
      problemStatement: ownProblem.trim(),
      targetAudience: ownAudience.trim(),
      revenueModel: ownRevenue.trim(),
      complexityLevel: ownComplexity,
      keyFeatures: ownFeatures
        ? ownFeatures
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
    };

    setBusy(true);
    try {
      const res = await ideaRollService.submitOwnIdea(payload);
      setIdea(res.idea);
      setPhase('locked');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } }; message?: string })?.response
          ?.data?.message || (err as { message?: string })?.message;
      setFormError(msg || 'Failed to submit own idea. Please verify inputs and try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="stage">
      <CinematicBackdrop />
      {flash && <div className="reveal-flash" />}

      <header className="title-block">
        <h1 className="brand">
          BUILD<span className="brand-accent">2</span>PITCH
        </h1>
        <p className="tagline">Interactive Dice Roll & Idea Selection</p>
        <div className="rule" />
      </header>

      <main
        className="stage-main"
        style={{
          position: 'relative',
          zIndex: 10,
          paddingTop: '3vh',
          paddingBottom: '14vh',
        }}
      >
        <AnimatePresence mode="wait">
          {/* Phase 1: Loading */}
          {phase === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'grid', placeItems: 'center', minHeight: 320 }}
            >
              <span className="loader" />
              <p
                style={{
                  marginTop: 18,
                  fontFamily: 'var(--font-display)',
                  fontSize: 12,
                  letterSpacing: '0.2em',
                  color: 'var(--silver-2)',
                }}
              >
                INITIALIZING STARTUP VAULT...
              </p>
            </motion.div>
          )}

          {/* Phase 2: Locked State */}
          {phase === 'locked' && (
            <motion.div
              key="locked"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LockedScreen idea={idea} />
            </motion.div>
          )}

          {/* Phase 3: Dice Rolling or Idle / Revealed Selection Stage */}
          {(phase === 'idle' || phase === 'rolling' || phase === 'revealed') && (
            <motion.div
              key="active-stage"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              style={{ width: 'min(1100px, 94vw)', margin: '0 auto' }}
            >
              {/* Header Status & Attempts Indicator */}
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '8px 20px',
                    borderRadius: 999,
                    background: 'rgba(230, 57, 70, 0.12)',
                    border: '1px solid rgba(230, 57, 70, 0.35)',
                    fontFamily: 'var(--font-display)',
                    fontSize: 11,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                  }}
                >
                  <span style={{ color: 'var(--silver-2)' }}>Attempts:</span>
                  <span style={{ color: 'var(--blood-bright)', fontWeight: 800 }}>
                    {attemptsUsed} / 3 Used
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
                  <span style={{ color: '#ffd166', fontWeight: 700 }}>
                    {attemptsRemaining} {attemptsRemaining === 1 ? 'Roll' : 'Rolls'} Remaining
                  </span>
                  {vaultCount !== null && (
                    <>
                      <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
                      <span style={{ color: 'var(--silver-2)' }}>Vault: {vaultCount} Available</span>
                    </>
                  )}
                </div>

                {error && (
                  <div className="error-banner" style={{ marginTop: 16 }}>
                    ⚠️ {error}
                  </div>
                )}
              </div>

              {/* 3D Dice Display */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 24,
                  marginBottom: 36,
                }}
              >
                <Dice3D rolling={phase === 'rolling'} />

                {/* Idle Mode: Initial Roll Button */}
                {phase === 'idle' && (
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: 'center' }}
                  >
                    <button
                      className="btn"
                      onClick={handleRoll}
                      disabled={busy}
                      style={{ fontSize: 13, letterSpacing: '0.22em' }}
                    >
                      <span>🎲 ROLL THE DICE (3 ATTEMPTS)</span>
                    </button>
                    <p
                      style={{
                        marginTop: 14,
                        fontSize: 13,
                        color: 'var(--silver-2)',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Roll to reveal your startup challenge. Each roll draws a{' '}
                      <strong style={{ color: '#ffffff' }}>unique, different problem</strong> from
                      the available vault.
                    </p>
                  </motion.div>
                )}

                {/* Rolling Mode: Spinner text */}
                {phase === 'rolling' && (
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 12,
                      letterSpacing: '0.28em',
                      color: 'var(--blood-bright)',
                      animation: 'pulse 1s infinite alternate',
                    }}
                  >
                    ✦ DRAWING RANDOM PROBLEM STATEMENT FROM VAULT... ✦
                  </p>
                )}

                {/* Revealed Mode: Display Revealed Problem Card with All Information */}
                {phase === 'revealed' && idea && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 24,
                      width: '100%',
                    }}
                  >
                    {/* Full Idea Card Component */}
                    <IdeaCard idea={idea} />

                    {/* Action Buttons: Lock vs Roll Again */}
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 16,
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        maxWidth: 620,
                      }}
                    >
                      <button
                        className="btn-select-idea"
                        onClick={handleLock}
                        disabled={busy}
                        style={{
                          flex: '1 1 240px',
                          padding: '16px 24px',
                          fontSize: 13,
                        }}
                      >
                        <span>🔒 LOCK THIS PROBLEM STATEMENT</span>
                      </button>

                      {attemptsRemaining > 0 && (
                        <button
                          className="btn"
                          onClick={handleRoll}
                          disabled={busy}
                          style={{
                            flex: '1 1 240px',
                            padding: '16px 24px',
                            fontSize: 13,
                          }}
                        >
                          <span>🎲 ROLL AGAIN ({attemptsRemaining} LEFT)</span>
                        </button>
                      )}
                    </div>

                    {attemptsRemaining === 0 && (
                      <p
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: 11,
                          letterSpacing: '0.2em',
                          color: '#ffd166',
                          textTransform: 'uppercase',
                        }}
                      >
                        ✦ All 3 rolls used. Lock this problem statement above, or pitch your own idea
                        below. ✦
                      </p>
                    )}
                  </motion.div>
                )}
              </div>

              {/* ─── OWN IDEA SUBMISSION SECTION ─── */}
              <div className="own-idea-card" style={{ marginTop: 40 }}>
                <div className="own-idea-header">
                  <div>
                    <span className="own-idea-badge">✦ Alternative Option ✦</span>
                    <h3 className="own-idea-title">Submit Your Own Startup Idea</h3>
                    <p className="own-idea-desc">
                      Have an original concept or challenge of your own? Fill in the basic mandatory
                      information below to register and exclusively lock your custom idea for your
                      team.
                    </p>
                  </div>
                </div>

                {formError && (
                  <div
                    className="error-banner"
                    style={{ marginBottom: 20, width: '100%', boxSizing: 'border-box' }}
                  >
                    ⚠️ {formError}
                  </div>
                )}

                <form onSubmit={handleSubmitOwnIdea}>
                  <div className="own-form-grid">
                    {/* Startup Title */}
                    <div className="own-form-group">
                      <label className="own-form-label">
                        Startup Name / Concept Title <span className="required-star">*</span>
                      </label>
                      <input
                        type="text"
                        className="own-form-input"
                        placeholder="e.g., AgriLink, DocuFlow, MediAlert"
                        value={ownTitle}
                        onChange={(e) => setOwnTitle(e.target.value)}
                        disabled={busy}
                        required
                      />
                    </div>

                    {/* Industry Track */}
                    <div className="own-form-group">
                      <label className="own-form-label">
                        Industry Track <span className="required-star">*</span>
                      </label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <select
                          className="own-form-select"
                          value={ownIndustry}
                          onChange={(e) => setOwnIndustry(e.target.value)}
                          disabled={busy}
                          style={{ flex: 1 }}
                        >
                          {INDUSTRY_PRESETS.map((ind) => (
                            <option key={ind} value={ind}>
                              {ind}
                            </option>
                          ))}
                          <option value="Custom">Other (Specify Custom Track)</option>
                        </select>
                        {ownIndustry === 'Custom' && (
                          <input
                            type="text"
                            className="own-form-input"
                            placeholder="Enter Track"
                            value={customIndustry}
                            onChange={(e) => setCustomIndustry(e.target.value)}
                            disabled={busy}
                            style={{ flex: 1 }}
                            required
                          />
                        )}
                      </div>
                    </div>

                    {/* Target Audience */}
                    <div className="own-form-group">
                      <label className="own-form-label">
                        Target Audience / Customer Segment <span className="required-star">*</span>
                      </label>
                      <input
                        type="text"
                        className="own-form-input"
                        placeholder="e.g., College students, Local shopkeepers, Freelancers"
                        value={ownAudience}
                        onChange={(e) => setOwnAudience(e.target.value)}
                        disabled={busy}
                        required
                      />
                    </div>

                    {/* Revenue Model */}
                    <div className="own-form-group">
                      <label className="own-form-label">
                        Revenue Model / Monetization Strategy <span className="required-star">*</span>
                      </label>
                      <input
                        type="text"
                        className="own-form-input"
                        placeholder="e.g., 5% Commission per transaction, $12/month SaaS tier"
                        value={ownRevenue}
                        onChange={(e) => setOwnRevenue(e.target.value)}
                        disabled={busy}
                        required
                      />
                    </div>

                    {/* Complexity Level */}
                    <div className="own-form-group">
                      <label className="own-form-label">Complexity Level</label>
                      <select
                        className="own-form-select"
                        value={ownComplexity}
                        onChange={(e) => setOwnComplexity(e.target.value as IdeaComplexity)}
                        disabled={busy}
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>

                    {/* Key Features (Optional) */}
                    <div className="own-form-group">
                      <label className="own-form-label">
                        Key Features / Solution Highlights (1 per line)
                      </label>
                      <input
                        type="text"
                        className="own-form-input"
                        placeholder="e.g., Real-time inventory tracking, AI recommendation, UPI checkout"
                        value={ownFeatures}
                        onChange={(e) => setOwnFeatures(e.target.value)}
                        disabled={busy}
                      />
                    </div>

                    {/* Problem Statement (Full Width) */}
                    <div className="own-form-group full-width">
                      <label className="own-form-label">
                        Detailed Problem Statement <span className="required-star">*</span>
                      </label>
                      <textarea
                        className="own-form-textarea"
                        placeholder="Describe the problem, the specific pain points of your target audience, and why existing solutions are inadequate..."
                        value={ownProblem}
                        onChange={(e) => setOwnProblem(e.target.value)}
                        rows={4}
                        disabled={busy}
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button Row */}
                  <div
                    style={{
                      marginTop: 26,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 16,
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                      paddingTop: 20,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        color: 'var(--silver-3)',
                        fontFamily: 'var(--font-display)',
                        letterSpacing: '0.12em',
                      }}
                    >
                      <span className="required-star">*</span> Mandatory fields: Title, Industry
                      Track, Problem Statement, Target Audience, Revenue Model.
                    </span>

                    <button type="submit" className="btn-submit-own" disabled={busy}>
                      <span>{busy ? 'Processing...' : '✦ Submit & Lock Own Idea'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default TeamIdeaPage;