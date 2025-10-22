"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Task {
  id: string;
  clone_id: string;
  task_name: string;
  task_input: Record<string, unknown>;
  task_output: Record<string, unknown> | null;
  status: string;
  priority: string;
  created_at: string;
  completed_at?: string;
  error_message?: string;
}

interface Clone {
  id: string;
  name: string;
  model_type: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clones, setClones] = useState<Clone[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClone, setSelectedClone] = useState<string>("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTask, setNewTask] = useState({
    clone_id: "",
    task_name: "",
    task_input: "",
    priority: "medium"
  });

  // Fetch tasks and clones
  useEffect(() => {
    fetchTasks();
    fetchClones();

    // Subscribe to real-time updates
    const tasksSubscription = supabase
      .channel('tasks-channel')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'ai_tasks' },
        (payload) => {
          console.log('Task updated:', payload);
          fetchTasks();
        }
      )
      .subscribe();

    return () => {
      tasksSubscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClone]);

  const fetchTasks = async () => {
    try {
      const url = selectedClone 
        ? `/api/tasks?clone_id=${selectedClone}`
        : '/api/tasks';
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setTasks(data.data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClones = async () => {
    try {
      const response = await fetch('/api/clones');
      const data = await response.json();
      
      if (data.success) {
        setClones(data.data);
      }
    } catch (error) {
      console.error('Error fetching clones:', error);
    }
  };

  const createTask = async () => {
    try {
      let taskInput = {};
      if (newTask.task_input) {
        taskInput = JSON.parse(newTask.task_input);
      }

      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clone_id: newTask.clone_id,
          task_name: newTask.task_name,
          task_input: taskInput,
          priority: newTask.priority
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setShowCreateModal(false);
        setNewTask({ clone_id: "", task_name: "", task_input: "", priority: "medium" });
        fetchTasks();
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const updateTaskStatus = async (taskId: string, status: string) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, status })
      });

      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-primary bg-primary/20';
      case 'in_progress': return 'text-accent bg-accent/20';
      case 'pending': return 'text-gray-400 bg-gray-400/20';
      case 'failed': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-400';
      case 'high': return 'text-accent';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen py-12 animate-fade-in">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">AI Tasks Dashboard</h1>
            <p className="text-gray-400">Monitor and manage AI clone tasks in real-time</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary mt-4 md:mt-0"
          >
            + Create New Task
          </button>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <label className="text-gray-400">Filter by Clone:</label>
            <select
              value={selectedClone}
              onChange={(e) => setSelectedClone(e.target.value)}
              className="input-futuristic"
            >
              <option value="">All Clones</option>
              {clones.map((clone) => (
                <option key={clone.id} value={clone.id}>
                  {clone.name} ({clone.model_type})
                </option>
              ))}
            </select>
            <button onClick={fetchTasks} className="btn-accent">
              Refresh
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card-glow">
            <h3 className="text-gray-400 text-sm mb-2">Total Tasks</h3>
            <p className="text-3xl font-bold text-accent">{tasks.length}</p>
          </div>
          <div className="card-glow">
            <h3 className="text-gray-400 text-sm mb-2">Completed</h3>
            <p className="text-3xl font-bold text-primary">
              {tasks.filter(t => t.status === 'completed').length}
            </p>
          </div>
          <div className="card-glow">
            <h3 className="text-gray-400 text-sm mb-2">In Progress</h3>
            <p className="text-3xl font-bold text-accent">
              {tasks.filter(t => t.status === 'in_progress').length}
            </p>
          </div>
          <div className="card-glow">
            <h3 className="text-gray-400 text-sm mb-2">Failed</h3>
            <p className="text-3xl font-bold text-red-400">
              {tasks.filter(t => t.status === 'failed').length}
            </p>
          </div>
        </div>

        {/* Tasks List */}
        <div className="card">
          <h3 className="text-xl font-semibold mb-6 text-accent">Active Tasks</h3>
          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No tasks found. Create your first task!</div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="bg-background-dark/50 p-6 rounded-lg border border-primary/20 hover:border-primary/50 transition-all">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-white">{task.task_name}</h4>
                        <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                        <span className={`text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                          {task.priority} priority
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">
                        Clone: {clones.find(c => c.id === task.clone_id)?.name || 'Unknown'}
                      </p>
                      
                      {/* Task Input/Output */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Input:</p>
                          <pre className="text-xs text-gray-300 bg-background rounded p-2 overflow-x-auto">
                            {JSON.stringify(task.task_input, null, 2)}
                          </pre>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Output:</p>
                          <pre className="text-xs text-gray-300 bg-background rounded p-2 overflow-x-auto">
                            {task.task_output ? JSON.stringify(task.task_output, null, 2) : 'Pending...'}
                          </pre>
                        </div>
                      </div>

                      {task.error_message && (
                        <div className="mt-3 p-3 bg-red-900/20 border border-red-500/50 rounded text-sm text-red-400">
                          Error: {task.error_message}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                      {task.status === 'pending' && (
                        <button
                          onClick={() => updateTaskStatus(task.id, 'in_progress')}
                          className="btn-accent text-sm px-4 py-2"
                        >
                          Start
                        </button>
                      )}
                      {task.status === 'in_progress' && (
                        <>
                          <button
                            onClick={() => updateTaskStatus(task.id, 'completed')}
                            className="btn-primary text-sm px-4 py-2"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => updateTaskStatus(task.id, 'failed')}
                            className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg"
                          >
                            Fail
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-4">
                    Created: {new Date(task.created_at).toLocaleString()}
                    {task.completed_at && ` | Completed: ${new Date(task.completed_at).toLocaleString()}`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="card max-w-2xl w-full">
            <h3 className="text-2xl font-bold gradient-text mb-6">Create New Task</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">Select Clone</label>
                <select
                  value={newTask.clone_id}
                  onChange={(e) => setNewTask({ ...newTask, clone_id: e.target.value })}
                  className="input-futuristic w-full"
                >
                  <option value="">Select a clone...</option>
                  {clones.map((clone) => (
                    <option key={clone.id} value={clone.id}>
                      {clone.name} ({clone.model_type})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Task Name</label>
                <input
                  type="text"
                  value={newTask.task_name}
                  onChange={(e) => setNewTask({ ...newTask, task_name: e.target.value })}
                  className="input-futuristic w-full"
                  placeholder="e.g., data_analysis, content_generation"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Task Input (JSON)</label>
                <textarea
                  value={newTask.task_input}
                  onChange={(e) => setNewTask({ ...newTask, task_input: e.target.value })}
                  className="input-futuristic w-full h-32"
                  placeholder='{"param1": "value1", "param2": "value2"}'
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Priority</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="input-futuristic w-full"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button onClick={createTask} className="btn-primary flex-1">
                Create Task
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
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
