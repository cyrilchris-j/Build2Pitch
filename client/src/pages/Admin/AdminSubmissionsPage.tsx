import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { adminService } from '@/services/api';
import type { Submission } from '@/types';
import {
  FileText, Search, Github, Globe, Video,
  Image as ImageIcon, ChevronLeft, ChevronRight,
  Eye, X, Download, ExternalLink, Loader2,
  CheckCircle2, Package,
} from 'lucide-react';

interface SubmissionItem extends Partial<Submission> {
  teamName?: string;
  teamCode?: string;
}

interface DeliverableItem {
  key: string;
  label: string;
  url: string | undefined;
  icon: React.ElementType;
  isLink?: boolean; // links open in new tab, files download
}

function getDeliverables(sub: SubmissionItem): DeliverableItem[] {
  return [
    { key: 'logo', label: 'Logo Asset', url: sub.logoUrl, icon: ImageIcon },
    { key: 'card', label: 'Visiting Card', url: sub.visitingCardUrl, icon: ImageIcon },
    { key: 'poster', label: 'Poster / Banner', url: sub.posterUrl, icon: ImageIcon },
    { key: 'linkedin', label: 'LinkedIn Banner', url: sub.linkedinBannerUrl, icon: ImageIcon },
    { key: 'github', label: 'GitHub Repo', url: sub.githubUrl, icon: Github, isLink: true },
    { key: 'deploy', label: 'Live Website', url: sub.deployedUrl, icon: Globe, isLink: true },
    { key: 'video', label: '5-Min Pitch Video', url: sub.videoUrl, icon: Video, isLink: true },
    { key: 'deck', label: 'Pitch Deck', url: sub.pitchDeckUrl, icon: FileText },
  ].filter((d) => d.url);
}

