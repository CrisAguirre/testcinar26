const API_URL = 'https://testcinar26bknd.onrender.com/api';

function getToken() {
  return typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
}

export async function api(method, path, data) {
  const token = getToken();
  const options = {
    method,
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
    throw new Error(json.error || 'Error en la solicitud');
  }

  return json;
}

export const authApi = {
  login: (username, password) => api('POST', '/auth/login', { username, password }),
  register: (data) => api('POST', '/auth/register', data),
  profile: () => api('GET', '/auth/profile')
};

export const gradesApi = {
  getAll: (params) => api('GET', `/grades?${new URLSearchParams(params)}`),
  getMine: () => api('GET', '/grades/mine'),
  getById: (id) => api('GET', `/grades/${id}`),
  create: (data) => api('POST', '/grades', data),
  update: (id, data) => api('PUT', `/grades/${id}`, data),
  delete: (id) => api('DELETE', `/grades/${id}`)
};
