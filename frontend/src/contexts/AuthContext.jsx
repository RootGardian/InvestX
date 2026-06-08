import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from '../i18n';
import { apiFetch } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('investx_token'));
  const [loading, setLoading] = useState(true);
  
  // User Preferences
  const [language, setLanguage] = useState(localStorage.getItem('investx_lang') || 'fr');
  const [currency, setCurrency] = useState(localStorage.getItem('investx_currency') || 'USD');

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await apiFetch('/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
          if (userData.currency) {
            setCurrency(userData.currency);
            localStorage.setItem('investx_currency', userData.currency);
          }
        } else {
          // Token might be expired or invalid
          localStorage.removeItem('investx_token');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = (newToken, userData) => {
    localStorage.setItem('investx_token', newToken);
    setToken(newToken);
    if (userData) {
      setUser(userData);
      if (userData.currency) updateCurrency(userData.currency);
    }
  };

  const logout = () => {
    localStorage.removeItem('investx_token');
    setToken(null);
    setUser(null);
  };

  const updateLanguage = (lang) => {
    localStorage.setItem('investx_lang', lang);
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const updateCurrency = (curr) => {
    localStorage.setItem('investx_currency', curr);
    setCurrency(curr);
  };

  const updateProfile = (data) => {
    setUser({ ...user, ...data });
    // This would also trigger a backend call PUT /api/users/me
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      language,
      currency,
      login,
      logout,
      updateLanguage,
      updateCurrency,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
