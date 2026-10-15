/**
 * LMONI API Client
 * Configurable base client that communicates with the ASP.NET Core backend when configured via VITE_API_BASE_URL.
 * Seamlessly degrades to authenticated demo simulation when backend is unavailable or unconfigured.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export class ApiError extends Error {
  constructor(message, status = 500, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function request(endpoint, options = {}) {
  // If no backend URL configured, fail gracefully or signal offline mode
  if (!API_BASE_URL) {
    throw new ApiError('No backend API configured (running in client demo mode)', 0);
  }

  const url = `${API_BASE_URL.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...options.headers,
  };

  const token = localStorage.getItem('lmoni_token');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      throw new ApiError(
        data?.message || data?.title || `Request failed with status ${response.status}`,
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error.message || 'Network connection failed. Please check your internet connection.',
      0
    );
  }
}

export const isLiveBackendConfigured = Boolean(API_BASE_URL);
