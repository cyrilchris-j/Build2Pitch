import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { submissionService } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import type { Submission } from '@/types';
import {
  Image,
  Globe,
  Video,
  FileText,
  Lock,
  Save,
  Send,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';

export const TeamSubmissionPage: React.FC = () => {
  const { user } = useAuth();
  const [serverIsTeamLead, setServerIsTeamLead] = useState<boolean | null>(null);

  const userRole = (user?.role || '').toLowerCase();
  const isExplicitMember = userRole === 'member';

  // Team Lead determination: true unless user is explicitly a non-lead member or server returned false
  const isTeamLead = serverIsTeamLead !== null ? serverIsTeamLead : (!isExplicitMember);

  const [submission, setSubmission] = useState<Partial<Submission>>({
    startupName: '',
    tagline: '',
    logoUrl: '',
    visitingCardUrl: '',
    posterUrl: '',
    linkedinBannerUrl: '',
    githubUrl: '',
    deployedUrl: '',
    videoUrl: '',
    pitchDeckUrl: '',
    businessModel: '',
    finalPitchNotes: '',
    submissionStatus: 'NOT_STARTED',
    isFinal: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchSubmissionData();
  }, []);

  const fetchSubmissionData = async () => {
    try {
      setError(null);
      const response = await submissionService.getSubmission();
      if (response.data?.data?.submission) {
        setSubmission(response.data.data.submission);
      }
      if (response.data?.data?.isTeamLead !== undefined) {
        setServerIsTeamLead(response.data.data.isTeamLead);
      }
    } catch (err: any) {
      console.error('Error fetching submission:', err);
    }
  };

  const handleInputChange = (field: keyof Submission, value: string) => {
    setSubmission((prev) => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSaveDraft = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);
      const response = await submissionService.saveDraft(submission);
      if (response.data?.data) {
        setSubmission(response.data.data);
        setSuccessMessage('Submission draft saved successfully.');
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save draft.');
    } finally {
      setIsSaving(false);
    }
  };

  const validateRequiredDeliverables = (): boolean => {
    const errors: Record<string, string> = {};
    if (!submission.logoUrl?.trim()) errors.logoUrl = 'Logo Drive Link is required';
    if (!submission.visitingCardUrl?.trim()) errors.visitingCardUrl = 'Visiting Card Drive Link is required';
    if (!submission.posterUrl?.trim()) errors.posterUrl = 'Poster / Show Banner Drive Link is required';
    if (!submission.linkedinBannerUrl?.trim()) errors.linkedinBannerUrl = 'LinkedIn Banner Card Drive Link is required';
    if (!submission.githubUrl?.trim()) errors.githubUrl = 'GitHub Repository URL is required';
    if (!submission.deployedUrl?.trim()) errors.deployedUrl = 'Deployed Website URL is required';
    if (!submission.videoUrl?.trim()) errors.videoUrl = '5-Minute Video URL is required';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInitiateFinalSubmit = () => {
    if (validateRequiredDeliverables()) {
      setShowConfirmModal(true);
    } else {
      setError('Please fill in all 7 mandatory deliverable fields before final submission.');
    }
  };

  const handleConfirmFinalSubmit = async () => {
    setShowConfirmModal(false);
    try {
      setIsSubmitting(true);
      setError(null);
      const response = await submissionService.submitFinal(submission);
      if (response.data?.data) {
        setSubmission(response.data.data);
        setShowSuccessModal(true);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit deliverables.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const requiredFields: (keyof Submission)[] = [
    'logoUrl',
    'visitingCardUrl',
    'posterUrl',
    'linkedinBannerUrl',
    'githubUrl',
    'deployedUrl',
    'videoUrl',
  ];
  const completedCount = requiredFields.filter((f) => Boolean(submission[f]?.toString().trim())).length;
  const progressPercent = Math.round((completedCount / requiredFields.length) * 100);

  const isLocked =
    submission.submissionStatus === 'LOCKED' ||
    submission.submissionStatus === 'SUBMITTED' ||
    Boolean(submission.isFinal);

  const renderStatusBadge = () => {
    const status = submission.submissionStatus || 'NOT_STARTED';
    switch (status) {
      case 'LOCKED':
      case 'SUBMITTED':
        return <Badge variant="accent" className="gap-1.5"><Lock className="h-3 w-3" /> SUBMITTED &amp; LOCKED</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="accent">IN PROGRESS</Badge>;
      default:
        return <Badge variant="muted">NOT STARTED</Badge>;
    }
  };

  return (
    <PageContainer
      title="Submit Your Startup"
      subtitle="Final deliverable repository &amp; pitch assets center for BUILD2PITCH 2026."
      actions={
        <div className="flex items-center gap-3">
          {renderStatusBadge()}
        </div>
      }
    >
      {/* Progress & Alert Banners */}
      <div className="mb-8 space-y-4">
        {/* Progress Card */}
        <Card className="p-5 border-border bg-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
            <span className="text-sm font-semibold text-foreground">
              Required Deliverables Completion ({completedCount} / {requiredFields.length})
            </span>
            <span className="text-xs font-mono font-bold text-primary">{progressPercent}%</span>
          </div>
          <div className="w-full bg-[#242424] h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </Card>

        {/* Authorization Banner for Members */}
        {!isTeamLead && (
          <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card text-foreground">
            <ShieldAlert className="h-5 w-5 text-primary shrink-0" />
            <div className="text-sm">
              <span className="font-bold text-primary">Team Member View:</span> Only the authenticated <span className="font-bold">Team Lead</span> has permission to save or finalize startup submissions.
            </div>
          </div>
        )}

        {/* Locked Banner */}
        {isLocked && (
          <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card text-foreground">
            <Lock className="h-5 w-5 text-primary shrink-0" />
            <div className="text-sm">
              <span className="font-bold text-primary">Submission Locked:</span> Your team's startup deliverables have been submitted successfully and are currently locked for judging.
            </div>
          </div>
        )}

        {/* Error / Success Notifications */}
        {error && (
          <div className="p-4 rounded-xl border border-primary bg-card text-primary text-sm flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-4 rounded-xl border border-border bg-card text-foreground text-sm flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}
      </div>

      {/* Deliverable Card with Single Master 2-Column Form Grid */}
      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border pb-6">
          <CardTitle className="text-foreground">STARTUP DELIVERABLES SUBMISSION</CardTitle>
          <CardDescription className="text-foreground-muted">
            Provide valid public URLs for all required branding, product, media, and pitch assets.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SECTION 1: BRANDING */}
            <div className="col-span-1 md:col-span-2 flex items-center gap-2 text-primary pb-2 border-b border-border">
              <Image className="h-5 w-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">1. BRANDING &amp; ASSETS</h3>
              <span className="text-xs text-foreground-muted font-normal ml-2 hidden sm:inline">
                Google Drive links for your startup branding designs (Ensure link access is set to &apos;Anyone with the link can view&apos;)
              </span>
            </div>

            <Input
              label="Logo Drive Link *"
              placeholder="https://drive.google.com/file/d/... or Google Drive link"
              value={submission.logoUrl || ''}
              onChange={(e) => handleInputChange('logoUrl', e.target.value)}
              disabled={!isTeamLead || isLocked}
              error={validationErrors.logoUrl}
              helperText="Google Drive public link to square 1:1 logo format"
            />
            <Input
              label="Visiting Card Drive Link *"
              placeholder="https://drive.google.com/file/d/... or Google Drive link"
              value={submission.visitingCardUrl || ''}
              onChange={(e) => handleInputChange('visitingCardUrl', e.target.value)}
              disabled={!isTeamLead || isLocked}
              error={validationErrors.visitingCardUrl}
              helperText="Google Drive public link to digital visiting card asset"
            />

            <Input
              label="Poster / Show Banner Drive Link *"
              placeholder="https://drive.google.com/file/d/... or Google Drive link"
              value={submission.posterUrl || ''}
              onChange={(e) => handleInputChange('posterUrl', e.target.value)}
              disabled={!isTeamLead || isLocked}
              error={validationErrors.posterUrl}
              helperText="Google Drive public link to high-res vertical or landscape banner"
            />
            <Input
              label="LinkedIn Banner Card Drive Link *"
              placeholder="https://drive.google.com/file/d/... or Google Drive link"
              value={submission.linkedinBannerUrl || ''}
              onChange={(e) => handleInputChange('linkedinBannerUrl', e.target.value)}
              disabled={!isTeamLead || isLocked}
              error={validationErrors.linkedinBannerUrl}
              helperText="Google Drive public link to LinkedIn header banner card"
            />

            {/* SECTION 2: PRODUCT */}
            <div className="col-span-1 md:col-span-2 flex items-center gap-2 text-primary pt-4 pb-2 border-b border-border">
              <Globe className="h-5 w-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">2. PRODUCT</h3>
              <span className="text-xs text-foreground-muted font-normal ml-2 hidden sm:inline">
                Public code repository and deployed application
              </span>
            </div>

            <Input
              label="GitHub Repository URL *"
              placeholder="https://github.com/organization/repository"
              value={submission.githubUrl || ''}
              onChange={(e) => handleInputChange('githubUrl', e.target.value)}
              disabled={!isTeamLead || isLocked}
              error={validationErrors.githubUrl}
              helperText="Public repository link"
            />
            <Input
              label="Deployed Website URL *"
              placeholder="https://your-startup.vercel.app"
              value={submission.deployedUrl || ''}
              onChange={(e) => handleInputChange('deployedUrl', e.target.value)}
              disabled={!isTeamLead || isLocked}
              error={validationErrors.deployedUrl}
              helperText="Live accessible website link"
            />

            {/* SECTION 3: MEDIA */}
            <div className="col-span-1 md:col-span-2 flex items-center gap-2 text-primary pt-4 pb-2 border-b border-border">
              <Video className="h-5 w-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">3. MEDIA</h3>
              <span className="text-xs text-foreground-muted font-normal ml-2 hidden sm:inline">
                5-minute pitch video explaining your startup
              </span>
            </div>

            <div className="col-span-1 md:col-span-2">
              <Input
                label="5-Minute Startup Video URL *"
                placeholder="https://youtube.com/watch?v=... or https://loom.com/share/..."
                value={submission.videoUrl || ''}
                onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                disabled={!isTeamLead || isLocked}
                error={validationErrors.videoUrl}
                helperText="YouTube, Loom, or Vimeo video link"
              />
            </div>

            {/* SECTION 4: OPTIONAL */}
            <div className="col-span-1 md:col-span-2 flex items-center gap-2 text-primary pt-4 pb-2 border-b border-border">
              <FileText className="h-5 w-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">4. OPTIONAL</h3>
              <span className="text-xs text-foreground-muted font-normal ml-2 hidden sm:inline">
                Pitch deck presentation and business model notes
              </span>
            </div>

            <Input
              label="Pitch Deck URL (Optional)"
              placeholder="https://slidev.dev/deck.pdf or Google Slides link"
              value={submission.pitchDeckUrl || ''}
              onChange={(e) => handleInputChange('pitchDeckUrl', e.target.value)}
              disabled={!isTeamLead || isLocked}
              helperText="PDF or slide presentation link"
            />

            <div className="w-full">
              <label className="block mb-2 text-xs font-semibold uppercase tracking-wider text-foreground">
                Business Model / Pitch Notes (Optional)
              </label>
              <textarea
                rows={3}
                className="w-full box-border rounded-lg bg-card border border-border p-3.5 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50"
                placeholder="Outline unit economics, pricing strategy, target TAM/SAM, or judge notes..."
                value={submission.businessModel || submission.finalPitchNotes || ''}
                onChange={(e) => {
                  handleInputChange('businessModel', e.target.value);
                  handleInputChange('finalPitchNotes', e.target.value);
                }}
                disabled={!isTeamLead || isLocked}
              />
            </div>
            {/* 5. SUBMISSION ACTIONS */}
            {isTeamLead && !isLocked && (
              <div className="col-span-1 md:col-span-2 pt-6 mt-2 border-t border-border flex flex-col sm:flex-row items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={isSaving || isSubmitting}
                  className="w-full sm:w-auto h-[46px] px-5 rounded-lg bg-card border border-border text-foreground hover:bg-[#1A1A1A] hover:border-[#333333] transition-colors text-sm font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? 'Saving...' : 'Save Submission'}
                </button>
                <button
                  type="button"
                  onClick={handleInitiateFinalSubmit}
                  disabled={isSaving || isSubmitting}
                  className="w-full sm:w-auto h-[46px] px-5 rounded-lg bg-primary border border-primary text-foreground hover:bg-primary-hover transition-colors text-sm font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                  {isSubmitting ? 'Submitting...' : 'Final Submit'}
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Modal before Final Submit */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 text-foreground space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <AlertTriangle className="h-6 w-6 shrink-0" />
              <h3 className="text-lg font-bold">Are you sure you want to submit your startup?</h3>
            </div>
            <p className="text-sm text-foreground-muted leading-relaxed">
              After final submission, you will not be able to edit your submission.
            </p>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmFinalSubmit}
              >
                Final Submit
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Final Submission Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 text-foreground space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-card border border-border text-primary">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Startup Submitted Successfully!</h3>
            <p className="text-sm text-foreground-muted">
              Your startup has been submitted successfully.
            </p>
            <div className="pt-4 border-t border-border">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => setShowSuccessModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default TeamSubmissionPage;
