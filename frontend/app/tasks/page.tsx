"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { supabase } from "@/lib/supabase";

interface Task {
  id: string;
  clone_id: string;
  task_type: string;
  status: string;
  input_data: any;
  output_data: any;
  error_message?: string;
  created_at: string;
  clones?: { name: string };
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [clones, setClones] = useState<any[]>([]);

  useEffect(() => {
    loadTasks();
    loadClones();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('tasks_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ai_tasks' }, () => {
        loadTasks();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadTasks = async () => {
    try {
      const response = await api.getTasks();
      setTasks(response.data || []);
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadClones = async () => {
    try {
      const response = await api.getClones();
      setClones(response.data || []);
    } catch (error) {
      console.error("Error loading clones:", error);
    }
  };

  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      await api.createTask({
        clone_id: formData.get('clone_id'),
        task_type: formData.get('task_type'),
        input_data: JSON.parse((formData.get('input_data') as string) || '{}'),
        status: 'pending',
      });

      setShowCreateModal(false);
      loadTasks();
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-primary';
      case 'running': return 'text-accent';
      case 'failed': return 'text-red-500';
      case 'pending': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'running':
        return (
          <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case 'failed':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">AI Tasks</h1>
          <p className="text-gray-400">Monitor and manage your AI clone tasks</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary"
        >
          <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Task
        </button>
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <p className="text-gray-400 text-sm mb-1">Total Tasks</p>
          <p className="text-3xl font-bold text-white">{tasks.length}</p>
        </div>
        <div className="card">
          <p className="text-gray-400 text-sm mb-1">Running</p>
          <p className="text-3xl font-bold text-accent">{tasks.filter(t => t.status === 'running').length}</p>
        </div>
        <div className="card">
          <p className="text-gray-400 text-sm mb-1">Completed</p>
          <p className="text-3xl font-bold text-primary">{tasks.filter(t => t.status === 'completed').length}</p>
        </div>
        <div className="card">
          <p className="text-gray-400 text-sm mb-1">Failed</p>
          <p className="text-3xl font-bold text-red-500">{tasks.filter(t => t.status === 'failed').length}</p>
        </div>
      </div>

      {/* Tasks List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-400 text-lg">No tasks yet. Create your first AI task!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="card-glow hover:transform hover:scale-[1.01] transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`flex items-center gap-2 ${getStatusColor(task.status)}`}>
                      {getStatusIcon(task.status)}
                      <span className="font-semibold uppercase text-sm">{task.status}</span>
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-400 text-sm">{task.task_type}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Assigned Clone</p>
                      <p className="text-sm text-accent">{task.clones?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Created</p>
                      <p className="text-sm text-gray-300">{new Date(task.created_at).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Task ID</p>
                      <p className="text-sm text-gray-300 font-mono">{task.id.substring(0, 8)}...</p>
                    </div>
                  </div>

                  {task.error_message && (
                    <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm">
                      <strong>Error:</strong> {task.error_message}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <div className="card max-w-md w-full">
            <h2 className="text-2xl font-bold gradient-text mb-4">Create New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Clone</label>
                <select
                  name="clone_id"
                  required
                  className="w-full px-4 py-2 bg-background-dark border border-primary/30 rounded-lg text-white focus:outline-none focus:border-primary"
                >
                  <option value="">Select a clone</option>
                  {clones.map((clone) => (
                    <option key={clone.id} value={clone.id}>{clone.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Task Type</label>
                <input
                  type="text"
                  name="task_type"
                  required
                  placeholder="e.g., data_analysis, content_generation"
                  className="w-full px-4 py-2 bg-background-dark border border-primary/30 rounded-lg text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Input Data (JSON)</label>
                <textarea
                  name="input_data"
                  rows={4}
                  placeholder='{"key": "value"}'
                  className="w-full px-4 py-2 bg-background-dark border border-primary/30 rounded-lg text-white focus:outline-none focus:border-primary font-mono text-sm"
                />
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1">Create Task</button>
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
