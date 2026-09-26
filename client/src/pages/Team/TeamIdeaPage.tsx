import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ideaRollService } from '@/services/api';
import type { IdeaComplexity, StartupIdea, SubmitOwnIdeaPayload } from '@/types';
import CinematicBackdrop from '@/components/idea/CinematicBackdrop';
import LockedScreen from '@/components/idea/LockedScreen';
import '@/components/idea/ideaStage.css';

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

export const TeamIdeaPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [lockedIdea, setLockedIdea] = useState<StartupIdea | null>(null);
  const [options, setOptions] = useState<StartupIdea[]>([]);
  const [teamName, setTeamName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

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

  // Load 3 Options or existing locked idea
  const loadOptions = useCallback(async () => {
    setError(null);
    try {
      const res = await ideaRollService.getOptions();
      if (res.status === 'LOCKED' && res.selectedIdea) {
        setLockedIdea(res.selectedIdea);
        setOptions([]);
      } else {
        setLockedIdea(null);
        setOptions(res.options || []);
      }
      if (res.teamName) {
        setTeamName(res.teamName);
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } }; message?: string })
        ?.response?.data?.message || (err as { message?: string })?.message;
      setError(msg || 'Unable to retrieve problem statements. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  // Select one of the 3 pre-defined problem statement options
  const handleSelectIdea = async (idea: StartupIdea) => {
    const ideaId = idea.id || idea._id;
    if (!ideaId) return;

    const confirmed = window.confirm(
      `Are you sure you want to select "${idea.title}"?\n\nThis problem statement will be exclusively locked to your team and unavailable to any other team.`
    );
    if (!confirmed) return;

    setBusy(true);
    setError(null);
    try {
      const res = await ideaRollService.selectIdea(ideaId);
      setLockedIdea(res.idea);
      setOptions([]);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } }; message?: string })
        ?.response?.data?.message || (err as { message?: string })?.message;
      setError(msg || 'Selection failed. The idea might have just been chosen by another team.');
      // Refresh options to give fresh unassigned pool
      await loadOptions();
    } finally {
      setBusy(false);
    }
  };

  // Submit own startup idea with mandatory validation
  const handleSubmitOwnIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const activeIndustry = ownIndustry === 'Custom' ? customIndustry.trim() : ownIndustry.trim();

    // Validate mandatory fields
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
      setLockedIdea(res.idea);
      setOptions([]);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } }; message?: string })
        ?.response?.data?.message || (err as { message?: string })?.message;
      setFormError(msg || 'Failed to submit own idea. Please check the inputs and try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="stage">
      <CinematicBackdrop />

      <header className="title-block">
        <h1 className="brand">
          BUILD<span className="brand-accent">2</span>PITCH
        </h1>
        <p className="tagline">
          {teamName ? `Team: ${teamName} • Problem Statement Selection` : 'Problem Statement Selection'}
        </p>
        <div className="rule" />
      </header>

      <main
        className="stage-main"
        style={{
          position: 'relative',
          zIndex: 10,
          paddingTop: '3vh',
          paddingBottom: '12vh',
        }}
      >
        <AnimatePresence mode="wait">
          {loading ? (
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
                INITIALIZING PROBLEM CATALOG...
              </p>
            </motion.div>
          ) : lockedIdea ? (
            <motion.div
              key="locked"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LockedScreen idea={lockedIdea} />
            </motion.div>
          ) : (
            <motion.div
              key="selection"
              className="options-container"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5 }}
            >
              {/* Header Info */}
              <div className="options-header">
                <span className="options-badge">
                  ✦ 3 Problem Options Available • Exclusive Lock Guaranteed ✦
                </span>
                <h2 className="options-headline">Select Your Startup Challenge</h2>
                <p className="options-sub">
                  Choose one of the 3 curated problem statements below, or pitch your team’s own original
                  idea. Once selected, your problem statement is{' '}
                  <strong style={{ color: 'var(--blood-bright)' }}>permanently locked</strong> and
                  cannot be taken by any other team.
                </p>

                {error && (
                  <div
                    className="error-banner"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                      marginTop: 20,
                    }}
                  >
                    <span>⚠️ {error}</span>
                    <button
                      onClick={loadOptions}
                      disabled={busy}
                      style={{
                        padding: '6px 14px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.25)',
                        borderRadius: 6,
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: 12,
                        fontFamily: 'var(--font-display)',
                      }}
                    >
                      Refresh Options
                    </button>
                  </div>
                )}
              </div>

              {/* 3 Problem Statement Cards Grid */}
              <div className="idea-grid">
                {options.map((opt, idx) => (
                  <div key={opt.id || opt._id || idx} className="problem-card">
                    <div>
                      {/* Top Badges */}
                      <div className="problem-card-top">
                        <span className="pill-category">
                          {opt.industry || opt.category || 'Innovation'}
                        </span>
                        <span className="pill-complexity">
                          {(opt.complexityLevel || opt.difficulty || 'Intermediate').toUpperCase()}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="problem-card-title">{opt.title}</h3>

                      {/* Problem Statement (Full content visible upfront) */}
                      <p className="problem-card-desc">{opt.problemStatement}</p>

                      {/* Target Audience Box */}
                      <div className="problem-meta-box">
                        <div className="problem-meta-label">Target Audience</div>
                        <div className="problem-meta-val">
                          {opt.targetAudience || opt.targetUsers || 'Not specified'}
                        </div>
                      </div>

                      {/* Revenue Model Box */}
                      <div className="problem-meta-box">
                        <div className="problem-meta-label">Revenue Model & Monetization</div>
                        <div className="problem-meta-val" style={{ color: '#ffd166' }}>
                          {opt.revenueModel || 'Subscription / Transaction fee / Commission'}
                        </div>
                      </div>

                      {/* Key Features */}
                      {opt.keyFeatures && opt.keyFeatures.length > 0 && (
                        <div className="problem-features-list">
                          {opt.keyFeatures.map((feat, fIdx) => (
                            <span key={fIdx} className="problem-feature-tag">
                              • {feat}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Select & Lock Button */}
                    <button
                      className="btn-select-idea"
                      disabled={busy}
                      onClick={() => handleSelectIdea(opt)}
                      title="Select and lock this problem statement exclusively for your team"
                    >
                      <span>🔒 Select & Lock This Idea</span>
                    </button>
                  </div>
                ))}

                {options.length === 0 && (
                  <div
                    style={{
                      gridColumn: '1 / -1',
                      textAlign: 'center',
                      padding: 40,
                      background: 'rgba(255,255,255,0.02)',
                      borderRadius: 12,
                      border: '1px dashed rgba(255,255,255,0.1)',
                    }}
                  >
                    <p style={{ color: 'var(--silver-2)', fontSize: 16 }}>
                      No available pre-defined problem statements currently in vault.
                    </p>
                    <button
                      onClick={loadOptions}
                      className="btn"
                      style={{ marginTop: 16 }}
                      disabled={busy}
                    >
                      <span>Refresh Catalog</span>
                    </button>
                  </div>
                )}
              </div>

              {/* ─── OWN IDEA SUBMISSION SECTION ─── */}
              <div className="own-idea-card">
                <div className="own-idea-header">
                  <div>
                    <span className="own-idea-badge">✦ Original Concept ✦</span>
                    <h3 className="own-idea-title">Submit Your Own Startup Idea</h3>
                    <p className="own-idea-desc">
                      Prefer to solve an original challenge? Complete all mandatory fields below to
                      register and lock your unique problem statement.
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
                        placeholder="e.g., College students, Local retailers, Remote workers"
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
                        placeholder="e.g., 5% Commission per order, Monthly SaaS subscription ($15/mo)"
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
                        placeholder="e.g., Real-time inventory, WhatsApp notifications, Instant payments"
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
                        placeholder="Clearly explain the real-world problem you are addressing, why it matters, and who is suffering from this issue..."
                        value={ownProblem}
                        onChange={(e) => setOwnProblem(e.target.value)}
                        rows={4}
                        disabled={busy}
                        required
                      />
                    </div>
                  </div>

                  {/* Submission Row */}
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
                      <span className="required-star">*</span> All highlighted fields are mandatory
                      before submission.
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