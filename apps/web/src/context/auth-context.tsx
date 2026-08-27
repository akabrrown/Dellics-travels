"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

export interface AuthProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  role?: string;
}

interface AuthContextType {
  user: AuthProfile | null;
  supabaseUser: SupabaseUser | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    phone?: string,
  ) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "dellics_auth_profile";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AuthProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to construct normalized profile
  const extractProfile = (sbUser: SupabaseUser | null): AuthProfile | null => {
    if (!sbUser) return null;
    const meta = sbUser.user_metadata || {};
    const fullName =
      meta.full_name ||
      meta.name ||
      meta.firstName ||
      (sbUser.email ? sbUser.email.split("@")[0] : "Traveler");

    return {
      id: sbUser.id,
      email: sbUser.email || "",
      fullName,
      phone: meta.phone || sbUser.phone || "",
      avatarUrl: meta.avatar_url || "",
      role: meta.role || "traveler",
    };
  };

  useEffect(() => {
    // 1. Initial local profile hydration
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        setUser(JSON.parse(cached));
      }
    } catch {
      // LocalStorage access error
    }

    // 2. Fetch active Supabase session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setSupabaseUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        const profile = extractProfile(currentSession.user);
        setUser(profile);
        if (profile) {
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
          } catch {}
        }
      }
      setIsLoading(false);
    });

    // 3. Listen to Auth State Changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setSupabaseUser(newSession?.user ?? null);

      if (newSession?.user) {
        const profile = extractProfile(newSession.user);
        setUser(profile);
        if (profile) {
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
          } catch {}
        }
      } else {
        setUser(null);
        try {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        } catch {}
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        const profile = extractProfile(data.user);
        setUser(profile);
        setSupabaseUser(data.user);
        setSession(data.session);
        if (profile) {
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
          } catch {}
        }
      }
      return {};
    } catch (err: any) {
      return { error: err.message || "An unexpected sign in error occurred." };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    phone?: string,
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone || "",
          },
        },
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        const profile = extractProfile(data.user);
        setUser(profile);
        setSupabaseUser(data.user);
        setSession(data.session);
        if (profile) {
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
          } catch {}
        }
      }
      return {};
    } catch (err: any) {
      return { error: err.message || "An unexpected registration error occurred." };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    } finally {
      setUser(null);
      setSupabaseUser(null);
      setSession(null);
      try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } catch {}
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseUser,
        session,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
