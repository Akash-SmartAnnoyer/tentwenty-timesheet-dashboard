 

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { api } from './api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const token = sessionStorage.getItem('auth-token');
    const userData = sessionStorage.getItem('user-data');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Failed to parse user data:', error);
        sessionStorage.removeItem('auth-token');
        sessionStorage.removeItem('user-data');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.login({ email, password });
      const { user: userData, token } = response.data;
      
      sessionStorage.setItem('auth-token', token);
      sessionStorage.setItem('user-data', JSON.stringify(userData));
      
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    sessionStorage.removeItem('auth-token');
    sessionStorage.removeItem('user-data');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 