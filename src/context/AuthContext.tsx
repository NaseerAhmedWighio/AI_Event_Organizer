"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '@/lib/auth';

const LOCAL_STORAGE_KEY = 'ai-event-organizer-user';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSignedIn: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateUser: (updates: { firstName?: string; lastName?: string; profileImageUrl?: string }) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCheckedSession, setHasCheckedSession] = useState(false);

  // Helper to get user from localStorage
  const getUserFromLocalStorage = useCallback((): User | null => {
    try {
      const storedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedUser) {
        return JSON.parse(storedUser);
      }
    } catch (error) {
      console.error('Error reading user from localStorage:', error);
    }
    return null;
  }, []);

  // Helper to save user to localStorage
  const saveUserToLocalStorage = useCallback((userData: User | null) => {
    try {
      if (userData) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData));
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  }, []);

  useEffect(() => {
    // Check for existing session on mount (only once)
    if (!hasCheckedSession) {
      checkSession();
      setHasCheckedSession(true);
    } else {
      setIsLoading(false);
    }
  }, []);

  const checkSession = async () => {
    // First, try to get user from localStorage for immediate UI
    const localUser = getUserFromLocalStorage();
    if (localUser) {
      setUser(localUser);
    }

    try {
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
          saveUserToLocalStorage(data.user);
        } else {
          setUser(null);
          saveUserToLocalStorage(null);
        }
      } else {
        // If session API fails but we have localStorage user, keep it
        // The middleware will handle redirect if token is invalid
        if (!localUser) {
          setUser(null);
          saveUserToLocalStorage(null);
        }
      }
    } catch (error) {
      console.error('Session check failed:', error);
      // Keep localStorage user if API fails
      if (!localUser) {
        setUser(null);
        saveUserToLocalStorage(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        saveUserToLocalStorage(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'Network error. Please check your connection and try again.' };
    }
  }, [saveUserToLocalStorage]);

  const signUp = useCallback(async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        saveUserToLocalStorage(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Registration failed' };
      }
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: 'Network error. Please check your connection and try again.' };
    }
  }, [saveUserToLocalStorage]);

  const signOut = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      saveUserToLocalStorage(null);
    }
  }, [saveUserToLocalStorage]);

  const updateUser = useCallback(async (updates: { firstName?: string; lastName?: string; profileImageUrl?: string }) => {
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        saveUserToLocalStorage(data.user);
      }
    } catch (error) {
      console.error('Update user error:', error);
    }
  }, [saveUserToLocalStorage]);

  const refreshUser = useCallback(async () => {
    await checkSession();
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isSignedIn: !!user,
    signIn,
    signUp,
    signOut,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Return default empty state instead of throwing
    return {
      user: null,
      isLoading: false,
      isSignedIn: false,
      signIn: async () => ({ success: false, error: 'Not in AuthProvider' }),
      signUp: async () => ({ success: false, error: 'Not in AuthProvider' }),
      signOut: async () => {},
      updateUser: async () => {},
      refreshUser: async () => {},
    };
  }
  return context;
}

// Standard user hook that matches common patterns
export function useUser() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Return default empty state instead of throwing
    return {
      user: null,
      isLoaded: true,
      isSignedIn: false,
    };
  }
  
  const { user, isLoading, isSignedIn } = context;
  return {
    user: user ? {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName || user.lastName || user.email,
      profileImageUrl: user.profileImageUrl,
      createdAt: user.createdAt,
    } : null,
    isLoaded: !isLoading,
    isSignedIn,
  };
}

// Hook to get the display name for a user
export function useUserDisplayName(user: { firstName?: string; lastName?: string; email: string } | null): string {
  if (!user) return "User";
  if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
  if (user.firstName) return user.firstName;
  if (user.lastName) return user.lastName;
  return user.email;
}