function downloadFile(url: string, label: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = label.replace(/\s+/g, '_').toLowerCase();
  a.target = '_blank';
  a.rel = 'noreferrer';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

const DeliverableCard: React.FC<{ item: DeliverableItem }> = ({ item }) => {
  const Icon = item.icon;
  if (!item.url) return null;

  const handleDownload = () => {
    if (item.isLink) {
      window.open(item.url, '_blank', 'noreferrer');
    } else {
      downloadFile(item.url!, item.label);
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border bg-background hover:border-primary/30 transition-all group">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-foreground">{item.label}</p>
          <p className="text-[10px] text-foreground-subtle font-mono truncate max-w-[180px]">{item.url}</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Open in new tab */}
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="p-1.5 rounded-lg text-foreground-subtle hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all"
          title="Open link"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
        {/* Download */}
        <button
          onClick={handleDownload}
          className="p-1.5 rounded-lg text-foreground-subtle hover:text-success hover:bg-success/10 border border-transparent hover:border-success/20 transition-all"
          title={item.isLink ? 'Open' : 'Download'}
        >
          <Download className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export const AdminSubmissionsPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedSub, setSelectedSub] = useState<SubmissionItem | null>(null);

  useEffect(() => { fetchSubmissions(); }, [page]);

  const fetchSubmissions = async () => {
    try {
      setIsLoading(true);
      const response = await adminService.getSubmissions({ page, limit: 10, search });
      if (response.data?.data) {
        setSubmissions(response.data.data);
        if (response.data.meta) {
          setTotalPages(response.data.meta.totalPages || 1);
          setTotalRecords(response.data.meta.total || response.data.data.length);
        }
      }
    } catch (err) {
      console.error('Failed to fetch submissions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadAllForTeam = (sub: SubmissionItem) => {
    const deliverables = getDeliverables(sub);
    deliverables.forEach((d, i) => {
      if (d.url && !d.isLink) {
        setTimeout(() => downloadFile(d.url!, d.label), i * 400);
      }
    });
  };

  return (
    <PageContainer
      title="Submissions Pipeline"
      subtitle="Inspect and download each team's submitted startup assets — logos, cards, banners, repos, live sites, and pitch videos."
    >
      {/* Search */}
      <Card className="bg-card border-border p-4 mb-6">
        <form onSubmit={(e) => { e.preventDefault(); setPage(1); fetchSubmissions(); }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
            <input type="text" placeholder="Search Team Name, Startup, or Repo..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl bg-background border border-border pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary" />
          </div>
          <Button type="submit" variant="primary" size="sm">Search Pipeline</Button>
        </form>
      </Card>

      {/* Submissions Table */}
      <Card className="bg-card border-border p-0 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-foreground">
            <thead className="bg-background border-b border-border text-xs font-semibold uppercase tracking-wider text-foreground-muted">
              <tr>
                <th className="py-3.5 px-4">Team</th>
                <th className="py-3.5 px-4">Startup Name</th>
                <th className="py-3.5 px-4">Deliverables</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Submitted</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={6} className="text-center py-12 text-foreground-muted">
                  <Loader2 className="h-6 w-6 animate-spin inline-block text-primary" />
                </td></tr>
              ) : submissions.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-foreground-muted">No submission records found.</td></tr>
              ) : (
                submissions.map((sub) => {
                  const deliverables = getDeliverables(sub);
                  const filled = deliverables.length;
                  return (
                    <tr key={sub.id || sub.teamId} className="hover:bg-card-hover transition-colors">
                      <td className="py-3.5 px-4 font-bold">{sub.teamName}</td>
                      <td className="py-3.5 px-4 font-medium text-foreground-muted">{sub.startupName || 'N/A'}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <Package className="h-3.5 w-3.5 text-primary" />
                          <span className="text-xs font-semibold">{filled}</span>
                          <span className="text-xs text-foreground-subtle">/ 8 files</span>
                          {filled >= 7 && <CheckCircle2 className="h-3.5 w-3.5 text-success ml-1" />}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={sub.isFinal ? 'success' : 'accent'}>
                          {sub.submissionStatus || (sub.isFinal ? 'LOCKED' : 'IN_PROGRESS')}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono text-foreground-muted">
                        {sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : 'N/A'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button variant="outline" size="sm" onClick={() => setSelectedSub(sub)} className="gap-1 px-2.5 py-1">
                          <Eye className="h-3.5 w-3.5 text-primary" /> Inspect
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs text-foreground-muted">
          Page <span className="font-bold text-foreground">{page}</span> of{' '}
          <span className="font-bold text-foreground">{totalPages}</span> ({totalRecords} total)
        </span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="gap-1">
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="gap-1">
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* ── Document Inspect & Download Modal ── */}
      {selectedSub && (() => {
        const deliverables = getDeliverables(selectedSub);
        const downloadableFiles = deliverables.filter((d) => !d.isLink);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 space-y-5 my-8 shadow-2xl">
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-border pb-4">
                <div>
                  <h3 className="text-lg font-extrabold text-foreground">
                    {selectedSub.teamName} — Documents
                  </h3>
                  <p className="text-xs text-foreground-muted mt-0.5">
                    Startup: <span className="font-semibold text-foreground">{selectedSub.startupName || 'N/A'}</span>
                    &nbsp;·&nbsp;{deliverables.length} deliverable{deliverables.length !== 1 ? 's' : ''} submitted
                  </p>
                </div>
                <button onClick={() => setSelectedSub(null)} className="p-1.5 rounded-lg text-foreground-subtle hover:text-foreground hover:bg-card-hover transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Download All button (for file-type deliverables) */}
              {downloadableFiles.length > 0 && (
                <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-primary/5 border border-primary/15">
                  <div>
                    <p className="text-xs font-bold text-foreground">Batch Download</p>
                    <p className="text-[10px] text-foreground-subtle">{downloadableFiles.length} downloadable file{downloadableFiles.length !== 1 ? 's' : ''} (logos, cards, banners, deck)</p>
                  </div>
                  <button
                    onClick={() => downloadAllForTeam(selectedSub)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-primary text-background hover:bg-primary-hover transition-all shadow-glow-sm"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download All Files
                  </button>
                </div>
              )}

              {/* Individual Deliverables */}
              {deliverables.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-wider text-foreground-subtle font-semibold mb-3">
                    Individual Downloads / Links
                  </p>
                  {deliverables.map((item) => (
                    <DeliverableCard key={item.key} item={item} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-foreground-subtle text-sm">
                  No deliverables submitted yet.
                </div>
              )}

              {/* Business Model Notes */}
              {(selectedSub.businessModel || selectedSub.finalPitchNotes) && (
                <div className="p-4 rounded-xl border border-border bg-background space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-foreground-subtle font-semibold">
                    Business Model / Pitch Notes
                  </p>
                  <p className="text-xs text-foreground whitespace-pre-wrap">
                    {selectedSub.businessModel || selectedSub.finalPitchNotes}
                  </p>
                </div>
              )}

              <div className="flex justify-end pt-2 border-t border-border">
                <Button variant="outline" onClick={() => setSelectedSub(null)}>Close</Button>
              </div>
            </div>
          </div>
        );
      })()}
    </PageContainer>
  );
};

export default AdminSubmissionsPage;
