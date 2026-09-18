'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthUser, OAuthProvider } from '@/types';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isLoginModalOpen: boolean;
  oauthConfig: {
    google?: { isConfigured: boolean; clientId: string | null };
    github?: { isConfigured: boolean; clientId: string | null };
    demo?: { isConfigured: boolean; label: string };
    callbackUrls?: { development: string; shared: string };
  } | null;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  signInWithOAuth: (provider: OAuthProvider) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [oauthConfig, setOauthConfig] = useState<any>(null);

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      if (data.authenticated && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
      if (data.config) {
        setOauthConfig(data.config);
      }
    } catch (e) {
      console.error('Failed to fetch auth session:', e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  // Listen for popup postMessage callback as per OAuth skill guidelines
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      // Allow preview container origins and localhost
      if (!origin.endsWith('.run.app') && !origin.includes('localhost') && !origin.includes(window.location.host)) {
        return;
      }

      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        if (event.data.user) {
          setUser(event.data.user);
        }
        setIsLoginModalOpen(false);
        fetchSession();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [fetchSession]);

  const signInWithOAuth = async (provider: OAuthProvider) => {
    try {
      const res = await fetch(`/api/auth/url?provider=${provider}`);
      const data = await res.json();

      if (!data.success || !data.url) {
        throw new Error(data.error || 'Failed to initialize OAuth authorization URL');
      }

      // Open OAuth provider's URL directly in popup (required for iframe preview)
      const width = 560;
      const height = 680;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const authWindow = window.open(
        data.url,
        'oauth_popup',
        `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes,scrollbars=yes`
      );

      if (!authWindow) {
        alert('Please enable popups for this site in your browser to complete OAuth authentication.');
      }
    } catch (err: any) {
      console.error('OAuth initiation error:', err);
      alert(err.message || 'Failed to start OAuth login');
    }
  };

  const signOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      await fetchSession();
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isLoginModalOpen,
        oauthConfig,
        openLoginModal: () => setIsLoginModalOpen(true),
        closeLoginModal: () => setIsLoginModalOpen(false),
        signInWithOAuth,
        signOut,
        refreshSession: fetchSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const defaultAuthContext: AuthContextType = {
  user: null,
  loading: true,
  isLoginModalOpen: false,
  oauthConfig: null,
  openLoginModal: () => {},
  closeLoginModal: () => {},
  signInWithOAuth: async () => {},
  signOut: async () => {},
  refreshSession: async () => {}
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return defaultAuthContext;
  }
  return context;
}
