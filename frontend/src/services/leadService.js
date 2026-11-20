const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('lead_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

/**
 * Fetch all leads with search, status filtering, sorting and pagination
 */
export const getLeads = async ({
  search = '',
  status = '',
  page = 1,
  limit = 10,
  sortBy = 'createdAt',
  sortOrder = 'desc'
} = {}) => {
  const params = new URLSearchParams();
  if (search.trim()) params.append('search', search.trim());
  if (status && status !== 'All') params.append('status', status);
  if (page) params.append('page', page);
  if (limit) params.append('limit', limit);
  if (sortBy) params.append('sortBy', sortBy);
  if (sortOrder) params.append('sortOrder', sortOrder);

  const url = `${API_BASE_URL}/leads?${params.toString()}`;
  const response = await fetch(url, {
    headers: getAuthHeaders()
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || 'Failed to fetch leads');
    error.status = response.status;
    throw error;
  }

  return data;
};

/**
 * Fetch single lead by ID
 */
export const getLeadById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/leads/${id}`, {
    headers: getAuthHeaders()
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch lead');
  }

  return data.data;
};

/**
 * Create a new lead
 */
export const createLead = async (leadData) => {
  const response = await fetch(`${API_BASE_URL}/leads`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(leadData)
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || 'Failed to create lead');
    error.errors = data.errors;
    throw error;
  }

  return data.data;
};

/**
 * Update an existing lead
 */
export const updateLead = async (id, leadData) => {
  const response = await fetch(`${API_BASE_URL}/leads/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(leadData)
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || 'Failed to update lead');
    error.errors = data.errors;
    throw error;
  }

  return data.data;
};

/**
 * Delete a lead by ID
 */
export const deleteLead = async (id) => {
  const response = await fetch(`${API_BASE_URL}/leads/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete lead');
  }

  return data;
};
