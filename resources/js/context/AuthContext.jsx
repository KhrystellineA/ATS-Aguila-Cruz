import { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'));
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user } = res.data;
    localStorage.setItem('admin_token', token);
    setToken(token);
    setUser(user);
    return res.data;
  };

  const register = async (name, email, password, password_confirmation) => {
    const res = await api.post('/auth/register', { name, email, password, password_confirmation });
    const { token, user } = res.data;
    localStorage.setItem('admin_token', token);
    setToken(token);
    setUser(user);
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) { /* ignore */ }
    localStorage.removeItem('admin_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
