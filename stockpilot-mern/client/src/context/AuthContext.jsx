import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('stockpilot_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('stockpilot_token') || null);
  const [loading, setLoading] = useState(true);

  // Validate session with backend on load / refresh
  useEffect(() => {
    let isMounted = true;
    const validateSession = async () => {
      const storedToken = localStorage.getItem('stockpilot_token');
      if (!storedToken) {
        if (isMounted) {
          setUser(null);
          setToken(null);
          setLoading(false);
        }
        return;
      }
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${storedToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.user) {
            setUser(data.user);
            localStorage.setItem('stockpilot_user', JSON.stringify(data.user));
          }
        } else {
          // Token is invalid or expired — purge session
          if (isMounted) {
            setUser(null);
            setToken(null);
            localStorage.removeItem('stockpilot_user');
            localStorage.removeItem('stockpilot_token');
          }
        }
      } catch (err) {
        // Network failure: preserve local session if present, do not crash
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    validateSession();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('stockpilot_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('stockpilot_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('stockpilot_token', token);
    } else {
      localStorage.removeItem('stockpilot_token');
    }
  }, [token]);

  // Strict Login: requires valid registered credentials
  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Invalid credentials');
    }
    setUser(data.user);
    setToken(data.token);
    return data;
  };

  // Explicit Demo Session: cleanly separated
  const loginDemo = async () => {
    const res = await fetch('/api/auth/demo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to initialize demo session');
    }
    setUser(data.user);
    setToken(data.token);
    return data;
  };

  // User Registration
  const signup = async (name, company, email, password) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, company, email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }
    setUser(data.user);
    setToken(data.token);
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('stockpilot_user');
    localStorage.removeItem('stockpilot_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        loginDemo,
        signup,
        logout,
        isAuthenticated: !!(user && token),
        isDemo: !!user?.isDemo
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
