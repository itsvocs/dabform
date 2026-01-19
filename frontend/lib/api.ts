import type { User, Bericht, Patient, TokenResponse } from '@/types';

const API_BASE_URL = '';  // Leer, weil wir schon /api im Pfad haben

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (response.status === 401) {
    throw new Error('Not authenticated');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || 'Request failed');
  }

  return response.json();
}

export const authApi = {
  login: (email: string, password: string) =>
    fetchApi<TokenResponse>('/api/auth/login', {  
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getCurrentUser: () => fetchApi<User>('/api/auth/me'),  
};

export const berichteApi = {
  getAll: () => fetchApi<Bericht[]>('/api/berichte'),  
};

export const patientenApi = {
  getAll: (search?: string) => {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    return fetchApi<Patient[]>(`/api/patienten${params}`); 
  },
};