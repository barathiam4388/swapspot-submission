const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const request = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

export const apiClient = {
  get: (path, token) =>
    request(path, {
      method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }),
  post: (path, body, token) =>
    request(path, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }),
  put: (path, body, token) =>
    request(path, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }),
  delete: (path, token) =>
    request(path, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
};
