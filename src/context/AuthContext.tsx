import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole } from '../types';

interface AuthContextType {
  userRole: UserRole | null;
  login: (password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  const login = (password: string): boolean => {
    if (password === '1950') {
      setUserRole('jefe_compras');
      return true;
    } else if (password === 'cocinero') {
      setUserRole('cocinero');
      return true;
    }
    return false;
  };

  const logout = () => {
    setUserRole(null);
  };

  const isAuthenticated = userRole !== null;

  return (
    <AuthContext.Provider value={{ userRole, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}; 