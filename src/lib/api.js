export const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'https://testcinar26bknd.onrender.com/api');

// URL del health-check público del backend.
// OJO: en PROD '/api' es el proxy Vercel→Render, así que NO se puede usar
// API_URL.replace('/api','') (da '' = la página misma y el "wake" nunca
// despierta a Render). Siempre se consulta vía proxy: /api/health.
export function getHealthUrl() {
  return `${API_URL}/health`;
}

async function fetchWithTimeout(url, options = {}, ms = 45000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    if (err?.name === 'AbortError') {
      throw new Error('El servidor tardó demasiado (puede estar despertando). Espera unos segundos y reintenta.');
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

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
        const res = await fetchWithTimeout(`${API_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include'
        }, 30000);
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

  const res = await fetchWithTimeout(`${API_URL}${path}`, options);
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

/**
 * Upload a file with metadata. Returns the server response JSON.
 * @param {string} path - API path (e.g. '/grades/mine/upload-dfd')
 * @param {File} file - The file to upload
 * @param {Record<string, string>} fields - Additional form fields
 */
export async function apiUploadFile(path, file, fields = {}, { retry = true } = {}) {
  const token = getToken();
  const formData = new FormData();
  formData.append('file', file);
  for (const [k, v] of Object.entries(fields)) {
    formData.append(k, v);
  }

  const res = await fetchWithTimeout(`${API_URL}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
      // No Content-Type header: browser sets it with boundary for FormData
    },
    body: formData
  }, 120000);
  const json = await res.json();

  if (!res.ok) {
    const authError = res.status === 401 || res.status === 403;
    if (authError && retry && path !== '/auth/refresh') {
      const fresh = await refreshSession();
      if (fresh) {
        return apiUploadFile(path, file, fields, { retry: false });
      }
      notifySessionExpired();
    }
    throw new Error(json.error || 'Error al subir archivo');
  }
  return json;
}

export const adminApi = {
  // Helpers
  getEnrolledStudents: (course) => api('GET', `/admin/enrollments/${course}`),
  
  // F1: Contenido Temático
  createCourseContent: (data) => api('POST', '/admin/course-content', data),
  listCourseContent: (params) => api('GET', `/admin/course-content?${new URLSearchParams(params)}`),
  getCourseContent: (id) => api('GET', `/admin/course-content/${id}`),
  updateCourseContent: (id, data) => api('PUT', `/admin/course-content/${id}`, data),
  updateCourseContentStatus: (id, data) => api('PATCH', `/admin/course-content/${id}/status`, data),
  
  // F2: Disponibilidad Docente
  createAvailability: (data) => api('POST', '/admin/availability', data),
  listAvailability: (params) => api('GET', `/admin/availability?${new URLSearchParams(params)}`),
  updateAvailability: (id, data) => api('PUT', `/admin/availability/${id}`, data),
  updateAvailabilityStatus: (id, data) => api('PATCH', `/admin/availability/${id}/status`, data),

  // F3: Planeador de Clase
  createClassPlan: (data) => api('POST', '/admin/class-plans', data),
  listClassPlans: (params) => api('GET', `/admin/class-plans?${new URLSearchParams(params)}`),
  getClassPlan: (id) => api('GET', `/admin/class-plans/${id}`),
  updateClassPlan: (id, data) => api('PUT', `/admin/class-plans/${id}`, data),
  updateClassPlanStatus: (id, data) => api('PATCH', `/admin/class-plans/${id}/status`, data),

  // F4: Control de Asistencia
  createAttendance: (data) => api('POST', '/admin/attendance', data),
  listAttendance: (params) => api('GET', `/admin/attendance?${new URLSearchParams(params)}`),
  updateAttendance: (id, data) => api('PUT', `/admin/attendance/${id}`, data),
  closeAttendance: (id) => api('PATCH', `/admin/attendance/${id}/close`),

  // F5: Control de Contenidos
  createContentTracking: (data) => api('POST', '/admin/content-tracking', data),
  listContentTracking: (params) => api('GET', `/admin/content-tracking?${new URLSearchParams(params)}`),
  updateContentTracking: (id, data) => api('PUT', `/admin/content-tracking/${id}`, data),
  signContentTracking: (id, data) => api('PATCH', `/admin/content-tracking/${id}/sign`, data),

  // F6: Planilla de Notas
  createGradeSheet: (data) => api('POST', '/admin/grade-sheets', data),
  listGradeSheets: (params) => api('GET', `/admin/grade-sheets?${new URLSearchParams(params)}`),
  updateGradeSheet: (id, data) => api('PUT', `/admin/grade-sheets/${id}`, data),
  signGradeSheet: (id, data) => api('PATCH', `/admin/grade-sheets/${id}/sign`, data)
};
