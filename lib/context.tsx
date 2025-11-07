'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  occupation?: string;
  income?: number;
  householdSize?: number;
  livingWith?: string;
  location?: string;
  riskTolerance?: string;
  savingsRate?: number;
  monthlyBudget?: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  const signup = async (email: string, password: string, name: string) => {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Signup failed');
    }

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  const loginWithGoogle = async () => {
    try {
      // Initialize Google Sign-In
      if (typeof window !== 'undefined' && (window as any).google) {
        const google = (window as any).google;
        
        // Use Google Sign-In
        google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
          callback: async (response: any) => {
            try {
              // Decode the JWT token to get user info
              const base64Url = response.credential.split('.')[1];
              const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
              const jsonPayload = decodeURIComponent(
                atob(base64)
                  .split('')
                  .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                  .join('')
              );
              const userInfo = JSON.parse(jsonPayload);

              // Send to backend
              const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  email: userInfo.email,
                  name: userInfo.name,
                  googleId: userInfo.sub,
                }),
              });

              const data = await res.json();

              if (!res.ok) {
                throw new Error(data.error || 'Google login failed');
              }

              setToken(data.token);
              setUser(data.user);
              localStorage.setItem('token', data.token);
              localStorage.setItem('user', JSON.stringify(data.user));
            } catch (error) {
              console.error('Google login error:', error);
              throw error;
            }
          },
        });

        // Trigger the sign-in dialog
        google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          { theme: 'outline', size: 'large' }
        );
      }
    } catch (error) {
      console.error('Google login failed:', error);
      throw error;
    }
  };

  const loginWithApple = async () => {
    try {
      // Initialize Apple Sign-In
      if (typeof window !== 'undefined' && (window as any).AppleID) {
        const AppleID = (window as any).AppleID;
        
        AppleID.auth.init({
          clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || '',
          teamId: process.env.NEXT_PUBLIC_APPLE_TEAM_ID || '',
          keyId: process.env.NEXT_PUBLIC_APPLE_KEY_ID || '',
          redirectURI: `${window.location.origin}/auth/apple-callback`,
          usePopup: true,
        });

        const response = await AppleID.auth.signIn();

        if (response.authorization) {
          // Send to backend
          const res = await fetch('/api/auth/apple', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: response.user?.email || '',
              name: response.user?.name?.firstName + ' ' + response.user?.name?.lastName || 'Apple User',
              appleId: response.user?.email || '',
            }),
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.error || 'Apple login failed');
          }

          setToken(data.token);
          setUser(data.user);
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      }
    } catch (error) {
      console.error('Apple login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateProfile = async (data: Partial<User>) => {
    const response = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Profile update failed');
    }

    const updatedUser = await response.json();
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        signup,
        loginWithGoogle,
        loginWithApple,
        logout,
        updateProfile,
        isLoading,
      }}
    >
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
