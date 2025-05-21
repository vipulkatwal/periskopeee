'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

// Define the shape of our Auth context
interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// Create a context to hold authentication state
const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

/**
 * AuthProvider wraps your app and provides user session state.
 * It listens for Supabase auth changes and updates the user accordingly.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial user session from Supabase
    supabase.auth.getUser().then(({ data }: { data: { user: User | null } }) => {
      setUser(data.user);
      setLoading(false);
    });

    // Listen for auth state changes (login, logout, etc.)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to access the auth context.
 * Usage: const { user, loading } = useAuth();
 */
export function useAuth() {
  return useContext(AuthContext);
}