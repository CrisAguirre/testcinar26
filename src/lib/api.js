export const API_URL = import.meta.env.VITE_API_URL || 'https://testcinar26bknd.onrender.com/api';

// P2: el access token vive solo en memoria (nunca en localStorage) para
// reducir el impacto de un XSS. El refresh viaja en cookie httpOnly.
// `getToken` conserva compatibilidad (memoria primero, legado después).
let accessToken = null;
let refreshInFlight = null;
let sessionExpiredHandler = null;

function readLegacyToken() {
  try {
    return typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
  } catch {
    return null;
  }
}

export function getToken() {
  return accessToken ?? readLegacyToken();
}

export function setAccessToken(token) {
  accessToken = token || null;
}

export function clearAccessToken() {
  accessToken = null;
}

export function onSessionExpired(handler) {
  sessionExpiredHandler = handler;
}

function notifySessionExpired() {
  clearAccessToken();
  try {
    sessionExpiredHandler?.();
  } catch {
    // nunca romper el flujo de la app por el handler
  }
}

async function refreshSession() {
  // Fuera del navegador (SSR) no hay cookies: no intentar.
  if (typeof window === 'undefined' || typeof fetch === 'undefined') return null;
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      try {
        const res = await fetch(`${API_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include'
        });
        if (!res.ok) return null;
        const json = await res.json();
        if (json?.token) {
          setAccessToken(json.token);
          return json.token;
        }
        return null;
      } catch {
        return null;
      } finally {
        refreshInFlight = null;
      }
    })();
  }
  return refreshInFlight;
}

export async function api(method, path, data, { retry = true } = {}) {
  const token = getToken();
  const options = {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const res = await fetch(`${API_URL}${path}`, options);
  const json = await res.json();

  if (!res.ok) {
    // Access expirado o ausente: un intento silencioso de refresh + reintento.
    const authError = res.status === 401 || res.status === 403;
    if (authError && retry && path !== '/auth/refresh') {
      const fresh = await refreshSession();
      if (fresh) {
        return api(method, path, data, { retry: false });
      }
      notifySessionExpired();
    }
    throw new Error(json.error || 'Error en la solicitud');
  }

  return json;
}

export const authApi = {
  login: (username, password) => api('POST', '/auth/login', { username, password }),
  register: (data) => api('POST', '/auth/register', data),
  profile: () => api('GET', '/auth/profile'),
  logout: () =>
    fetch(`${API_URL}/auth/logout`, { method: 'POST', credentials: 'include' }).catch(() => null)
};

export const gradesApi = {
  getAll: (params) => api('GET', `/grades?${new URLSearchParams(params)}`),
  getMine: () => api('GET', '/grades/mine'),
  getById: (id) => api('GET', `/grades/${id}`),
  create: (data) => api('POST', '/grades', data),
  submitMine: (data) => api('POST', '/grades/mine', data),
  updateMine: (id, data) => api('PUT', `/grades/mine/${id}`, data),
  update: (id, data) => api('PUT', `/grades/${id}`, data),
  delete: (id) => api('DELETE', `/grades/${id}`)
};

export const scheduleApi = {
  get: () => api('GET', '/schedule')
};

export const enrollmentApi = {
  getMine: () => api('GET', '/enrollments/mine'),
  enroll: (data) => api('POST', '/enrollments', data),
  getCourseEnrollments: (course) => api('GET', `/enrollments/course/${course}`),
  unenroll: (userId, course) => api('DELETE', `/enrollments/${userId}/${course}`),
  saveProjectIdea: (data) => api('POST', '/enrollments/project-idea', data)
};
