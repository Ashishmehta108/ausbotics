const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Add auth token if available
  const token = localStorage.getItem('accessToken');
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // For cookies
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        error: data.message || 'An error occurred',
        ...data,
      };
    }

    return { data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Network error occurred',
    };
  }
}

// Auth API
export const authApi = {
  async login(credentials: { email: string; password: string }) {
    return fetchApi<{ accessToken: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async signup(userData: { email: string; password: string; fullName: string }) {
    return fetchApi<{ accessToken: string; user: any }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async refreshToken() {
    return fetchApi<{ accessToken: string }>('/auth/refresh-token', {
      method: 'POST',
      credentials: 'include',
    });
  },

  async logout() {
    return fetchApi('/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  },
};

// Workflow API
export const workflowApi = {
  async getAll() {
    return fetchApi<Array<{
      id: string;
      name: string;
      description: string;
      status: string;
      progress: number;
      createdAt: string;
    }>>('/workflows');
  },

  async getById(id: string) {
    return fetchApi<{
      id: string;
      name: string;
      description: string;
      status: string;
      progress: number;
      createdAt: string;
    }>(`/workflows/${id}`);
  },

  async create(workflow: { name: string; description: string }) {
    return fetchApi<{ id: string }>('/workflows', {
      method: 'POST',
      body: JSON.stringify(workflow),
    });
  },

  async update(id: string, updates: Partial<{ status: string; progress: number }>) {
    return fetchApi(`/workflows/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  async delete(id: string) {
    return fetchApi(`/workflows/${id}`, {
      method: 'DELETE',
    });
  },
};

// Appointment API
export const appointmentApi = {
  async getAll() {
    return fetchApi<Array<{
      id: string;
      name: string;
      email: string;
      preferredDate: string;
      preferredTime: string;
      purpose: string;
      status: string;
      createdAt: string;
    }>>('/appointments');
  },

  async book(appointment: {
    name: string;
    email: string;
    preferredDate: string;
    preferredTime: string;
    purpose: string;
  }) {
    return fetchApi<{ id: string }>('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointment),
    });
  },

  async updateStatus(id: string, status: 'Pending' | 'Confirmed' | 'Cancelled') {
    return fetchApi(`/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};

// User API
export const userApi = {
  async getProfile() {
    return fetchApi<{
      id: string;
      email: string;
      fullName: string;
      role: string;
    }>('/users/me');
  },

  async updateProfile(updates: { fullName?: string; email?: string }) {
    return fetchApi('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },
};
