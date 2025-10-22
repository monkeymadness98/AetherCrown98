"use client";

import { useState, useEffect } from "react";

interface HealthStatus {
  status: string;
  timestamp: string;
  uptime: number;
  responseTime: string;
  services: {
    api: {
      status: string;
      responseTime: string;
    };
    database: {
      status: string;
      message: string;
    };
  };
  version: string;
  environment: string;
}

interface Log {
  id: string;
  log_type: string;
  entity_id: string;
  action: string;
  details: Record<string, unknown>;
  level: string;
  created_at: string;
}

export default function MonitoringPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [logFilter, setLogFilter] = useState({
    type: "",
    level: ""
  });

  const fetchLogs = async () => {
    try {
      const params = new URLSearchParams();
      if (logFilter.type) params.append('type', logFilter.type);
      if (logFilter.level) params.append('level', logFilter.level);
      params.append('limit', '50');

      const response = await fetch(`/api/logs?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setLogs(data.data);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  useEffect(() => {
    fetchHealth();
    fetchLogs();

    // Refresh health status every 30 seconds
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logFilter]);

  const fetchHealth = async () => {
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      setHealth(data);
    } catch (error) {
      console.error('Error fetching health status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy':
      case 'operational':
        return 'text-primary bg-primary/20';
      case 'degraded':
        return 'text-accent bg-accent/20';
      case 'unhealthy':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'info':
        return 'text-blue-400 bg-blue-400/20';
      case 'warning':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'error':
        return 'text-red-400 bg-red-400/20';
      case 'success':
        return 'text-primary bg-primary/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen py-12 animate-fade-in">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">System Monitoring</h1>
          <p className="text-gray-400">Monitor backend health and activity logs</p>
        </div>

        {/* Health Status */}
        <div className="card-glow mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-accent">System Health</h2>
            <button onClick={fetchHealth} className="btn-accent">
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading health status...</div>
          ) : health ? (
            <div className="space-y-6">
              {/* Overall Status */}
              <div className="flex items-center justify-between p-4 bg-background-dark/50 rounded-lg">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Overall Status</h3>
                  <p className="text-sm text-gray-400">Last checked: {new Date(health.timestamp).toLocaleString()}</p>
                </div>
                <span className={`text-lg px-4 py-2 rounded-full font-semibold ${getStatusColor(health.status)}`}>
                  {health.status.toUpperCase()}
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-background-dark/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Uptime</p>
                  <p className="text-xl font-bold text-primary">{formatUptime(health.uptime)}</p>
                </div>
                <div className="bg-background-dark/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Response Time</p>
                  <p className="text-xl font-bold text-accent">{health.responseTime}</p>
                </div>
                <div className="bg-background-dark/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Version</p>
                  <p className="text-xl font-bold text-white">{health.version}</p>
                </div>
              </div>

              {/* Services Status */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Services</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-background-dark/50 rounded-lg">
                    <div>
                      <p className="font-semibold text-white">API Server</p>
                      <p className="text-sm text-gray-400">Response: {health.services.api.responseTime}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(health.services.api.status)}`}>
                      {health.services.api.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background-dark/50 rounded-lg">
                    <div>
                      <p className="font-semibold text-white">Database</p>
                      <p className="text-sm text-gray-400">{health.services.database.message}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(health.services.database.status)}`}>
                      {health.services.database.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-red-400">Failed to load health status</div>
          )}
        </div>

        {/* Activity Logs */}
        <div className="card">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-2xl font-semibold text-accent">Activity Logs</h2>
            <div className="flex gap-3">
              <select
                value={logFilter.type}
                onChange={(e) => setLogFilter({ ...logFilter, type: e.target.value })}
                className="input-futuristic"
              >
                <option value="">All Types</option>
                <option value="task">Tasks</option>
                <option value="payment">Payments</option>
                <option value="clone">Clones</option>
                <option value="system">System</option>
              </select>
              <select
                value={logFilter.level}
                onChange={(e) => setLogFilter({ ...logFilter, level: e.target.value })}
                className="input-futuristic"
              >
                <option value="">All Levels</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
                <option value="success">Success</option>
              </select>
            </div>
          </div>

          {logs.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No activity logs found</div>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <div key={log.id} className="bg-background-dark/50 p-4 rounded-lg hover:bg-background-dark transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-xs px-3 py-1 rounded-full ${getLevelColor(log.level)}`}>
                          {log.level}
                        </span>
                        <span className="text-xs px-3 py-1 rounded-full bg-gray-400/20 text-gray-400">
                          {log.log_type}
                        </span>
                        <span className="text-sm font-semibold text-white">{log.action}</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">Entity ID: {log.entity_id}</p>
                      {log.details && Object.keys(log.details).length > 0 && (
                        <pre className="text-xs text-gray-400 bg-background rounded p-2 overflow-x-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      {new Date(log.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
