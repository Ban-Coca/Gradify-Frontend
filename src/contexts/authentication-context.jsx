import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { requestNotificationPermission } from "@/services/notification/firebaseService";
const AuthenticationContext = createContext(null);

export const AuthenticationProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  const extractRoleFromToken = (token) => {
    if (!token) return null;
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.role || null;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const decoded = jwtDecode(token);
      if (!decoded.exp) return true;
      // exp is in seconds, Date.now() is in ms
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        const storedAuthStatus = localStorage.getItem("isAuthenticated");

        // Allow unauthenticated access to onboarding routes
        const onboardingPaths = [
          "/onboarding/role",
          "/onboarding/student",
          "/onboarding/teacher",
          "/oauth2/callback"
        ];
        if (
          onboardingPaths.includes(window.location.pathname) &&
          (!storedToken || !storedUser || storedAuthStatus !== "true" || isTokenExpired(storedToken))
        ) {
          setLoading(false);
          return;
        }

        if (storedToken && storedUser && storedAuthStatus === "true" && !isTokenExpired(storedToken)) {
          setToken(storedToken);
          setCurrentUser(JSON.parse(storedUser));
          setIsAuthenticated(true);

          const role = extractRoleFromToken(storedToken);
          setUserRole(role);
          localStorage.setItem("role", role);
        } else {
          logout();
        }
      } catch (error) {
        console.error("Error initializing auth state:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (userData, authToken) => {
    const role = extractRoleFromToken(authToken);
    setUserRole(role);
    setCurrentUser(userData);
    setToken(authToken);
    setIsAuthenticated(true);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("role", role);
    await requestNotificationPermission(userData.userId);
    if (role === "TEACHER") {
      navigate("/teacher/dashboard");
    } else if (role === "STUDENT") {
      navigate("/student/dashboard");
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    setIsAuthenticated(false);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("role");

    navigate("/");
  };

  const updateUserProfile = (updatedUserData) => {
    const updatedUser = { ...currentUser, ...updatedUserData };
    setCurrentUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // Always update userRole if present in updatedUserData
    if (updatedUserData.role) {
      setUserRole(updatedUserData.role);
      localStorage.setItem("role", updatedUserData.role);
    }
  };

  const hasRole = (requiredRoles) => {
    if (!userRole) return false;
    if (Array.isArray(requiredRoles)) {
      return requiredRoles.includes(userRole);
    }
    return userRole === requiredRoles;
  };

  const getAuthHeader = () => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };
  const contextValue = {
    currentUser,
    token,
    isAuthenticated,
    loading,
    userRole,
    login,
    logout,
    updateUserProfile,
    getAuthHeader,
    hasRole,
  };
  return (
    <AuthenticationContext.Provider value={contextValue}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthenticationContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
