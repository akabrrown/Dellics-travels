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
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  isLoggedIn: boolean;
  profileCompleted: boolean;
  profile?: StudentProfile;
}

interface AuthContextType {
  user: StudentUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, name?: string) => void;
  signup: (data: { firstName: string; lastName: string; email: string; phone?: string }) => void;
  logout: () => void;
  saveProfile: (profile: Partial<StudentProfile>) => void;
  verifyEmailCode: (code: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_CHANGE_EVENT = "dellics_auth_change";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<StudentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const syncUserFromStorage = useCallback(() => {
    try {
      const email = localStorage.getItem("dellics_user_email");
      const name = localStorage.getItem("dellics_user_name");
      const profileStr = localStorage.getItem("dellics_student_profile");

      if (email) {
        let profile: StudentProfile | undefined;
        let profileCompleted = false;

        if (profileStr) {
          try {
            profile = JSON.parse(profileStr);
            profileCompleted = !!profile?.isCompleted;
          } catch (e) {}
        }

        const nameParts = (name || email.split("@")[0] || "Sam").split(" ");
        const firstName = nameParts[0] || "Sam";
        const lastName = nameParts.slice(1).join(" ") || "Nothing";

        setUser({
          name: name || `${firstName} ${lastName}`.trim(),
          firstName,
          lastName,
          email,
          isLoggedIn: true,
          profileCompleted,
          profile,
        });
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    syncUserFromStorage();

    const handleStorage = () => syncUserFromStorage();
    const handleCustom = () => syncUserFromStorage();

    window.addEventListener("storage", handleStorage);
    window.addEventListener(AUTH_CHANGE_EVENT, handleCustom);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(AUTH_CHANGE_EVENT, handleCustom);
    };
  }, [syncUserFromStorage]);

  const notifyChange = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
    }
  };

  const login = (email: string, customName?: string) => {
    try {
      localStorage.setItem("dellics_user_email", email);
      const name = customName || (email.split("@")[0] || "Sam").replace(/[._-]/g, " ");
      const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
      localStorage.setItem("dellics_user_name", formattedName);
      syncUserFromStorage();
      notifyChange();
    } catch (e) {}
  };

  const signup = (data: { firstName: string; lastName: string; email: string; phone?: string }) => {
    try {
      localStorage.setItem("dellics_user_email", data.email);
      const fullName = `${data.firstName} ${data.lastName}`.trim() || data.firstName || "Sam";
      localStorage.setItem("dellics_user_name", fullName);
      if (data.phone) {
        localStorage.setItem("dellics_user_phone", data.phone);
      }
      syncUserFromStorage();
      notifyChange();
    } catch (e) {}
  };

  const logout = () => {
    try {
      localStorage.removeItem("dellics_user_email");
      localStorage.removeItem("dellics_user_name");
      localStorage.removeItem("dellics_student_profile");
      localStorage.removeItem("dellics_user_phone");
      setUser(null);
      notifyChange();
    } catch (e) {}
  };

  const saveProfile = (newProfileData: Partial<StudentProfile>) => {
    try {
      const existingStr = localStorage.getItem("dellics_student_profile");
      const existing = existingStr ? JSON.parse(existingStr) : {};
      const updated: StudentProfile = {
        ...existing,
        ...newProfileData,
        isCompleted: true,
        studentId: existing.studentId || `DEC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        classYear: existing.classYear || "Class of 2028",
      };
      localStorage.setItem("dellics_student_profile", JSON.stringify(updated));
      if (updated.firstName) {
        const fullName = `${updated.firstName} ${updated.lastName || ""}`.trim();
        localStorage.setItem("dellics_user_name", fullName);
      }
      if (updated.email) {
        localStorage.setItem("dellics_user_email", updated.email);
      }
      syncUserFromStorage();
      notifyChange();
    } catch (e) {}
  };

  const verifyEmailCode = (code: string) => {
    // Accepts standard 6-digit mock code (e.g. 729148, 123456, or any 6 digits for testing)
    const clean = code.trim();
    return clean.length === 6 && /^\d{6}$/.test(clean);
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
