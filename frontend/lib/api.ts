import type {
  User,
  Bericht,
  BerichtCreate,
  BerichtUpdate,
  Patient,
  PatientCreate,
  Krankenkasse,
  KrankenkasseCreate,
  Unfallbetrieb,
  UnfallbetriebCreate,
  UVTraeger,
  UVTraegerCreate,
  TokenResponse,
} from "@/types";

// ===== BASE FETCH FUNCTION =====
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  // Trailing slash für FastAPI
  const normalizedEndpoint =
    endpoint.endsWith("/") || endpoint.includes("?")
      ? endpoint
      : `${endpoint}/`;

  const response = await fetch(normalizedEndpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include", // Wichtig für Cookies
  });

  if (response.status === 401) {
    throw new Error("Nicht authentifiziert");
  }

  if (response.status === 204) {
    return null as T;
  }

  if (!response.ok) {
    let errorMessage = "Anfrage fehlgeschlagen";

    try {
      const errorData = await response.json();
      console.log("API Error Response:", errorData);

      if (typeof errorData.detail === "string") {
        errorMessage = errorData.detail;
      } else if (Array.isArray(errorData.detail)) {
        // FastAPI Validierungsfehler
        errorMessage = errorData.detail
          .map(
            (err: {
              loc?: (string | number)[];
              msg?: string;
              type?: string;
            }) => {
              const field = err.loc ? err.loc[err.loc.length - 1] : "Feld";
              return `${field}: ${err.msg || "Ungültiger Wert"}`;
            },
          )
          .join("\n");
      } else if (errorData.detail && typeof errorData.detail === "object") {
        errorMessage = JSON.stringify(errorData.detail);
      }
    } catch {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }

    throw new Error(errorMessage);
  }

  return response.json();
}

// ===== AUTH API =====
export const authApi = {
  login: (email: string, password: string) =>
    fetchApi<TokenResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  getCurrentUser: () => fetchApi<User>("/api/auth/me"),
};

// ===== BERICHTE API =====
export const berichteApi = {
  getAll: () => fetchApi<Bericht[]>("/api/berichte"),

  getById: (id: number) => fetchApi<Bericht>(`/api/berichte/${id}`),

  create: (data: BerichtCreate) =>
    fetchApi<Bericht>("/api/berichte", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: BerichtUpdate) =>
    fetchApi<Bericht>(`/api/berichte/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  abschliessen: (id: number) =>
    fetchApi<Bericht>(`/api/berichte/${id}/abschliessen`, {
      method: "POST",
    }),

  delete: (id: number) =>
    fetchApi<void>(`/api/berichte/${id}`, {
      method: "DELETE",
    }),
};

// ===== PATIENTEN API =====
export const patientenApi = {
  getAll: (search?: string) => {
    const params = search ? `?search=${encodeURIComponent(search)}` : "";
    return fetchApi<Patient[]>(`/api/patienten${params}`);
  },

  getById: (id: number) => fetchApi<Patient>(`/api/patienten/${id}`),

  create: (data: PatientCreate) =>
    fetchApi<Patient>("/api/patienten", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: Partial<PatientCreate>) =>
    fetchApi<Patient>(`/api/patienten/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  search: (query: string) => {
    if (!query || query.length < 2) return Promise.resolve([]);
    return fetchApi<Patient[]>(
      `/api/patienten?search=${encodeURIComponent(query)}`,
    );
  },
};

// ===== KRANKENKASSEN API =====
export const krankenkassenApi = {
  getAll: (search?: string) => {
    const params = search ? `?search=${encodeURIComponent(search)}` : "";
    return fetchApi<Krankenkasse[]>(`/api/krankenkassen${params}`);
  },

  getById: (id: number) => fetchApi<Krankenkasse>(`/api/krankenkassen/${id}`),

  create: (data: KrankenkasseCreate) =>
    fetchApi<Krankenkasse>("/api/krankenkassen", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  search: (query: string) => {
    if (!query || query.length < 2) return Promise.resolve([]);
    return fetchApi<Krankenkasse[]>(
      `/api/krankenkassen?search=${encodeURIComponent(query)}`,
    );
  },
};

// ===== UNFALLBETRIEBE API =====
export const unfallbetriebeApi = {
  getAll: (search?: string) => {
    const params = search ? `?search=${encodeURIComponent(search)}` : "";
    return fetchApi<Unfallbetrieb[]>(`/api/unfallbetriebe${params}`);
  },

  getById: (id: number) => fetchApi<Unfallbetrieb>(`/api/unfallbetriebe/${id}`),

  create: (data: UnfallbetriebCreate) =>
    fetchApi<Unfallbetrieb>("/api/unfallbetriebe", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  search: (query: string) => {
    if (!query || query.length < 2) return Promise.resolve([]);
    return fetchApi<Unfallbetrieb[]>(
      `/api/unfallbetriebe?search=${encodeURIComponent(query)}`,
    );
  },
};

// ===== UV-TRÄGER API =====
export const uvTraegerApi = {
  getAll: (search?: string) => {
    const params = search ? `?search=${encodeURIComponent(search)}` : "";
    return fetchApi<UVTraeger[]>(`/api/uv-traeger${params}`);
  },

  getById: (id: number) => fetchApi<UVTraeger>(`/api/uv-traeger/${id}`),

  create: (data: UVTraegerCreate) =>
    fetchApi<UVTraeger>("/api/uv-traeger", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  search: (query: string) => {
    if (!query || query.length < 2) return Promise.resolve([]);
    return fetchApi<UVTraeger[]>(
      `/api/uv-traeger?search=${encodeURIComponent(query)}`,
    );
  },
};

export async function searchICD(query: string) {
  const res = await fetch(`/api/icd/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("ICD Suche fehlgeschlagen");
  return res.json() as Promise<{ code: string; title: string }[]>;
}

// ===== PDF API =====
export const pdfApi = {
  downloadUvTraeger: async (berichtId: number): Promise<Blob> => {
    const response = await fetch(`/api/berichte/${berichtId}/pdf?typ=uv`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("PDF-Generierung fehlgeschlagen");
    }
    return response.blob();
  },

  downloadKrankenkasse: async (berichtId: number): Promise<Blob> => {
    const response = await fetch(`/api/berichte/${berichtId}/pdf?typ=kk`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("PDF-Generierung fehlgeschlagen");
    }
    return response.blob();
  },

  getPreviewUrl: (berichtId: number, typ: "uv" | "kk" = "uv"): string => {
    return `/api/berichte/${berichtId}/pdf/preview?typ=${typ}`;
  },

  downloadAndSave: async (
    berichtId: number,
    typ: "uv" | "kk" = "uv",
    filename?: string,
  ) => {
    const response = await fetch(`/api/berichte/${berichtId}/pdf?typ=${typ}`, {
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("PDF Error:", response.status, errorText);
      throw new Error(`PDF-Generierung fehlgeschlagen: ${response.status}`);
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    if (!filename) {
      const contentDisposition = response.headers.get("Content-Disposition");
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) {
          filename = match[1];
        }
      }
    }

    a.download = filename || "durchgangsarztbericht.pdf";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
};
