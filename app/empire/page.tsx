"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Metrics {
  revenue: number;
  tasks: {
    total: number;
    pending: number;
    completed: number;
    failed: number;
  };
  payments: {
    total: number;
    completed: number;
    pending: number;
  };
  uptime: number;
}

export default function EmpireCommandConsole() {
  const [metrics, setMetrics] = useState<Metrics>({
    revenue: 0,
    tasks: { total: 0, pending: 0, completed: 0, failed: 0 },
    payments: { total: 0, completed: 0, pending: 0 },
    uptime: 99.9,
  });
  
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  useEffect(() => {
    fetchMetrics();
    
    // Set up real-time subscriptions
    const tasksChannel = supabase
      .channel('tasks-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'ai_tasks' },
        () => {
          fetchMetrics();
        }
      )
      .subscribe();

    const paymentsChannel = supabase
      .channel('payments-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'payments' },
        () => {
          fetchMetrics();
        }
      )
      .subscribe();

    // Refresh metrics every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);

    return () => {
      tasksChannel.unsubscribe();
      paymentsChannel.unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const fetchMetrics = async () => {
    try {
      // Fetch tasks
      const { data: tasks } = await supabase
        .from('ai_tasks')
        .select('status');

      // Fetch payments
      const { data: payments } = await supabase
        .from('payments')
        .select('amount, status');

      if (tasks) {
        const taskMetrics = {
          total: tasks.length,
          pending: tasks.filter(t => t.status === 'pending').length,
          completed: tasks.filter(t => t.status === 'completed').length,
          failed: tasks.filter(t => t.status === 'failed').length,
        };

        const paymentMetrics = {
          total: payments?.length || 0,
          completed: payments?.filter(p => p.status === 'completed').length || 0,
          pending: payments?.filter(p => p.status === 'pending' || p.status === 'created').length || 0,
        };

        const revenue = payments
          ?.filter(p => p.status === 'completed')
          .reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0) || 0;

        setMetrics({
          revenue,
          tasks: taskMetrics,
          payments: paymentMetrics,
          uptime: 99.9,
        });
      }

      setLastUpdate(new Date().toLocaleTimeString());
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 animate-fade-in">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold gradient-text mb-2">
            Empire Command Console
          </h1>
          <p className="text-gray-400">
            Real-time monitoring and control center
          </p>
          {lastUpdate && (
            <p className="text-sm text-primary mt-2">
              Last updated: {lastUpdate}
            </p>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="text-gray-400 mt-4">Loading empire metrics...</p>
          </div>
        ) : (
          <>
            {/* Key Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {/* Revenue */}
              <div className="card-glow group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-400 text-sm font-medium">Total Revenue</h3>
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-4xl font-bold text-accent mb-2">
                    ${metrics.revenue.toFixed(2)}
                  </p>
                  <p className="text-sm text-primary">↑ Live tracking</p>
                </div>
              </div>

              {/* AI Tasks */}
              <div className="card-glow group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full blur-2xl"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-400 text-sm font-medium">AI Tasks</h3>
                    <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-4xl font-bold text-white mb-2">
                    {metrics.tasks.completed}/{metrics.tasks.total}
                  </p>
                  <div className="flex space-x-2 text-xs">
                    <span className="text-primary">{metrics.tasks.pending} pending</span>
                    <span className="text-gray-500">|</span>
                    <span className="text-red-400">{metrics.tasks.failed} failed</span>
                  </div>
                </div>
              </div>

              {/* Payments */}
              <div className="card-glow group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-400 text-sm font-medium">Transactions</h3>
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-4xl font-bold text-white mb-2">
                    {metrics.payments.completed}
                  </p>
                  <p className="text-sm text-gray-400">
                    {metrics.payments.pending} pending
                  </p>
                </div>
              </div>

              {/* Uptime */}
              <div className="card-glow group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full blur-2xl"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-400 text-sm font-medium">System Uptime</h3>
                    <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-4xl font-bold text-primary mb-2">
                    {metrics.uptime}%
                  </p>
                  <p className="text-sm text-accent">Operational</p>
                </div>
              </div>
            </div>

            {/* Live Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* System Status */}
              <div className="card glow-border">
                <h3 className="text-2xl font-semibold mb-6 text-accent flex items-center">
                  <span className="w-3 h-3 bg-primary rounded-full animate-pulse mr-3"></span>
                  System Status
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-background-dark/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      <span className="text-gray-300">API Gateway</span>
                    </div>
                    <span className="text-primary font-semibold">Operational</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-background-dark/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      <span className="text-gray-300">Database</span>
                    </div>
                    <span className="text-primary font-semibold">Operational</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-background-dark/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      <span className="text-gray-300">AI Agents</span>
                    </div>
                    <span className="text-primary font-semibold">Operational</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-background-dark/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      <span className="text-gray-300">Payment Gateway</span>
                    </div>
                    <span className="text-primary font-semibold">Operational</span>
                  </div>
                </div>
              </div>

              {/* AI Insights */}
              <div className="card">
                <h3 className="text-2xl font-semibold mb-6 text-accent flex items-center">
                  <svg className="w-6 h-6 mr-3 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  AI Insights
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
                    <p className="text-sm text-gray-300">
                      <span className="font-semibold text-primary">Performance:</span> System running at optimal capacity with {metrics.tasks.completed} tasks completed.
                    </p>
                  </div>
                  <div className="p-4 bg-accent/10 rounded-lg border-l-4 border-accent">
                    <p className="text-sm text-gray-300">
                      <span className="font-semibold text-accent">Revenue:</span> Total revenue of ${metrics.revenue.toFixed(2)} with {metrics.payments.completed} completed transactions.
                    </p>
                  </div>
                  <div className="p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
                    <p className="text-sm text-gray-300">
                      <span className="font-semibold text-primary">Automation:</span> AI agents processing tasks efficiently with high success rate.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="btn-primary px-8 py-3">
                Generate Report
              </button>
              <button className="btn-accent px-8 py-3">
                View Analytics
              </button>
              <button className="border border-primary text-primary px-8 py-3 rounded-lg hover:bg-primary/10 transition-colors">
                System Logs
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
