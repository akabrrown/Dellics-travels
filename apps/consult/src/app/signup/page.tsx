"use client";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <main>
      

  {/*  TOP BAR  */}
  

  {/*  MAIN AUTH CONTAINER  */}
  <div className="auth-container">
    <div className="auth-card">
      <div className="auth-card-top-accent"></div>

      {/*  Alert Notification Banner  */}
      <div id="auth-alert" className="alert-banner" role="alert"></div>

      {/*  STEP 1: INITIAL REGISTRATION FORM  */}
      <div id="signup-form-section">
        <h1 className="auth-title">Create your Dellics account</h1>
        <p className="auth-subtitle">Start your study-abroad journey with Dellics Education Consult.</p>

        <form id="signup-form" className="auth-form" noValidate onSubmit={handleSubmit}>
          <div className="form-row-2col">
            <div className="input-field-wrap">
              <label htmlFor="first-name" className="input-label">First Name</label>
              <input type="text" id="first-name" className="input-box" placeholder="Enter your first name" required />
            </div>
            <div className="input-field-wrap">
              <label htmlFor="last-name" className="input-label">Last Name</label>
              <input type="text" id="last-name" className="input-box" placeholder="Enter your last name" required />
            </div>
          </div>

          <div className="input-field-wrap">
            <label htmlFor="email" className="input-label">Email Address</label>
            <input type="email" id="email" className="input-box" placeholder="Enter your email address" required />
          </div>

          <div className="input-field-wrap">
            <label htmlFor="phone" className="input-label">Phone Number</label>
            <input type="tel" id="phone" className="input-box" placeholder="+233 …" required />
          </div>

          <div className="form-row-2col">
            <div className="input-field-wrap">
              <label htmlFor="password" className="input-label">Password</label>
              <div className="input-password-wrap">
                <input type="password" id="password" className="input-box" placeholder="Create a password" required minLength={6} />
                <button type="button" className="password-toggle-btn" id="toggle-pwd" aria-label="Toggle password visibility">
                  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
            </div>
            <div className="input-field-wrap">
              <label htmlFor="confirm-password" className="input-label">Confirm Password</label>
              <div className="input-password-wrap">
                <input type="password" id="confirm-password" className="input-box" placeholder="Re-enter your password" required minLength={6} />
                <button type="button" className="password-toggle-btn" id="toggle-confirm-pwd" aria-label="Toggle password visibility">
                  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
            </div>
          </div>

          <label className="checkbox-wrap">
            <input type="checkbox" id="terms-agree" required />
            <span>I agree to the <Link href="/about" target="_blank">Terms of Service</Link> and <Link href="/about" target="_blank">Privacy Policy</Link></span>
          </label>

          <button type="submit" className="btn-submit-auth" id="btn-create-account">
            Create Account
          </button>
        </form>

        <div className="auth-footer-prompt">
          Already have an account? <Link href="/login">Log in</Link>
        </div>
      </div>

      {/*  STEP 2: EMAIL VERIFICATION VIEW (Post Registration)  */}
      <div id="verification-section" className="verification-view">
        <div className="verification-icon">
          <svg width={34} height={34} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect width={20} height={16} x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
        </div>

        <h2 className="auth-title" style={{ fontSize: "1.5rem" }}>Verify your email</h2>
        <p className="auth-subtitle" style={{ marginBottom: "8px" }}>We've sent a verification link to your email address.</p>
        
        <div className="verification-email-badge" id="display-registered-email">student@example.com</div>

        <p style={{ fontSize: "0.9rem", color: "#475569", lineHeight: "1.6", marginBottom: "24px" }}>
          Please verify your email to continue. Click below to confirm and proceed to complete your student profile.
        </p>

        <button type="button" className="btn-submit-auth" id="btn-proceed-profile">
          Continue to Complete Profile &#8594;
        </button>

        <div style={{ marginTop: "14px" }}>
          <button type="button" className="btn-resend" id="btn-resend-email">
            Resend verification email
          </button>
        </div>
      </div>

    </div>
  </div>

  {/*  FOOTER  */}
  

  {/*  Store Script & Auth Handler  */}
  
  

    </main>
  );
}
