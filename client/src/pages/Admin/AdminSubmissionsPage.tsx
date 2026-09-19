import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { adminService } from '@/services/api';
import type { Submission } from '@/types';
import {
  FileText,
  Search,
  Github,
  Globe,
  Video,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
} from 'lucide-react';

interface SubmissionItem extends Partial<Submission> {
  teamName?: string;
  teamCode?: string;
}

export const AdminSubmissionsPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedSub, setSelectedSub] = useState<SubmissionItem | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, [page]);

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchSubmissions();
  };

  return (
    <PageContainer
      title="Submissions &amp; Pitch Assets Pipeline"
      subtitle="Inspect submitted startup logos, visiting cards, banners, GitHub repos, live demos, and 5-min videos."
    >
      {/* Search Header */}
      <Card className="bg-[#111111] border-[#242424] p-4 mb-6">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A8A8A]" />
            <input
              type="text"
              placeholder="Search Team Name, Startup, or Repo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg bg-[#070707] border border-[#242424] pl-9 pr-3 py-2 text-sm text-[#FFFFFF] placeholder:text-[#8A8A8A] focus:outline-none focus:border-[#E63946]"
            />
          </div>
          <Button type="submit" variant="primary" size="sm">
            Search Pipeline
          </Button>
        </form>
      </Card>

      {/* Submissions Table */}
      <Card className="bg-[#111111] border-[#242424] p-0 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#FFFFFF]">
            <thead className="bg-[#070707] border-b border-[#242424] text-xs font-semibold uppercase tracking-wider text-[#8A8A8A]">
              <tr>
                <th className="py-3.5 px-4">Team Name</th>
                <th className="py-3.5 px-4">Startup Name</th>
                <th className="py-3.5 px-4">GitHub Repo</th>
                <th className="py-3.5 px-4">Live Website</th>
                <th className="py-3.5 px-4">5-Min Video</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Submitted Time</th>
                <th className="py-3.5 px-4 text-right">View All</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242424]">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-[#8A8A8A]">
                    Loading submissions pipeline...
                  </td>
                </tr>
              ) : submissions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-[#8A8A8A]">
                    No submission records found.
                  </td>
                </tr>
              ) : (
                submissions.map((sub) => (
                  <tr key={sub.id || sub.teamId} className="hover:bg-[#181818] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#FFFFFF]">
                      {sub.teamName}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#FFFFFF]">
                      {sub.startupName || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs">
                      {sub.githubUrl ? (
                        <a
                          href={sub.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#E63946] hover:underline flex items-center gap-1"
                        >
                          <Github className="h-3.5 w-3.5" /> Repository
                        </a>
                      ) : (
                        <span className="text-[#8A8A8A]">N/A</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs">
                      {sub.deployedUrl ? (
                        <a
                          href={sub.deployedUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#E63946] hover:underline flex items-center gap-1"
                        >
                          <Globe className="h-3.5 w-3.5" /> Deployed Site
                        </a>
                      ) : (
                        <span className="text-[#8A8A8A]">N/A</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs">
                      {sub.videoUrl ? (
                        <a
                          href={sub.videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#E63946] hover:underline flex items-center gap-1"
                        >
                          <Video className="h-3.5 w-3.5" /> Pitch Video
                        </a>
                      ) : (
                        <span className="text-[#8A8A8A]">N/A</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="accent">
                        {sub.submissionStatus || (sub.isFinal ? 'LOCKED' : 'IN_PROGRESS')}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono text-[#8A8A8A]">
                      {sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedSub(sub)}
                        className="gap-1 px-2.5 py-1"
                      >
                        <Eye className="h-3.5 w-3.5 text-[#E63946]" /> Inspect
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs text-[#8A8A8A]">
          Page <span className="font-bold text-[#FFFFFF]">{page}</span> of{' '}
          <span className="font-bold text-[#FFFFFF]">{totalPages}</span> ({totalRecords} Total Submissions)
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="gap-1"
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Admin Deliverable Detail Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070707]/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-xl border border-[#242424] bg-[#111111] p-6 text-[#FFFFFF] space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-[#242424] pb-4">
              <div>
                <h3 className="text-xl font-bold text-[#FFFFFF]">
                  {selectedSub.teamName} — Deliverable Inspection
                </h3>
                <p className="text-xs text-[#8A8A8A]">Startup: {selectedSub.startupName || 'N/A'}</p>
              </div>
              <button
                onClick={() => setSelectedSub(null)}
                className="p-1 text-[#8A8A8A] hover:text-[#FFFFFF]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-[#070707] border border-[#242424] space-y-1">
                <span className="font-bold text-[#8A8A8A] block">1. Logo Asset</span>
                {selectedSub.logoUrl ? (
                  <a href={selectedSub.logoUrl} target="_blank" rel="noreferrer" className="text-[#E63946] hover:underline flex items-center gap-1 break-all">
                    <ImageIcon className="h-3.5 w-3.5 shrink-0" /> {selectedSub.logoUrl}
                  </a>
                ) : <span className="text-[#8A8A8A]">Not Provided</span>}
              </div>

              <div className="p-3 rounded-lg bg-[#070707] border border-[#242424] space-y-1">
                <span className="font-bold text-[#8A8A8A] block">2. Visiting Card</span>
                {selectedSub.visitingCardUrl ? (
                  <a href={selectedSub.visitingCardUrl} target="_blank" rel="noreferrer" className="text-[#E63946] hover:underline flex items-center gap-1 break-all">
                    <ImageIcon className="h-3.5 w-3.5 shrink-0" /> {selectedSub.visitingCardUrl}
                  </a>
                ) : <span className="text-[#8A8A8A]">Not Provided</span>}
              </div>

              <div className="p-3 rounded-lg bg-[#070707] border border-[#242424] space-y-1">
                <span className="font-bold text-[#8A8A8A] block">3. Poster / Show Banner</span>
                {selectedSub.posterUrl ? (
                  <a href={selectedSub.posterUrl} target="_blank" rel="noreferrer" className="text-[#E63946] hover:underline flex items-center gap-1 break-all">
                    <ImageIcon className="h-3.5 w-3.5 shrink-0" /> {selectedSub.posterUrl}
                  </a>
                ) : <span className="text-[#8A8A8A]">Not Provided</span>}
              </div>

              <div className="p-3 rounded-lg bg-[#070707] border border-[#242424] space-y-1">
                <span className="font-bold text-[#8A8A8A] block">4. LinkedIn Banner</span>
                {selectedSub.linkedinBannerUrl ? (
                  <a href={selectedSub.linkedinBannerUrl} target="_blank" rel="noreferrer" className="text-[#E63946] hover:underline flex items-center gap-1 break-all">
                    <ImageIcon className="h-3.5 w-3.5 shrink-0" /> {selectedSub.linkedinBannerUrl}
                  </a>
                ) : <span className="text-[#8A8A8A]">Not Provided</span>}
              </div>

              <div className="p-3 rounded-lg bg-[#070707] border border-[#242424] space-y-1">
                <span className="font-bold text-[#8A8A8A] block">5. GitHub Repository</span>
                {selectedSub.githubUrl ? (
                  <a href={selectedSub.githubUrl} target="_blank" rel="noreferrer" className="text-[#E63946] hover:underline flex items-center gap-1 break-all">
                    <Github className="h-3.5 w-3.5 shrink-0" /> {selectedSub.githubUrl}
                  </a>
                ) : <span className="text-[#8A8A8A]">Not Provided</span>}
              </div>

              <div className="p-3 rounded-lg bg-[#070707] border border-[#242424] space-y-1">
                <span className="font-bold text-[#8A8A8A] block">6. Deployed Website</span>
                {selectedSub.deployedUrl ? (
                  <a href={selectedSub.deployedUrl} target="_blank" rel="noreferrer" className="text-[#E63946] hover:underline flex items-center gap-1 break-all">
                    <Globe className="h-3.5 w-3.5 shrink-0" /> {selectedSub.deployedUrl}
                  </a>
                ) : <span className="text-[#8A8A8A]">Not Provided</span>}
              </div>

              <div className="p-3 rounded-lg bg-[#070707] border border-[#242424] space-y-1 md:col-span-2">
                <span className="font-bold text-[#8A8A8A] block">7. 5-Minute Pitch Video</span>
                {selectedSub.videoUrl ? (
                  <a href={selectedSub.videoUrl} target="_blank" rel="noreferrer" className="text-[#E63946] hover:underline flex items-center gap-1 break-all">
                    <Video className="h-3.5 w-3.5 shrink-0" /> {selectedSub.videoUrl}
                  </a>
                ) : <span className="text-[#8A8A8A]">Not Provided</span>}
              </div>

              {selectedSub.pitchDeckUrl && (
                <div className="p-3 rounded-lg bg-[#070707] border border-[#242424] space-y-1 md:col-span-2">
                  <span className="font-bold text-[#8A8A8A] block">Pitch Deck Slides (Optional)</span>
                  <a href={selectedSub.pitchDeckUrl} target="_blank" rel="noreferrer" className="text-[#E63946] hover:underline flex items-center gap-1 break-all">
                    <FileText className="h-3.5 w-3.5 shrink-0" /> {selectedSub.pitchDeckUrl}
                  </a>
                </div>
              )}

              {(selectedSub.businessModel || selectedSub.finalPitchNotes) && (
                <div className="p-3 rounded-lg bg-[#070707] border border-[#242424] space-y-1 md:col-span-2">
                  <span className="font-bold text-[#8A8A8A] block">Business Model / Pitch Notes</span>
                  <p className="text-[#FFFFFF] whitespace-pre-wrap">{selectedSub.businessModel || selectedSub.finalPitchNotes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-[#242424]">
              <Button variant="outline" onClick={() => setSelectedSub(null)}>
                Close Inspector
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default AdminSubmissionsPage;
