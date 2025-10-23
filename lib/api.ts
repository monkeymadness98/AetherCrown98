/**
 * API client configuration for AetherCrown98
 * Handles communication with FastAPI backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  process.env.NODE_ENV === 'production'
    ? 'https://aethercrown98-backend.onrender.com'
    : 'http://localhost:8000';

export const API_ENDPOINTS = {
  // Health & Monitoring
  health: `${API_BASE_URL}/healthz`,
  metrics: `${API_BASE_URL}/metrics`,
  
  // AI Agents
  aiAgent: `${API_BASE_URL}/ai_agent`,
  
  // Tasks
  tasksAssign: `${API_BASE_URL}/tasks/assign`,
  tasksStatus: (taskId: string) => `${API_BASE_URL}/tasks/status/${taskId}`,
  
  // Payments
  paymentsCreate: `${API_BASE_URL}/payments/create`,
  paymentsWebhook: `${API_BASE_URL}/payments/webhook`,
  
  // Reports
  reportsGenerate: `${API_BASE_URL}/reports/generate`,
};

/**
 * Generic API request function
 */
export async function apiRequest<T>(
  url: string,
  options?: RequestInit
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.detail || 'Request failed',
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check backend health
 */
export async function checkBackendHealth() {
  return apiRequest(API_ENDPOINTS.health);
}

/**
 * Get system metrics
 */
export async function getMetrics() {
  return apiRequest(API_ENDPOINTS.metrics);
}

/**
 * Delegate task to AI agent
 */
export async function delegateToAIAgent(
  agentType: 'marketing' | 'analytics' | 'finance' | 'reports',
  action: string,
  parameters?: Record<string, any>
) {
  return apiRequest(API_ENDPOINTS.aiAgent, {
    method: 'POST',
    body: JSON.stringify({
      agent_type: agentType,
      action,
      parameters: parameters || {},
    }),
  });
}

/**
 * Assign task to AI clone
 */
export async function assignTask(
  cloneId: string,
  taskName: string,
  taskInput?: Record<string, any>,
  priority?: 'low' | 'medium' | 'high'
) {
  return apiRequest(API_ENDPOINTS.tasksAssign, {
    method: 'POST',
    body: JSON.stringify({
      clone_id: cloneId,
      task_name: taskName,
      task_input: taskInput || {},
      priority: priority || 'medium',
    }),
  });
}

/**
 * Get task status
 */
export async function getTaskStatus(taskId: string) {
  return apiRequest(API_ENDPOINTS.tasksStatus(taskId));
}

/**
 * Create payment order
 */
export async function createPayment(
  amount: number,
  currency: string = 'USD',
  description: string = 'AetherCrown98 Payment',
  userId?: string
) {
  return apiRequest(API_ENDPOINTS.paymentsCreate, {
    method: 'POST',
    body: JSON.stringify({
      amount,
      currency,
      description,
      user_id: userId,
    }),
  });
}

/**
 * Generate AI report
 */
export async function generateReport(reportType: string = 'daily_summary') {
  return apiRequest(API_ENDPOINTS.reportsGenerate, {
    method: 'POST',
    body: JSON.stringify({ report_type: reportType }),
  });
}

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  apiRequest,
  checkBackendHealth,
  getMetrics,
  delegateToAIAgent,
  assignTask,
  getTaskStatus,
  createPayment,
  generateReport,
};
