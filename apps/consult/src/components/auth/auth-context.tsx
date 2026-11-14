"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface StudentProfile {
  // Step 1: General Info
  firstName: string;
  preferredName?: string;
  middleName?: string;
  lastName: string;
  gender: "Female" | "Male" | "Prefer not to say" | "";
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  email: string;
  confirmEmail: string;
  phone: string;

  // Step 2: Educational Background
  educationalStatus: string;
  highSchoolName: string;
  highSchoolAddress?: string;
  schoolCountry: string;
  gradMonth: string;
  gradYear: string;
  currentInstitution?: string;
  currentProgramme?: string;
  highestQualification: string;

  // Step 3: Personal Information
  countryOfResidence: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  region: string;
  postalCode?: string;
  country: string;

  // Step 4: Study Abroad Preferences
  preferredDestination: string;
  preferredLevelOfStudy: string;
  preferredFieldOfStudy: string;
  intendedIntake: string;
  hasPreferredUniversity: string;
  standardisedTests: string[];

  // Step 5: Stay Connected & Guardian
  receiveUpdates: boolean;
  parentFirstName?: string;
  parentLastName?: string;
  parentRelationship?: string;
  parentEmail?: string;
  parentConfirmEmail?: string;
  parentPhone?: string;
  copyParentOnUpdates?: boolean;

  // Step 6: Additional Info & Consent
  referralSource: string;
  additionalComments?: string;
  consentAccurate: boolean;
  consentPrivacy: boolean;
  consentContact: boolean;
  isVerified: boolean;
  isCompleted: boolean;
  studentId?: string;
  classYear?: string;
}

export interface StudentUser {
  id?: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  isLoggedIn: boolean;
  profileCompleted: boolean;
  profile?: StudentProfile;
  applications?: any[];
}

interface AuthContextType {
  user: StudentUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: { firstName: string; lastName: string; email: string; phone?: string; code?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  saveProfile: (profile: Partial<StudentProfile>) => Promise<{ success: boolean; error?: string }>;
  verifyEmailCode: (code: string) => Promise<boolean>;
  sendCode: (email: string, name?: string) => Promise<{ success: boolean; message?: string }>;
  refreshPortalData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<StudentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync user from backend API session or localStorage fallback
  const syncUser = useCallback(async () => {
    try {
      const email = typeof window !== "undefined" ? localStorage.getItem("dellics_user_email") : null;
      if (!email) {
        setUser(null);
        return;
      }

      // Fetch student data from backend API
      const res = await fetch(`${API_BASE}/study/portal/me?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          const profile = json.profile;
          const u = json.user;
          const nameParts = (u.name || email.split("@")[0] || "Student").split(" ");
          const firstName = profile?.firstName || nameParts[0] || "Student";
          const lastName = profile?.lastName || nameParts.slice(1).join(" ") || "";

          setUser({
            id: u.id,
            name: u.name || `${firstName} ${lastName}`.trim(),
            firstName,
            lastName,
            email: u.email,
            phone: u.phone,
            isLoggedIn: true,
            profileCompleted: u.onboardingCompleted || !!profile,
            profile: profile || undefined,
            applications: json.applications || [],
          });
          return;
        }
      }

      // Local fallback if offline or backend cold start
      const storedName = (typeof window !== "undefined" ? localStorage.getItem("dellics_user_name") : null) || email.split("@")[0] || "Student";
      const storedProfile = typeof window !== "undefined" ? localStorage.getItem("dellics_student_profile") : null;
      const parsedProfile = storedProfile ? JSON.parse(storedProfile) : undefined;
      const parts = storedName.split(" ");

      setUser({
        name: storedName,
        firstName: parts[0] || "Student",
        lastName: parts.slice(1).join(" ") || "",
        email,
        isLoggedIn: true,
        profileCompleted: !!parsedProfile?.isCompleted,
        profile: parsedProfile,
      });
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    syncUser();
  }, [syncUser]);

  const sendCode = async (email: string, name?: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch(`${API_BASE}/study/auth/send-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), name }),
      });
      const data = await res.json();
      return { success: res.ok, message: data.message };
    } catch (err: any) {
      return { success: false, message: err.message || "Failed to send code." };
    }
  };

  const verifyEmailCode = async (code: string): Promise<boolean> => {
    try {
      const email = user?.email || (typeof window !== "undefined" ? localStorage.getItem("dellics_user_email") : null);
      if (!email) return false;

      const res = await fetch(`${API_BASE}/study/auth/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), code: code.trim() }),
      });
      const data = await res.json();
      return !!data.success;
    } catch {
      return false;
    }
  };

  const login = async (email: string, customName?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const res = await fetch(`${API_BASE}/study/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.message || "Login failed. Please check credentials." };
      }

      localStorage.setItem("dellics_user_email", cleanEmail);
      if (data.user?.name) {
        localStorage.setItem("dellics_user_name", data.user.name);
      }

      await syncUser();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error during login." };
    }
  };

  const signup = async (data: { firstName: string; lastName: string; email: string; phone?: string; code?: string }): Promise<{ success: boolean; error?: string }> => {
    try {
      const cleanEmail = data.email.trim().toLowerCase();
      const res = await fetch(`${API_BASE}/study/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: cleanEmail,
          phone: data.phone,
          code: data.code,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        return { success: false, error: json.message || "Signup failed." };
      }

      localStorage.setItem("dellics_user_email", cleanEmail);
      localStorage.setItem("dellics_user_name", `${data.firstName} ${data.lastName}`.trim());

      await syncUser();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error during signup." };
    }
  };

  const saveProfile = async (newProfileData: Partial<StudentProfile>): Promise<{ success: boolean; error?: string }> => {
    try {
      const targetEmail = (newProfileData.email || user?.email || localStorage.getItem("dellics_user_email") || "").trim().toLowerCase();
      if (!targetEmail) {
        return { success: false, error: "Email address is missing." };
      }

      const existingProfile = user?.profile || {};
      const updatedProfile: StudentProfile = {
        ...existingProfile,
        ...newProfileData,
        email: targetEmail,
        isCompleted: true,
        isVerified: true,
      } as StudentProfile;

      // Save to backend database API
      const res = await fetch(`${API_BASE}/study/onboarding`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: targetEmail,
          profile: updatedProfile,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json();
        return { success: false, error: errJson.message || "Failed to save profile." };
      }

      // Update local storage cache
      localStorage.setItem("dellics_user_email", targetEmail);
      localStorage.setItem("dellics_student_profile", JSON.stringify(updatedProfile));
      if (updatedProfile.firstName) {
        localStorage.setItem("dellics_user_name", `${updatedProfile.firstName} ${updatedProfile.lastName || ""}`.trim());
      }

      await syncUser();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error saving profile." };
    }
  };

  const logout = () => {
    localStorage.removeItem("dellics_user_email");
    localStorage.removeItem("dellics_user_name");
    localStorage.removeItem("dellics_student_profile");
    localStorage.removeItem("dellics_user_phone");
    setUser(null);
  };

  const refreshPortalData = async () => {
    await syncUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        login,
        signup,
        logout,
        saveProfile,
        verifyEmailCode,
        sendCode,
        refreshPortalData,
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
