"use client";
import { useState, useEffect, createContext, useContext } from "react";
import { authService } from "../../lib/auth";
import { usePathname, useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const redirect = pathname.replace("/", "");

  // Function to handle session expiry
  const handleSessionExpired = () => {
    setUser(null);
    setIsSessionExpired(true);
    localStorage.removeItem("accessToken");

    if(pathname.includes("auth/") || pathname === "/en" || pathname === "/fr" || pathname === "/learn" || pathname==="/play") return
    // Optional: Redirect to login page after a short delay
    setTimeout(() => {
      router.push(`/auth/login?page=${redirect}`);
    }, 1000);
  };

  // Check authentication on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          try {
            await authService.refreshToken();
            const data = await authService.getCurrentUser();
            setUser(data.user);
            setIsSessionExpired(false);
          } catch (refreshError) {
            if (refreshError.message === "SESSION_EXPIRED") {
              handleSessionExpired();
            } else {
              setUser(null);
            }
          }
        } else {
          try {
            const data = await authService.getCurrentUser();
            setIsSessionExpired(false);
            setUser(data.user);
          } catch (error) {
            try {
              await authService.refreshToken();
              const data = await authService.getCurrentUser();
              setUser(data.user);
              setIsSessionExpired(false);
            } catch (refreshError) {
              if (refreshError.message === "SESSION_EXPIRED") {
                handleSessionExpired();
              } else {
                setUser(null);
              }
            }
          }
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
        setInitialCheckDone(true);
      }
    };

    initAuth();
  }, []);

  // Add a global error handler for SESSION_EXPIRED
  useEffect(() => {
    // Listen for SESSION_EXPIRED errors from fetch requests
    const handleFetchError = async (event) => {
      // You can create a custom event or check error messages
      // For now, let's handle it through the context
    };

    // Export handleSessionExpired to window for auth service
    if (typeof window !== "undefined") {
      window.handleSessionExpired = handleSessionExpired;
    }

    return () => {
      if (typeof window !== "undefined") {
        window.handleSessionExpired = null;
      }
    };
  }, []);

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      setUser(data.user);
      setIsSessionExpired(false);
      return data;
    } catch (error) {
      throw new Error(error.message || "Login failed");
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      setUser(data.user);
      setIsSessionExpired(false);
      return data;
    } catch (error) {
      throw new Error(error.message || "Registration failed");
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setIsSessionExpired(false);
      localStorage.removeItem("accessToken");
      router.push("/login");
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    initialCheckDone,
    isSessionExpired,
    handleSessionExpired, // Export this for manual handling
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
