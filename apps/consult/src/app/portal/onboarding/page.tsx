import { Metadata } from "next";
import { StudentRegistrationForm } from "@/components/onboarding/StudentRegistrationForm";

export const metadata: Metadata = {
  title: "Student Registration Form | Dellics Education Consult",
  description: "Complete your official Dellics Education Consult student profile to begin university placements, test preparation, and visa counseling.",
};

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-10 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <StudentRegistrationForm />
      </div>
    </div>
  );
}
