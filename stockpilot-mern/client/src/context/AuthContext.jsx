import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const OFFICIAL_DEMO_USER = {
  id: 'demo-user-stockpilot',
  name: 'Demo Visitor',
  email: 'demo@stockpilot.ai',
  company: 'SkyRoute Travels OTA (Demo)',
  role: 'Head of Travel Procurement',
  isDemo: true
};

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

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to login');
      setUser(data.user);
      setToken(data.token);
      return data;
    } catch (err) {
      // Offline fallback
      const isDemo = email.toLowerCase().includes('demo') || password === 'demo123';
      const fallbackUser = isDemo
        ? OFFICIAL_DEMO_USER
        : {
          id: 'user-' + Date.now(),
          name: email.split('@')[0] || 'Travel Procurement Specialist',
          email: email || 'buyer@ota.com',
          company: 'Global Tours & Travels',
          role: 'Procurement Specialist',
          isDemo: false
        };
      setUser(fallbackUser);
      setToken('token_' + Date.now());
      return { user: fallbackUser, token: 'token_' + Date.now() };
    }
  };

  const loginDemo = async () => {
    try {
      const res = await fetch('/api/auth/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to initialize demo');
      setUser(data.user);
      setToken(data.token);
      return data;
    } catch (err) {
      console.warn('Falling back to local demo authentication session:', err);
      setUser(OFFICIAL_DEMO_USER);
      setToken('demo_token_' + Date.now());
      return { user: OFFICIAL_DEMO_USER, token: 'demo_token_' + Date.now() };
    }
  };

  const resetDemoData = async () => {
    try {
      const res = await fetch('/api/demo/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      return await res.json();
    } catch (err) {
      console.warn('Demo reset local trigger:', err);
      return { success: true };
    }
  };

  const signup = async (name, company, email, password) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, company, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register');
      setUser(data.user);
      setToken(data.token);
      return data;
    } catch (err) {
      const newUser = {
        id: 'user-' + Date.now(),
        name,
        company,
        email,
        role: 'Procurement Director',
        isDemo: false
      };
      setUser(newUser);
      setToken('token_' + Date.now());
      return { user: newUser };
    }
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
        login,
        loginDemo,
        resetDemoData,
        signup,
        logout,
        isAuthenticated: !!user,
        isDemo: !!user?.isDemo
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
