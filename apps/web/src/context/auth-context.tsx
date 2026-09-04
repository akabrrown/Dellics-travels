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
  username?: string;
  bio?: string;
  publicProfile?: boolean;
  visitedCountries?: string[];
  badges?: string[];
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
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
  addBooking: (booking: UserBooking) => Promise<void>;
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
      username: meta.username || sbUser.email?.split("@")[0]?.replace(/[^a-zA-Z0-9_]/g, "_") || "traveler",
      bio: meta.bio || "Global explorer traveling the world with Dellics Travels.",
      publicProfile: meta.public_profile ?? true,
      visitedCountries: meta.visited_countries || ["Ghana", "United Kingdom", "United Arab Emirates"],
      badges: meta.badges || ["Founding Member", "Passport Verified", "First Flight Booked"],
      socialLinks: meta.social_links || {
        twitter: "",
        instagram: "",
        linkedin: "",
      },
      phone: meta.phone || sbUser.phone || "",
      avatarUrl: meta.avatar_url || "",
      role: meta.role || "traveler",
      membershipTier: meta.membership_tier || "EXPLORER",
      pointsBalance: meta.points_balance !== undefined ? meta.points_balance : 500,
      nationality: meta.nationality || "Ghana",
      homeAirport: meta.home_airport || "ACC - Kotoka International",
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
              username: u.username || prev?.username || u.email?.split("@")[0] || "traveler",
              bio: u.bio || prev?.bio || "Global explorer traveling the world with Dellics Travels.",
              publicProfile: u.public_profile ?? prev?.publicProfile ?? true,
              visitedCountries: u.visited_countries || prev?.visitedCountries || ["Ghana", "United Kingdom", "United Arab Emirates"],
              badges: u.badges || prev?.badges || ["Founding Member", "Passport Verified", "First Flight Booked"],
              socialLinks: u.social_links || prev?.socialLinks || { twitter: "", instagram: "", linkedin: "" },
              phone: u.phone || prev?.phone || "",
              role: u.role,
              membershipTier: u.membership_tier,
              pointsBalance: u.points_balance,
              nationality: u.nationality || prev?.nationality || "Ghana",
              homeAirport: u.home_airport || prev?.homeAirport || "ACC - Kotoka International",
              seatPreference: u.seat_preference || prev?.seatPreference || "Window",
              mealPreference: u.meal_preference || prev?.mealPreference || "Standard / No Restriction",
              emergencyContact: u.emergency_contact || prev?.emergencyContact || "",
              emergencyPhone: u.emergency_phone || prev?.emergencyPhone || "",
              passportNumber: u.passport_number || prev?.passportNumber || "",
              passportExpiry: u.passport_expiry || prev?.passportExpiry || "",
              passportCountry: u.passport_country || prev?.passportCountry || "Ghana",
              onboardingCompleted: u.onboarding_completed,
              savedTravelers: prev?.savedTravelers || [],
              savedFavorites: prev?.savedFavorites || [],
              bookings: prev?.bookings && prev.bookings.length > 0 ? prev.bookings : (u.trips || []),
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
        // DB record pending initial sync; do not purge active Supabase session
        if (!supabaseUser && !session) {
          try {
            const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (!cached) setUser(null);
          } catch {}
        }
      }
    } catch (err) {
      console.error("Failed to sync live DB user profile:", err);
    }
  };

  useEffect(() => {
    let cachedEmail: string | null = null;
    let cachedId: string | null = null;
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        cachedEmail = parsed?.email || null;
        cachedId = parsed?.id || null;
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
          } else if (cachedEmail || cachedId) {
            fetchDbProfile({ email: cachedEmail || undefined, id: cachedId || undefined });
          } else {
            setUser(null);
            setIsLoading(false);
          }
        })
        .catch(() => {
          if (cachedEmail || cachedId) {
            fetchDbProfile({ email: cachedEmail || undefined, id: cachedId || undefined });
          } else {
            setUser(null);
            setIsLoading(false);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch {
      setUser(null);
      setIsLoading(false);
    }


    // 3. Multi-Tab Realtime Sync & Auth State Listeners
    let realtimeChannel: BroadcastChannel | null = null;
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        realtimeChannel = new BroadcastChannel("dellics_profile_realtime");
        realtimeChannel.onmessage = (event) => {
          if (event.data?.type === "PROFILE_UPDATED" && event.data?.profile) {
            setUser(event.data.profile);
          } else if (event.data?.type === "SIGNED_OUT") {
            setUser(null);
          }
        };
      }

      const handleStorage = (e: StorageEvent) => {
        if (e.key === LOCAL_STORAGE_KEY) {
          if (e.newValue) {
            try {
              setUser(JSON.parse(e.newValue));
            } catch {}
          } else {
            setUser(null);
          }
        }
      };
      window.addEventListener("storage", handleStorage);

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
        window.removeEventListener("storage", handleStorage);
        if (realtimeChannel) {
          realtimeChannel.close();
        }
      };
    } catch {
      // Fallback
    }
  }, []);

  const updateProfile = async (data: Partial<AuthProfile>) => {
    let cachedUser: any = null;
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) cachedUser = JSON.parse(cached);
    } catch {}

    const activeId =
      data.id || user?.id || supabaseUser?.id || session?.user?.id || cachedUser?.id;
    const activeEmail =
      data.email || user?.email || supabaseUser?.email || session?.user?.email || cachedUser?.email;

    const base: AuthProfile = user || cachedUser || {
      id: activeId || "temp",
      email: activeEmail || "",
      fullName: data.fullName || "Traveler",
      username: data.username || "traveler",
      role: "traveler",
      membershipTier: "EXPLORER",
      pointsBalance: 500,
      currency: "GHS",
    };

    const updated: AuthProfile = {
      ...base,
      ...data,
    };

    setUser(updated);

    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        const bc = new BroadcastChannel("dellics_profile_realtime");
        bc.postMessage({ type: "PROFILE_UPDATED", profile: updated });
        bc.close();
      }
    } catch {}

    // Sync to Supabase PostgreSQL database via server route
    try {
      if (activeId || activeEmail) {
        await fetch("/api/auth/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: activeId,
            email: activeEmail,
            fullName: updated.fullName,
            username: updated.username,
            bio: updated.bio,
            publicProfile: updated.publicProfile,
            visitedCountries: updated.visitedCountries,
            badges: updated.badges,
            socialLinks: updated.socialLinks,
            phone: updated.phone,
            nationality: updated.nationality,
            homeAirport: updated.homeAirport,
            seatPreference: updated.seatPreference,
            mealPreference: updated.mealPreference,
            emergencyContact: updated.emergencyContact,
            emergencyPhone: updated.emergencyPhone,
            passportNumber: updated.passportNumber,
            passportExpiry: updated.passportExpiry,
            passportCountry: updated.passportCountry,
            pointsBalance: updated.pointsBalance,
            membershipTier: updated.membershipTier,
            onboardingCompleted: updated.onboardingCompleted,
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
          full_name: updated.fullName,
          username: updated.username,
          bio: updated.bio,
          public_profile: updated.publicProfile,
          visited_countries: updated.visitedCountries,
          badges: updated.badges,
          social_links: updated.socialLinks,
          phone: updated.phone,
          nationality: updated.nationality,
          home_airport: updated.homeAirport,
          seat_preference: updated.seatPreference,
          meal_preference: updated.mealPreference,
          emergency_contact: updated.emergencyContact,
          emergency_phone: updated.emergencyPhone,
          passport_number: updated.passportNumber,
          passport_expiry: updated.passportExpiry,
          passport_country: updated.passportCountry,
          saved_travelers: updated.savedTravelers,
          saved_favorites: updated.savedFavorites,
          bookings: updated.bookings,
          currency: updated.currency,
          notification_preferences: updated.notificationPreferences,
          onboarding_completed: updated.onboardingCompleted,
        },
      });
    } catch {
      // Offline / fallback storage intact
    }
  };

  const addBooking = async (booking: UserBooking) => {
    const currentBookings = user?.bookings || [];
    const exists = currentBookings.some((b) => b.id === booking.id);
    const updatedBookings = exists
      ? currentBookings.map((b) => (b.id === booking.id ? booking : b))
      : [booking, ...currentBookings];

    const currentPoints = user?.pointsBalance ?? 500;
    const newPoints = currentPoints + 150;
    const newTier =
      newPoints >= 10000 ? "ELITE" : newPoints >= 2500 ? "VOYAGER" : (user?.membershipTier || "EXPLORER");

    await updateProfile({
      bookings: updatedBookings,
      pointsBalance: newPoints,
      membershipTier: newTier,
    });
  };

  const signIn = async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      const data = await res.json();

      if (!res.ok || !data?.user) {
        setUser(null);
        setSupabaseUser(null);
        setSession(null);
        try {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        } catch {}
        return { error: data?.error || "Invalid email or password. No account found in database." };
      }

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
        bookings: u.trips || [],
        currency: "GHS",
        notificationPreferences: {
          whatsapp: true,
          email: true,
          priceDrops: true,
        },
      };

      setUser(dbProfile);
      if (data.authUser) setSupabaseUser(data.authUser);
      if (data.session) setSession(data.session);

      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dbProfile));
      } catch {}

      return {};
    } catch (err: any) {
      console.error("Sign in failed:", err);
      setUser(null);
      try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } catch {}
      return { error: err.message || "Failed to authenticate with database." };
    }
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
        if (typeof window !== "undefined" && "BroadcastChannel" in window) {
          const bc = new BroadcastChannel("dellics_profile_realtime");
          bc.postMessage({ type: "SIGNED_OUT" });
          bc.close();
        }
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
        addBooking,
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
