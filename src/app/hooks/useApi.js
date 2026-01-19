// hooks/useApi.js

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const useApi = () => {

  const apiFetch = async (url, options = {}) => {
    const accessToken = localStorage.getItem('accessToken');
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(API_URL + url, {
      ...options,
      headers,
      credentials: 'include',
    });

    // Handle token refresh if needed
    if (response.status === 401) {
      // Try to refresh token
      const refreshResponse = await fetch(`${API_URL}/refresh-token`, {
        method: 'POST',
        credentials: 'include',
      });

      if (refreshResponse.ok) {
        const { accessToken: newToken } = await refreshResponse.json();
        localStorage.setItem('accessToken', newToken);
        
        // Retry original request with new token
        headers['Authorization'] = `Bearer ${newToken}`;
        return fetch(API_URL + url, {
          ...options,
          headers,
          credentials: 'include',
        });
      } else {
        // Refresh failed - clear tokens
        localStorage.removeItem('accessToken');
        throw new Error('Session expired. Please log in again.');
      }
    }

    return response;
  };

  return { apiFetch };
};