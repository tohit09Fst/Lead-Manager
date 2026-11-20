const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Fetch all leads with optional search and status filtering
 */
export const getLeads = async (search = '', status = '') => {
  const params = new URLSearchParams();
  if (search.trim()) params.append('search', search.trim());
  if (status && status !== 'All') params.append('status', status);

  const url = `${API_BASE_URL}/leads${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch leads');
  }

  return data.data;
};

/**
 * Fetch a single lead by ID
 */
export const getLeadById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/leads/${id}`);
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
    headers: {
      'Content-Type': 'application/json'
    },
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
    headers: {
      'Content-Type': 'application/json'
    },
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
    method: 'DELETE'
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete lead');
  }

  return data;
};
