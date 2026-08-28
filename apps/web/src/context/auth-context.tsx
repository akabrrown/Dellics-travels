"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

export interface SavedTraveler {
  id: string;
  name: string;
  relationship: string;
  passportNumber?: string;
  expiryDate?: string;
  nationality?: string;
}

export interface UserBooking {
  id: string;
  ref: string;
  title: string;
  type: "flight" | "hotel" | "tour" | "transfer" | "visa" | "esim";
  destination: string;
  date: string;
  amount: string;
  status: "CONFIRMED" | "IN_REVIEW" | "COMPLETED" | "CANCELLED";
  passengers: number;
  details?: Record<string, any>;
}

export interface AuthProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  role?: string;
  membershipTier?: "EXPLORER" | "VOYAGER" | "ELITE";
  pointsBalance?: number;
  nationality?: string;
  homeAirport?: string;
  seatPreference?: string;
  mealPreference?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  passportNumber?: string;
  passportExpiry?: string;
  passportCountry?: string;
  savedTravelers?: SavedTraveler[];
  savedFavorites?: any[];
  bookings?: UserBooking[];
  currency?: string;
  notificationPreferences?: {
    whatsapp: boolean;
    email: boolean;
    priceDrops: boolean;
  };
  onboardingCompleted?: boolean;
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
  updateProfile: (data: Partial<AuthProfile>) => Promise<void>;
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
      membershipTier: meta.membership_tier || "EXPLORER",
      pointsBalance: meta.points_balance !== undefined ? meta.points_balance : 500,
      nationality: meta.nationality || "",
      homeAirport: meta.home_airport || "",
      seatPreference: meta.seat_preference || "Window",
      mealPreference: meta.meal_preference || "Standard / No Restriction",
      emergencyContact: meta.emergency_contact || "",
      emergencyPhone: meta.emergency_phone || "",
      passportNumber: meta.passport_number || "",
      passportExpiry: meta.passport_expiry || "",
      passportCountry: meta.passport_country || "",
      savedTravelers: meta.saved_travelers || [],
      savedFavorites: meta.saved_favorites || [],
      bookings: meta.bookings || [],
      currency: meta.currency || "GHS",
      notificationPreferences: meta.notification_preferences || {
        whatsapp: true,
        email: true,
        priceDrops: true,
      },
      onboardingCompleted: meta.onboarding_completed || false,
    };
  };

  const fetchDbProfile = async (identifier: { email?: string; id?: string }) => {
    try {
      const param = identifier.email
        ? `email=${encodeURIComponent(identifier.email)}`
        : identifier.id
          ? `id=${encodeURIComponent(identifier.id)}`
          : null;
      if (!param) return;
      const res = await fetch(`/api/auth/profile?${param}`);
      if (res.ok) {
        const data = await res.json();
        if (data?.user) {
          const u = data.user;
          setUser((prev) => {
            const merged: AuthProfile = {
              id: u.id,
              email: u.email,
              fullName: u.name,
              phone: u.phone || prev?.phone || "",
              role: u.role,
              membershipTier: u.membership_tier,
              pointsBalance: u.points_balance,
              nationality: u.nationality || prev?.nationality || "",
              homeAirport: u.home_airport || prev?.homeAirport || "",
              seatPreference: u.seat_preference || prev?.seatPreference || "Window",
              mealPreference: u.meal_preference || prev?.mealPreference || "Standard / No Restriction",
              emergencyContact: u.emergency_contact || prev?.emergencyContact || "",
              emergencyPhone: u.emergency_phone || prev?.emergencyPhone || "",
              passportNumber: u.passport_number || prev?.passportNumber || "",
              passportExpiry: u.passport_expiry || prev?.passportExpiry || "",
              passportCountry: u.passport_country || prev?.passportCountry || "",
              onboardingCompleted: u.onboarding_completed,
              savedTravelers: prev?.savedTravelers || [],
              savedFavorites: prev?.savedFavorites || [],
              bookings: prev?.bookings || [],
              currency: prev?.currency || "GHS",
              notificationPreferences: prev?.notificationPreferences || {
                whatsapp: true,
                email: true,
                priceDrops: true,
              },
            };
            try {
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
            } catch {}
            return merged;
          });
          return;
        }
      } else if (res.status === 404) {
        // Account does not exist in live Supabase DB — purge any phantom cached profile
        setUser(null);
        setSupabaseUser(null);
        setSession(null);
        try {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        } catch {}
      }
    } catch (err) {
      console.error("Failed to sync live DB user profile:", err);
    }
  };

  useEffect(() => {
    // 1. Initial local profile hydration
    let cached: string | null = null;
    try {
      cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        setUser(parsed);
      }
    } catch {
      // LocalStorage access error
    }


    // 2. Fetch active Supabase session safely
    try {
      supabase.auth
        .getSession()
        .then(({ data }) => {
          const currentSession = data?.session ?? null;
          setSession(currentSession);
          setSupabaseUser(currentSession?.user ?? null);
          if (currentSession?.user) {
            fetchDbProfile({ email: currentSession.user.email, id: currentSession.user.id });
          } else if (cached) {
            try {
              const parsed = JSON.parse(cached);
              if (parsed?.email) {
                fetchDbProfile({ email: parsed.email, id: parsed.id });
              }
            } catch {
              localStorage.removeItem(LOCAL_STORAGE_KEY);
              setUser(null);
            }
          }
        })
        .catch(() => {
          if (cached) {
            try {
              const parsed = JSON.parse(cached);
              if (parsed?.email) {
                fetchDbProfile({ email: parsed.email, id: parsed.id });
              }
            } catch {
              localStorage.removeItem(LOCAL_STORAGE_KEY);
              setUser(null);
            }
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch {
      setIsLoading(false);
    }

    // 3. Listen to Auth State Changes safely
    try {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, newSession) => {
        setSession(newSession);
        setSupabaseUser(newSession?.user ?? null);

        if (newSession?.user) {
          fetchDbProfile({ email: newSession.user.email, id: newSession.user.id });
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
    } catch {
      // Fallback
    }
  }, []);

  const updateProfile = async (data: Partial<AuthProfile>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated: AuthProfile = {
        ...prev,
        ...data,
      };
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Sync to Supabase PostgreSQL database via server route
    try {
      const activeId = user?.id;
      const activeEmail = user?.email;
      if (activeId || activeEmail) {
        await fetch("/api/auth/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: activeId,
            email: activeEmail,
            fullName: data.fullName,
            phone: data.phone,
            nationality: data.nationality,
            homeAirport: data.homeAirport,
            seatPreference: data.seatPreference,
            mealPreference: data.mealPreference,
            emergencyContact: data.emergencyContact,
            emergencyPhone: data.emergencyPhone,
            passportNumber: data.passportNumber,
            passportExpiry: data.passportExpiry,
            passportCountry: data.passportCountry,
            pointsBalance: data.pointsBalance,
            membershipTier: data.membershipTier,
            onboardingCompleted: data.onboardingCompleted,
          }),
        });
      }
    } catch {
      // Offline fallback
    }

    // Sync to Supabase user metadata if available
    try {
      await supabase.auth.updateUser({
        data: {
          full_name: data.fullName,
          phone: data.phone,
          nationality: data.nationality,
          home_airport: data.homeAirport,
          seat_preference: data.seatPreference,
          meal_preference: data.mealPreference,
          emergency_contact: data.emergencyContact,
          emergency_phone: data.emergencyPhone,
          passport_number: data.passportNumber,
          passport_expiry: data.passportExpiry,
          passport_country: data.passportCountry,
          saved_travelers: data.savedTravelers,
          saved_favorites: data.savedFavorites,
          bookings: data.bookings,
          currency: data.currency,
          notification_preferences: data.notificationPreferences,
          onboarding_completed: data.onboardingCompleted,
        },
      });
    } catch {
      // Offline / fallback storage intact
    }
  };

  const signIn = async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Supabase Auth authentication
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (!error && data?.user) {
        const profile = extractProfile(data.user);
        if (profile) {
          setUser(profile);
          setSupabaseUser(data.user);
          setSession(data.session);
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
          } catch {}
          await fetchDbProfile({ email: cleanEmail, id: data.user.id });
          return {};
        }
      }
    } catch (sbErr) {
      console.error("Supabase auth sign in error:", sbErr);
    }

    // 2. Check direct PostgreSQL database record
    try {
      const res = await fetch(`/api/auth/profile?email=${encodeURIComponent(cleanEmail)}`);
      if (res.ok) {
        const data = await res.json();
        if (data?.user) {
          const u = data.user;
          const dbProfile: AuthProfile = {
            id: u.id,
            email: u.email,
            fullName: u.name,
            phone: u.phone || "",
            role: u.role,
            membershipTier: u.membership_tier,
            pointsBalance: u.points_balance,
            nationality: u.nationality || "",
            homeAirport: u.home_airport || "",
            seatPreference: u.seat_preference || "Window",
            mealPreference: u.meal_preference || "Standard / No Restriction",
            emergencyContact: u.emergency_contact || "",
            emergencyPhone: u.emergency_phone || "",
            passportNumber: u.passport_number || "",
            passportExpiry: u.passport_expiry || "",
            passportCountry: u.passport_country || "",
            onboardingCompleted: u.onboarding_completed,
            savedTravelers: [],
            savedFavorites: [],
            bookings: [],
            currency: "GHS",
            notificationPreferences: {
              whatsapp: true,
              email: true,
              priceDrops: true,
            },
          };
          setUser(dbProfile);
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dbProfile));
          } catch {}
          return {};
        }
      }
    } catch (dbErr) {
      console.error("Failed to authenticate with database:", dbErr);
    }

    return { error: "Invalid email or password. No registered account found in database." };
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    phone?: string,
  ) => {
    const cleanEmail = email.trim().toLowerCase();

    try {
      // 1. Direct Server-Side DB write to PostgreSQL Supabase Database
      const dbRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          password,
          fullName: fullName.trim(),
          phone: phone ? phone.trim() : undefined,
        }),
      });

      const dbData = await dbRes.json();
      if (!dbRes.ok || !dbData?.user?.id) {
        return { error: dbData?.error || "Failed to create account in database." };
      }

      const createdUser = dbData.user;
      const profile: AuthProfile = {
        id: createdUser.id,
        email: createdUser.email,
        fullName: createdUser.fullName || fullName,
        phone: createdUser.phone || phone || "",
        role: createdUser.role || "traveler",
        membershipTier: createdUser.membershipTier || "EXPLORER",
        pointsBalance: 500,
        nationality: "",
        homeAirport: "",
        seatPreference: "Window",
        mealPreference: "Standard / No Restriction",
        savedTravelers: [],
        savedFavorites: [],
        bookings: [],
        currency: "GHS",
        notificationPreferences: {
          whatsapp: true,
          email: true,
          priceDrops: true,
        },
        onboardingCompleted: false,
      };

      setUser(profile);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
      } catch {}

      // 2. Also register in Supabase Auth if available
      try {
        await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: fullName,
              phone: phone || "",
              membership_tier: "EXPLORER",
              points_balance: 500,
              onboarding_completed: false,
            },
          },
        });
      } catch {}

      return {};
    } catch (err: any) {
      console.error("Database user registration error:", err);
      return { error: err.message || "Registration service error." };
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
        updateProfile,
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
