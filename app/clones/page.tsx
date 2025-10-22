"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Clone {
  id: string;
  name: string;
  description: string;
  model_type: string;
  status: string;
  created_at: string;
  updated_at?: string;
}

export default function ClonesPage() {
  const [clones, setClones] = useState<Clone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClone, setEditingClone] = useState<Clone | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    model_type: "gpt-4",
    status: "active"
  });

  useEffect(() => {
    fetchClones();

    // Subscribe to real-time updates
    const clonesSubscription = supabase
      .channel('clones-channel')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'ai_clones' },
        (payload) => {
          console.log('Clone updated:', payload);
          fetchClones();
        }
      )
      .subscribe();

    return () => {
      clonesSubscription.unsubscribe();
    };
  }, []);

  const fetchClones = async () => {
    try {
      const response = await fetch('/api/clones');
      const data = await response.json();
      
      if (data.success) {
        setClones(data.data);
      }
    } catch (error) {
      console.error('Error fetching clones:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingClone(null);
    setFormData({ name: "", description: "", model_type: "gpt-4", status: "active" });
    setShowModal(true);
  };

  const openEditModal = (clone: Clone) => {
    setEditingClone(clone);
    setFormData({
      name: clone.name,
      description: clone.description,
      model_type: clone.model_type,
      status: clone.status
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      const url = '/api/clones';
      const method = editingClone ? 'PUT' : 'POST';
      const body = editingClone 
        ? { id: editingClone.id, ...formData }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      
      if (data.success) {
        setShowModal(false);
        fetchClones();
      }
    } catch (error) {
      console.error('Error saving clone:', error);
    }
  };

  const deleteClone = async (id: string) => {
    if (!confirm('Are you sure you want to delete this clone?')) return;

    try {
      const response = await fetch(`/api/clones?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchClones();
      }
    } catch (error) {
      console.error('Error deleting clone:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-primary bg-primary/20';
      case 'inactive': return 'text-gray-400 bg-gray-400/20';
      case 'maintenance': return 'text-accent bg-accent/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="min-h-screen py-12 animate-fade-in">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Clone Management</h1>
            <p className="text-gray-400">Manage your AI clones and their configurations</p>
          </div>
          <button onClick={openCreateModal} className="btn-primary mt-4 md:mt-0">
            + Create New Clone
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card-glow">
            <h3 className="text-gray-400 text-sm mb-2">Total Clones</h3>
            <p className="text-3xl font-bold text-accent">{clones.length}</p>
          </div>
          <div className="card-glow">
            <h3 className="text-gray-400 text-sm mb-2">Active</h3>
            <p className="text-3xl font-bold text-primary">
              {clones.filter(c => c.status === 'active').length}
            </p>
          </div>
          <div className="card-glow">
            <h3 className="text-gray-400 text-sm mb-2">Inactive</h3>
            <p className="text-3xl font-bold text-gray-400">
              {clones.filter(c => c.status === 'inactive').length}
            </p>
          </div>
          <div className="card-glow">
            <h3 className="text-gray-400 text-sm mb-2">Maintenance</h3>
            <p className="text-3xl font-bold text-accent">
              {clones.filter(c => c.status === 'maintenance').length}
            </p>
          </div>
        </div>

        {/* Clones Grid */}
        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading clones...</div>
        ) : clones.length === 0 ? (
          <div className="card text-center py-12">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="text-xl text-gray-400 mb-2">No AI Clones Yet</h3>
            <p className="text-gray-500 mb-6">Create your first AI clone to get started</p>
            <button onClick={openCreateModal} className="btn-primary">
              Create Your First Clone
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clones.map((clone) => (
              <div key={clone.id} className="card-glow group">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(clone.status)}`}>
                    {clone.status}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{clone.name}</h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                  {clone.description || 'No description provided'}
                </p>

                <div className="bg-background-dark/50 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Model:</span>
                    <span className="text-accent font-semibold">{clone.model_type}</span>
                  </div>
                </div>

                <div className="text-xs text-gray-500 mb-4">
                  Created: {new Date(clone.created_at).toLocaleDateString()}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(clone)}
                    className="btn-primary flex-1 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteClone(clone.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="card max-w-2xl w-full">
            <h3 className="text-2xl font-bold gradient-text mb-6">
              {editingClone ? 'Edit Clone' : 'Create New Clone'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">Clone Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-futuristic w-full"
                  placeholder="e.g., Marketing AI, Data Analyst"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-futuristic w-full h-24"
                  placeholder="Describe what this AI clone does..."
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Model Type *</label>
                <select
                  value={formData.model_type}
                  onChange={(e) => setFormData({ ...formData, model_type: e.target.value })}
                  className="input-futuristic w-full"
                >
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="claude">Claude</option>
                  <option value="custom">Custom Model</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="input-futuristic w-full"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button onClick={handleSubmit} className="btn-primary flex-1">
                {editingClone ? 'Update Clone' : 'Create Clone'}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="btn-accent flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
