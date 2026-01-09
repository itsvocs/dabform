/**
 * API Client mit Native Fetch für Next.js 16
 */

import type { User, Bericht, Patient, TokenResponse } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Zentrale Fetch-Funktion mit Auth & Error Handling
 */
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (response.status === 401 && typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    window.location.href = "/";
  }

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: "Unknown error" }));
    throw new Error(
      error.detail || `Request failed with status ${response.status}`
    );
  }

  return response.json();
}

/**
 * Auth API
 */
export const authApi = {
  login: (email: string, password: string) =>
    fetchApi<TokenResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  getCurrentUser: () => fetchApi<User>("/api/auth/me"),
};

/**
 * Berichte API
 */
export const berichteApi = {
  getAll: () => fetchApi<Bericht[]>("/api/berichte"),

  getById: (id: number) => fetchApi<Bericht>(`/api/berichte/${id}`),

  create: (data: Partial<Bericht>) =>
    fetchApi<Bericht>("/api/berichte", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: Partial<Bericht>) =>
    fetchApi<Bericht>(`/api/berichte/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

/**
 * Patienten API
 */
export const patientenApi = {
  getAll: (search?: string) => {
    const params = search ? `?search=${encodeURIComponent(search)}` : "";
    return fetchApi<Patient[]>(`/api/patienten${params}`);
  },

  create: (data: Partial<Patient>) =>
    fetchApi<Patient>("/api/patienten", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
