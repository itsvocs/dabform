// lib/api.ts
import type { 
  User, 
  Bericht, 
  BerichtCreate, 
  BerichtUpdate,
  Patient, 
  PatientCreate,
  TokenResponse 
} from '@/types';

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // Trailing slash für FastAPI
  const normalizedEndpoint = endpoint.endsWith('/') || endpoint.includes('?') 
    ? endpoint 
    : `${endpoint}/`;
  
  const response = await fetch(normalizedEndpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (response.status === 401) {
    throw new Error('Nicht authentifiziert');
  }

  if (!response.ok) {
    let errorMessage = 'Anfrage fehlgeschlagen';
    
    try {
      const errorData = await response.json();
      console.log('API Error Response:', errorData);
      
      if (typeof errorData.detail === 'string') {
        errorMessage = errorData.detail;
      } else if (Array.isArray(errorData.detail)) {
        // FastAPI Validierungsfehler
        errorMessage = errorData.detail
          .map((err: { loc?: (string | number)[]; msg?: string; type?: string }) => {
            const field = err.loc ? err.loc[err.loc.length - 1] : 'Feld';
            return `${field}: ${err.msg || 'Ungültiger Wert'}`;
          })
          .join('\n');
      } else if (errorData.detail && typeof errorData.detail === 'object') {
        errorMessage = JSON.stringify(errorData.detail);
      }
    } catch {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }
    
    throw new Error(errorMessage);
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

  getById: (id: number) => fetchApi<Bericht>(`/api/berichte/${id}`),

  create: (data: BerichtCreate) =>
    fetchApi<Bericht>('/api/berichte', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: number, data: BerichtUpdate) =>
    fetchApi<Bericht>(`/api/berichte/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  abschliessen: (id: number) =>
    fetchApi<Bericht>(`/api/berichte/${id}/abschliessen`, {
      method: 'POST',
    }),

  delete: (id: number) =>
    fetchApi<void>(`/api/berichte/${id}`, {
      method: 'DELETE',
    }),
};

export const patientenApi = {
  getAll: (search?: string) => {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    return fetchApi<Patient[]>(`/api/patienten${params}`);
  },

  getById: (id: number) => fetchApi<Patient>(`/api/patienten/${id}`),

  create: (data: PatientCreate) =>
    fetchApi<Patient>('/api/patienten', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};