/**
 * AuthContext.tsx
 * Contexto de autenticación global
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredUser, isAuthenticated, removeAuthToken } from '../services/api';

interface User {
  id: number;
  nombre: string;
  email: string;
  total_operations?: number;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Cargar usuario del localStorage al montar
  useEffect(() => {
    const storedUser = getStoredUser();
    const authenticated = isAuthenticated();
    
    if (storedUser && authenticated) {
      setUser(storedUser);
      setIsLoggedIn(true);
    }
    
    // Escuchar evento de logout
    const handleLogout = () => {
      setUser(null);
      setIsLoggedIn(false);
    };
    
    window.addEventListener('auth:logout', handleLogout);
    
    return () => {
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, []);

  const login = (token: string, userData: User) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

