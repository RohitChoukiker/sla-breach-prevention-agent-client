import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '@/firebase';
import { authApi } from '@/services/api';

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
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('user');
    console.log("Restored token:", savedToken);
    console.log("Restored user:", savedUser);
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await credential.user.getIdToken();
      const response = await authApi.login({ token: idToken });

      const userData: User = {
        id: credential.user.uid,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role,
      };

      setUser(userData);
      setToken(idToken);
      localStorage.setItem('auth_token', idToken);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error: any) {
      try {
        await signOut(auth);
      } catch {
        // Ignore sign out errors and surface the original auth error.
      }

      const backendMessage = error?.response?.data?.detail;
      const firebaseMessage = error?.message;
      throw new Error(backendMessage || firebaseMessage || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, role: UserRole = 'customer') => {
    setIsLoading(true);
    try {
      await authApi.signup({ name, email, password });

      const credential = await signInWithEmailAndPassword(auth, email, password);

      const idToken = await credential.user.getIdToken();
      const response = await authApi.login({ token: idToken });

      const newUser: User = {
        id: credential.user.uid,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role || role,
      };

      setUser(newUser);
      setToken(idToken);
      localStorage.setItem('auth_token', idToken);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error: any) {
      const backendMessage = error?.response?.data?.detail;
      const firebaseMessage = error?.message;
      throw new Error(backendMessage || firebaseMessage || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
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
