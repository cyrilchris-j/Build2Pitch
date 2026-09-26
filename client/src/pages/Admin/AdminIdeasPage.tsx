import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { adminService } from '@/services/api';
import type { StartupIdea } from '@/types';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  X,
  Sparkles,
} from 'lucide-react';

export const AdminIdeasPage: React.FC = () => {
  const [ideas, setIdeas] = useState<StartupIdea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingIdea, setEditingIdea] = useState<StartupIdea | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    industry: '',
    problemStatement: '',
    targetAudience: '',
    keyFeatures: '',
    revenueModel: '',
    complexityLevel: 'intermediate' as 'beginner' | 'intermediate' | 'advanced',
  });

  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      setIsLoading(true);
      const response = await adminService.getIdeas();
      if (response.data?.data) {
        setIdeas(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch ideas:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingIdea(null);
    setFormData({
      title: '',
      industry: '',
      problemStatement: '',
      targetAudience: '',
      keyFeatures: '',
      revenueModel: '',
      complexityLevel: 'intermediate',
    });
    setFormError(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (idea: StartupIdea) => {
    setEditingIdea(idea);
    setFormData({
      title: idea.title || '',
      industry: idea.industry || '',
      problemStatement: idea.problemStatement || '',
      targetAudience: idea.targetAudience || '',
      keyFeatures: Array.isArray(idea.keyFeatures) ? idea.keyFeatures.join(', ') : idea.keyFeatures || '',
      revenueModel: idea.revenueModel || '',
      complexityLevel: idea.complexityLevel || 'intermediate',
    });
    setFormError(null);
    setShowModal(true);
  };

  const handleSaveIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.title || !formData.industry || !formData.problemStatement || !formData.targetAudience || !formData.revenueModel) {
      setFormError('Please fill in all required fields.');
      return;
    }

    const payload = {
      ...formData,
      keyFeatures: formData.keyFeatures.split(',').map((s) => s.trim()).filter(Boolean),
    };

    try {
      if (editingIdea) {
        const id = editingIdea.id || editingIdea._id || '';
        await adminService.updateIdea(id, payload);
      } else {
        await adminService.createIdea(payload);
      }
      setShowModal(false);
      fetchIdeas();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save startup idea.');
    }
  };

  const handleDeleteIdea = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete/deactivate this startup idea?')) return;
    try {
      await adminService.deleteIdea(id);
      fetchIdeas();
    } catch (err) {
      console.error('Failed to delete idea:', err);
    }
  };

  const totalAssigned = ideas.filter((i) => i.isAssigned).length;
  const totalUnused = Math.max(0, ideas.length - totalAssigned);

  return (
    <PageContainer
      title="Startup Idea Repository"
      subtitle="Curated collection of startup problems, industry tracks, and admin assignment controls."
      actions={
        <Button variant="primary" onClick={handleOpenAddModal} className="gap-2">
          <Plus className="h-4 w-4" /> Add Startup Idea
        </Button>
      }
    >
      {/* Summary Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-foreground-muted">TOTAL IDEAS</span>
            <Sparkles className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground font-display">{ideas.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-foreground-muted">ASSIGNED TO TEAMS</span>
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground font-display">{totalAssigned}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-foreground-muted">UNUSED IDEAS</span>
            <Clock className="h-4 w-4 text-foreground-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground font-display">{totalUnused}</div>
          </CardContent>
        </Card>
      </div>

      {/* Ideas Data Table */}
      <Card className="bg-card border-border p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-foreground">
            <thead className="bg-background border-b border-border text-xs font-semibold uppercase tracking-wider text-foreground-muted">
              <tr>
                <th className="py-3.5 px-4">Title</th>
                <th className="py-3.5 px-4">Industry Track</th>
                <th className="py-3.5 px-4">Problem Statement</th>
                <th className="py-3.5 px-4">Target Audience</th>
                <th className="py-3.5 px-4">Revenue Model</th>
                <th className="py-3.5 px-4">Complexity</th>
                <th className="py-3.5 px-4">Assignment Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242424]">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-foreground-muted">
                    Loading startup ideas...
                  </td>
                </tr>
              ) : ideas.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-foreground-muted">
                    No startup ideas found. Click "Add Startup Idea" to create one.
                  </td>
                </tr>
              ) : (
                ideas.map((idea) => {
                  const ideaId = idea.id || idea._id || '';
                  return (
                    <tr key={ideaId} className="hover:bg-[#181818] transition-colors">
                      <td className="py-3.5 px-4 font-bold text-foreground">
                        {idea.title}
                      </td>
                      <td className="py-3.5 px-4 text-foreground-muted font-mono text-xs">
                        {idea.industry}
                      </td>
                      <td className="py-3.5 px-4 text-foreground-muted max-w-xs truncate" title={idea.problemStatement}>
                        {idea.problemStatement}
                      </td>
                      <td className="py-3.5 px-4 text-foreground-muted max-w-xs truncate" title={idea.targetAudience}>
                        {idea.targetAudience}
                      </td>
                      <td className="py-3.5 px-4 text-primary text-xs max-w-xs truncate" title={idea.revenueModel}>
                        {idea.revenueModel || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-xs capitalize text-foreground">
                        {idea.complexityLevel || 'intermediate'}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={idea.isAssigned ? 'accent' : 'muted'}>
                          {idea.isAssigned ? 'ASSIGNED' : 'UNUSED'}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(idea)}
                            className="p-1.5 rounded bg-background border border-border text-foreground-muted hover:text-foreground transition-colors"
                            title="Edit Idea"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteIdea(ideaId)}
                            className="p-1.5 rounded bg-background border border-border text-primary hover:bg-primary/10 transition-colors"
                            title="Delete Idea"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add / Edit Idea Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 text-foreground space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold text-foreground">
                {editingIdea ? 'Edit Startup Idea' : 'Create Startup Idea'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-foreground-muted hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-lg border border-primary bg-card text-primary text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveIdea} className="space-y-4 text-sm">
              <Input
                label="Idea Title *"
                placeholder="e.g. Autonomous Drone Delivery Fleet"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />

              <Input
                label="Industry Track *"
                placeholder="e.g. CleanTech, AI/ML, FinTech, HealthTech"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-foreground-muted">Problem Statement *</label>
                <textarea
                  rows={3}
                  className="w-full rounded-lg bg-card border border-border px-3.5 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary"
                  placeholder="Describe the core market problem..."
                  value={formData.problemStatement}
                  onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
                />
              </div>

              <Input
                label="Target Audience *"
                placeholder="e.g. Enterprise DevOps teams, Gen-Z consumers"
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              />

              <Input
                label="Key Features (Comma Separated)"
                placeholder="e.g. Flight pathing, Obstacle avoidance, Solar dock"
                value={formData.keyFeatures}
                onChange={(e) => setFormData({ ...formData, keyFeatures: e.target.value })}
              />

              <Input
                label="Revenue Model *"
                placeholder="e.g. SaaS subscription, Transaction fee"
                value={formData.revenueModel}
                onChange={(e) => setFormData({ ...formData, revenueModel: e.target.value })}
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-foreground-muted">Complexity Level</label>
                <select
                  value={formData.complexityLevel}
                  onChange={(e: any) => setFormData({ ...formData, complexityLevel: e.target.value })}
                  className="w-full rounded-lg bg-card border border-border px-3.5 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  {editingIdea ? 'Save Changes' : 'Create Idea'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default AdminIdeasPage;
