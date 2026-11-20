const getBaseUrl = () => {
  let url = (import.meta.env.VITE_API_URL || '/api').trim();
  url = url.replace(/\/+$/, '');
  if (!url.endsWith('/api') && url.startsWith('http')) {
    url = `${url}/api`;
  }
  return url;
};

export const register = async (name, email, password) => {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });

  const data = await res.json();
  if (!res.ok) {
    const error = new Error(data.message || 'Registration failed');
    error.errors = data.errors;
    throw error;
  }
  return data.data;
};

export const login = async (email, password) => {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (!res.ok) {
    const error = new Error(data.message || 'Login failed');
    error.errors = data.errors;
    throw error;
  }
  return data.data;
};

export const getMe = async (token) => {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to get user profile');
  }
  return data.data;
};
