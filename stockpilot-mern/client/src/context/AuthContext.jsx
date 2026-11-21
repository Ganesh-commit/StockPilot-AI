import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Validate session strictly with backend on initial load / refresh
  useEffect(() => {
    let isMounted = true;

    const validateSession = async () => {
      const storedToken = localStorage.getItem('stockpilot_token');
      const storedUser = localStorage.getItem('stockpilot_user');

      if (!storedToken || !storedUser) {
        if (isMounted) {
          setUser(null);
          setToken(null);
          localStorage.removeItem('stockpilot_user');
          localStorage.removeItem('stockpilot_token');
          setLoading(false);
        }
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${storedToken}` }
        });

        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const data = await res.json();
          if (isMounted && data.user) {
            setUser(data.user);
            setToken(storedToken);
            localStorage.setItem('stockpilot_user', JSON.stringify(data.user));
            return;
          }
        }

        // If backend rejected token or returned non-JSON, PURGE invalid session!
        if (isMounted) {
          setUser(null);
          setToken(null);
          localStorage.removeItem('stockpilot_user');
          localStorage.removeItem('stockpilot_token');
        }
      } catch (err) {
        // Unverified token cannot grant access — purge session
        if (isMounted) {
          setUser(null);
          setToken(null);
          localStorage.removeItem('stockpilot_user');
          localStorage.removeItem('stockpilot_token');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    validateSession();
    return () => {
      isMounted = false;
    };
  }, []);

  // Strict Login: requires existing registered account in MongoDB
  const login = async (email, password) => {
    // 1. Instantly purge any stale session state
    setUser(null);
    setToken(null);
    localStorage.removeItem('stockpilot_user');
    localStorage.removeItem('stockpilot_token');

    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail || !password) {
      throw new Error('Email and password are required');
    }

    let res;
    try {
      res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password })
      });
    } catch (networkErr) {
      throw new Error('Unable to connect to authentication server. Please check your network connection.');
    }

    // Verify response is valid JSON (protect against Vercel HTML rewrites)
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new Error('Authentication service unavailable. Please try again.');
    }

    const data = await res.json();

    if (!res.ok) {
      // Show exact server error message (e.g. "Account not found. Please sign up first.")
      throw new Error(data.error || 'Authentication failed');
    }

    if (!data.token || !data.user) {
      throw new Error('Invalid authentication response from server.');
    }

    // Valid authenticated user confirmed
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('stockpilot_user', JSON.stringify(data.user));
    localStorage.setItem('stockpilot_token', data.token);

    return data;
  };

  // Explicit Demo Session: cleanly separated from standard login
  const loginDemo = async () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('stockpilot_user');
    localStorage.removeItem('stockpilot_token');

    let res;
    try {
      res = await fetch('/api/auth/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err) {
      throw new Error('Unable to connect to demo server. Please try again.');
    }

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new Error('Demo service unavailable.');
    }

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to initialize demo session');
    }

    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('stockpilot_user', JSON.stringify(data.user));
    localStorage.setItem('stockpilot_token', data.token);

    return data;
  };

  // User Registration
  const signup = async (name, company, email, password) => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('stockpilot_user');
    localStorage.removeItem('stockpilot_token');

    const cleanEmail = (email || '').trim().toLowerCase();
    let res;
    try {
      res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: (name || '').trim(), company: (company || '').trim(), email: cleanEmail, password })
      });
    } catch (err) {
      throw new Error('Unable to connect to registration server. Please try again.');
    }

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new Error('Registration service unavailable.');
    }

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('stockpilot_user', JSON.stringify(data.user));
    localStorage.setItem('stockpilot_token', data.token);

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
