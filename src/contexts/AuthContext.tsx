import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface User {
  id: string;
  name: string;
  role: 'ADMIN' | 'MANAGER' | 'STAFF';
}

interface AuthContextType {
  user: User | null;
  login: (pincode: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing session
    const staffData = localStorage.getItem('staff');
    if (staffData) {
      try {
        const staff = JSON.parse(staffData);
        setUser(staff);
      } catch (error) {
        console.error('Error parsing staff data:', error);
        localStorage.removeItem('staff');
      }
    }
  }, []);

  const login = async (pincode: string): Promise<boolean> => {
    try {
      const { data } = await api.post('/auth/login', { pincode });
      
      if (data.success) {
        setUser(data.staff);
        localStorage.setItem('staff', JSON.stringify(data.staff));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('staff');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 