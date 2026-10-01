const API_BASE_URL = 'http://localhost:5000/api';

// Helper function for sending JSON requests to the backend API
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API request failed [${endpoint}]:`, error);
    throw error;
  }
}

// READ: Fetch list of rentals with optional search and filtering
export async function getRentals(filters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.size && filters.size !== 'ALL') params.append('size', filters.size);
  if (filters.status && filters.status !== 'ALL') params.append('status', filters.status);

  const queryString = params.toString() ? `?${params.toString()}` : '';
  return apiRequest(`/rentals${queryString}`);
}

// READ: Fetch summary metrics for dashboard cards
export async function getRentalStats() {
  return apiRequest('/rentals/stats');
}

// CREATE: Submit a new gown rental record
export async function createRental(rentalData) {
  return apiRequest('/rentals', {
    method: 'POST',
    body: JSON.stringify(rentalData),
  });
}

// UPDATE: Modify an existing gown rental record by ID
export async function updateRental(id, rentalData) {
  return apiRequest(`/rentals/${id}`, {
    method: 'PUT',
    body: JSON.stringify(rentalData),
  });
}

// DELETE: Remove a gown rental record by ID
export async function deleteRental(id) {
  return apiRequest(`/rentals/${id}`, {
    method: 'DELETE',
  });
}

// System health check
export async function checkHealth() {
  return apiRequest('/health');
}
