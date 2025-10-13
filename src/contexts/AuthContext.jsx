import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  // Monitor storage changes (e.g., logout from another tab)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'isAuthenticated') {
        if (e.newValue !== 'true') {
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Verify authentication status periodically
  useEffect(() => {
    const verifyAuth = () => {
      const authStatus = localStorage.getItem('isAuthenticated');
      if (authStatus !== 'true' && isAuthenticated) {
        setIsAuthenticated(false);
      }
    };

    const interval = setInterval(verifyAuth, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const login = (username, password) => {
    // Hardcoded credentials
    if (username === 'user' && password === 'password') {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
      return { success: true };
    }
    return { success: false, error: 'Invalid username or password' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
