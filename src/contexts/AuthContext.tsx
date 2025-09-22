import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '@/services/api';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface Tokens {
  access: string;
  refresh: string;
}

interface AuthContextType {
  user: User | null;
  tokens: Tokens | null;
  loading: boolean;
  signUp: (username: string, email: string, password: string, firstName?: string, lastName?: string) => Promise<{ error: any }>;
  signIn: (username: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<Tokens | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored tokens on app load
    const storedTokens = localStorage.getItem('django_tokens');
    const storedUser = localStorage.getItem('django_user');

    if (storedTokens && storedUser) {
      try {
        const parsedTokens = JSON.parse(storedTokens);
        const parsedUser = JSON.parse(storedUser);

        setTokens(parsedTokens);
        setUser(parsedUser);

        // Validate token by calling /auth/me/
        validateToken(parsedTokens.access);
      } catch (error) {
        console.error('Error parsing stored auth data:', error);
        localStorage.removeItem('django_tokens');
        localStorage.removeItem('django_user');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async (token: string) => {
    try {
      const userData = await apiClient.getCurrentUser(token);
      setUser(userData);
    } catch (error) {
      console.error('Token validation failed:', error);
      localStorage.removeItem('django_tokens');
      localStorage.removeItem('django_user');
      setTokens(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (username: string, email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      const data = await apiClient.register({
        username,
        email,
        password,
        first_name: firstName || '',
        last_name: lastName || '',
      });

      setUser(data.user);
      setTokens(data.tokens);

      // Store in localStorage
      localStorage.setItem('django_tokens', JSON.stringify(data.tokens));
      localStorage.setItem('django_user', JSON.stringify(data.user));

      return { error: null };
    } catch (error) {
      console.error('Registration failed:', error);
      return { error: error instanceof Error ? { message: error.message } : { message: 'Network error occurred' } };
    }
  };

  const signIn = async (username: string, password: string) => {
    try {
      const data = await apiClient.login({ username, password });

      setUser(data.user);
      setTokens(data.tokens);

      // Store in localStorage
      localStorage.setItem('django_tokens', JSON.stringify(data.tokens));
      localStorage.setItem('django_user', JSON.stringify(data.user));

      return { error: null };
    } catch (error) {
      console.error('Login failed:', error);
      return { error: error instanceof Error ? { message: error.message } : { message: 'Network error occurred' } };
    }
  };

  const signOut = async () => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem('django_tokens');
    localStorage.removeItem('django_user');
  };

  const refreshToken = async (): Promise<boolean> => {
    if (!tokens?.refresh) return false;

    try {
      // Use Django's token refresh endpoint directly since it's not in our API client yet
      const response = await fetch(`${import.meta.env.VITE_DJANGO_API_URL || 'http://localhost:8000/api'}/auth/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh: tokens.refresh,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const newTokens = {
          access: data.access,
          refresh: tokens.refresh, // Keep the same refresh token
        };

        setTokens(newTokens);
        localStorage.setItem('django_tokens', JSON.stringify(newTokens));

        return true;
      } else {
        // Refresh failed, sign out
        await signOut();
        return false;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      await signOut();
      return false;
    }
  };

  const value = {
    user,
    tokens,
    loading,
    signUp,
    signIn,
    signOut,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
