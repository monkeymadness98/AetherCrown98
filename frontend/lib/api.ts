const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const api = {
  // Helper function for making API calls
  async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || 'API request failed');
    }

    return response.json();
  },

  // Clones
  async getClones() {
    return this.request('/api/clones');
  },

  async getClone(id: string) {
    return this.request(`/api/clones/${id}`);
  },

  async createClone(data: any) {
    return this.request('/api/clones', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateClone(id: string, data: any) {
    return this.request(`/api/clones/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteClone(id: string) {
    return this.request(`/api/clones/${id}`, {
      method: 'DELETE',
    });
  },

  // Tasks
  async getTasks() {
    return this.request('/api/tasks');
  },

  async getTask(id: string) {
    return this.request(`/api/tasks/${id}`);
  },

  async createTask(data: any) {
    return this.request('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateTask(id: string, data: any) {
    return this.request(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteTask(id: string) {
    return this.request(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
  },

  // Payments
  async createPaymentOrder(data: { amount: string; currency?: string; description?: string }) {
    return this.request('/api/payment/create-order', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async capturePaymentOrder(orderId: string) {
    return this.request('/api/payment/capture-order', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    });
  },

  async getPayments() {
    return this.request('/api/payments');
  },

  // Logs
  async getLogs(actionType?: string, limit?: number) {
    const params = new URLSearchParams();
    if (actionType) params.append('action_type', actionType);
    if (limit) params.append('limit', limit.toString());
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/api/logs${query}`);
  },

  // Users
  async getUsers() {
    return this.request('/api/users');
  },

  async getUser(id: string) {
    return this.request(`/api/users/${id}`);
  },
};
