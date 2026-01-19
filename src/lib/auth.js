const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Global variables for token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Helper function for fetch requests
const fetchWithAuth = async (url, options = {}) => {
  const accessToken = localStorage.getItem("accessToken");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: "include", // This sends cookies (refresh token)
  });
};

// In your handleUnauthorized function in auth.js
const handleUnauthorized = async (response, url, options) => {
  if (response.status === 401 && !options._retry) {
    if (isRefreshing) {
      // If already refreshing, add to queue
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => {
          return fetchWithAuthRetry(url, { ...options, _retry: true });
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    isRefreshing = true;
    options._retry = true;

    try {
      const refreshResponse = await fetch(`${API_URL}/refresh-token`, {
        method: "POST",
        credentials: "include",
      });

      if (refreshResponse.status === 401) {
        // Trigger session expiry globally
        if (typeof window !== "undefined" && window.handleSessionExpired) {
          window.handleSessionExpired();
        }
        // throw new Error("SESSION_EXPIRED");
      }

      if (!refreshResponse.ok) {
        // throw new Error("Token refresh failed");
        return;
      }

      const refreshData = await refreshResponse.json();
      const { accessToken, user } = refreshData;

      localStorage.setItem("accessToken", accessToken);

      if (window.updateAuthState) {
        window.updateAuthState(user);
      }

      processQueue(null, accessToken);

      const retryOptions = {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      };
      return fetch(url, {
        ...retryOptions,
        credentials: "include",
      });
    } catch (refreshError) {
      processQueue(refreshError, null);

      if (refreshError.message === "SESSION_EXPIRED") {
        localStorage.removeItem("accessToken");
        if (window.updateAuthState) {
          window.updateAuthState(null);
        }
        // Throw specific error type
        // throw new Error("SESSION_EXPIRED");
      } else {
        console.error("Token refresh error:", refreshError);
        throw refreshError;
      }
    } finally {
      isRefreshing = false;
    }
  }

  return response;
};
// Wrapper for fetch with retry logic
export const fetchWithAuthRetry = async (url, options = {}) => {
  const response = await fetchWithAuth(url, options);

  // Check if we need to refresh token
  if (response.status === 401) {
    return handleUnauthorized(response, url, options);
  }

  return response;
};

export const authService = {
  // Register user
  async register(userData) {
    const response = await fetchWithAuthRetry(`${API_URL}/register`, {
      method: "POST",
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
    }

    return data;
  },

  // Login user
  async login(credentials) {
    const response = await fetchWithAuthRetry(`${API_URL}/login`, {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
    }

    return data;
  },

  // Logout user
  async logout() {
    const response = await fetchWithAuthRetry(`${API_URL}/logout`, {
      method: "POST",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Logout failed");
    }

    localStorage.removeItem("accessToken");
    return data;
  },

  // Get current user
  async getCurrentUser() {
    const response = await fetchWithAuthRetry(`${API_URL}/me`);

    if (!response.ok) {
      throw new Error("Not authenticated");
    }

    return response.json();
  },

  // Refresh token manually if needed
  async refreshToken() {
    const response = await fetch(`${API_URL}/refresh-token`, {
      method: "POST",
      credentials: "include",
    });

    // Check if refresh token expired
    if (response.status === 401) {
      throw new Error("SESSION_EXPIRED");
    }

    if (!response.ok) {
      throw new Error("Token refresh failed");
    }

    const data = await response.json();

    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
    }

    return data;
  },

  // Logout from all devices
  async logoutAll() {
    const response = await fetchWithAuthRetry(`${API_URL}/logout-all`, {
      method: "POST",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Logout failed");
    }

    localStorage.removeItem("accessToken");
    return data;
  },
};
