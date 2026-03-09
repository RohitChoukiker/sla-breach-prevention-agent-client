import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'customer' | 'agent' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const MOCK_USERS: Record<string, User & { password: string }> = {
  'admin@demo.com': { id: '1', name: 'Admin User', email: 'admin@demo.com', role: 'admin', password: 'admin123' },
  'agent@demo.com': { id: '2', name: 'Agent Smith', email: 'agent@demo.com', role: 'agent', password: 'agent123' },
  'customer@demo.com': { id: '3', name: 'John Customer', email: 'customer@demo.com', role: 'customer', password: 'customer123' },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const mockUser = MOCK_USERS[email];
    if (mockUser && mockUser.password === password) {
      const { password: _, ...userData } = mockUser;
      const fakeToken = 'mock_jwt_token_' + Date.now();
      setUser(userData);
      setToken(fakeToken);
      localStorage.setItem('auth_token', fakeToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    throw new Error('Invalid email or password');
  };

  const signup = async (name: string, email: string, password: string, role: UserRole = 'customer') => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const newUser: User = { id: Date.now().toString(), name, email, role };
    const fakeToken = 'mock_jwt_token_' + Date.now();
    setUser(newUser);
    setToken(fakeToken);
    localStorage.setItem('auth_token', fakeToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
