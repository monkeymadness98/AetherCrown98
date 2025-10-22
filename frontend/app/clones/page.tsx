"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { supabase } from "@/lib/supabase";

interface Clone {
  id: string;
  name: string;
  type: string;
  capabilities: any;
  status: string;
  created_at: string;
}

export default function ClonesPage() {
  const [clones, setClones] = useState<Clone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadClones();

    // Set up real-time subscription
    const subscription = supabase
      .channel('clones_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clones' }, () => {
        loadClones();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadClones = async () => {
    try {
      const response = await api.getClones();
      setClones(response.data || []);
    } catch (error) {
      console.error("Error loading clones:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClone = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      await api.createClone({
        name: formData.get('name'),
        type: formData.get('type'),
        capabilities: JSON.parse((formData.get('capabilities') as string) || '{}'),
        status: 'active',
      });

      setShowCreateModal(false);
      loadClones();
    } catch (error) {
      console.error("Error creating clone:", error);
      alert("Failed to create clone");
    }
  };

  const handleDeleteClone = async (id: string) => {
    if (!confirm("Are you sure you want to delete this clone?")) return;

    try {
      await api.deleteClone(id);
      loadClones();
    } catch (error) {
      console.error("Error deleting clone:", error);
      alert("Failed to delete clone");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-primary';
      case 'inactive': return 'text-gray-500';
      case 'maintenance': return 'text-accent';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">AI Clones</h1>
          <p className="text-gray-400">Manage your autonomous AI workforce</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary"
        >
          <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Clone
        </button>
      </div>

      {/* Clone Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <p className="text-gray-400 text-sm mb-1">Total Clones</p>
          <p className="text-3xl font-bold text-white">{clones.length}</p>
        </div>
        <div className="card">
          <p className="text-gray-400 text-sm mb-1">Active</p>
          <p className="text-3xl font-bold text-primary">{clones.filter(c => c.status === 'active').length}</p>
        </div>
        <div className="card">
          <p className="text-gray-400 text-sm mb-1">Inactive</p>
          <p className="text-3xl font-bold text-gray-500">{clones.filter(c => c.status === 'inactive').length}</p>
        </div>
      </div>

      {/* Clones Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : clones.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-400 text-lg">No clones yet. Create your first AI clone!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clones.map((clone) => (
            <div key={clone.id} className="card-glow group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{clone.name}</h3>
                  <span className={`text-sm font-semibold uppercase ${getStatusColor(clone.status)}`}>
                    {clone.status}
                  </span>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center group-hover:animate-glow-pulse">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Type</p>
                  <p className="text-sm text-accent">{clone.type}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Created</p>
                  <p className="text-sm text-gray-300">{new Date(clone.created_at).toLocaleDateString()}</p>
                </div>

                {clone.capabilities && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Capabilities</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(clone.capabilities) ? (
                        clone.capabilities.map((cap: string, idx: number) => (
                          <span key={idx} className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                            {cap}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">Custom capabilities defined</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => handleDeleteClone(clone.id)}
                  className="flex-1 px-4 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Clone Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <div className="card max-w-md w-full">
            <h2 className="text-2xl font-bold gradient-text mb-4">Create New Clone</h2>
            <form onSubmit={handleCreateClone} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g., Marketing Bot Alpha"
                  className="w-full px-4 py-2 bg-background-dark border border-primary/30 rounded-lg text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                <select
                  name="type"
                  required
                  className="w-full px-4 py-2 bg-background-dark border border-primary/30 rounded-lg text-white focus:outline-none focus:border-primary"
                >
                  <option value="">Select type</option>
                  <option value="analyst">Analyst</option>
                  <option value="writer">Content Writer</option>
                  <option value="developer">Developer</option>
                  <option value="marketer">Marketer</option>
                  <option value="support">Customer Support</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Capabilities (JSON)</label>
                <textarea
                  name="capabilities"
                  rows={4}
                  placeholder='["data_analysis", "report_generation"]'
                  className="w-full px-4 py-2 bg-background-dark border border-primary/30 rounded-lg text-white focus:outline-none focus:border-primary font-mono text-sm"
                />
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1">Create Clone</button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-accent flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
