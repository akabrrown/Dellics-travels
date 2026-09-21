import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  return (
    <main>
      

  {/*  TOP BAR  */}
  

  {/*  MAIN AUTH CONTAINER  */}
  <div className="auth-container">
    <div className="auth-card">
      <div className="auth-card-top-accent"></div>

      {/*  Alert Notification Banner  */}
      <div id="auth-alert" className="alert-banner" role="alert"></div>

      {/*  1. STANDARD LOGIN VIEW  */}
      <div id="login-view">
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to continue your Dellics journey.</p>

        {/*  Ecosystem Notice  */}
        <div className="ecosystem-notice-card">
          <div className="ecosystem-notice-icon">✈️</div>
          <div className="ecosystem-notice-text">
            <strong>Already have a Dellics account?</strong> Log in to access your Education and Travel services with one central identity.
          </div>
        </div>

        <form id="login-form" className="auth-form" noValidate>
          <div className="input-field-wrap">
            <label htmlFor="login-email" className="input-label">Email Address</label>
            <input type="email" id="login-email" className="input-box" placeholder="Enter your email" required />
          </div>

          <div className="input-field-wrap">
            <div className="input-label-row">
              <label htmlFor="login-password" className="input-label">Password</label>
              <button type="button" className="forgot-link" id="btn-show-forgot">Forgot password?</button>
            </div>
            <div className="input-password-wrap">
              <input type="password" id="login-password" className="input-box" placeholder="Enter your password" required />
              <button type="button" className="password-toggle-btn" id="toggle-login-pwd" aria-label="Toggle password visibility">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
          </div>

          <button type="submit" className="btn-submit-auth" id="btn-login-submit">
            Log In
          </button>

          <div className="divider-row">
            <span className="divider-text">Or</span>
          </div>

          <button type="button" className="btn-google" id="btn-google-login">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17Z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24Z"/><path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.97 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"/></svg>
            <span>Continue with Google</span>
          </button>
        </form>

        {/*  Quick Demo Switcher  */}
        <div className="demo-helper-bar">
          <span className="demo-helper-label">Quick Testing:</span>
          <div className="demo-btn-group">
            <button type="button" className="btn-demo-quick" id="btn-quick-student">Demo Student</button>
            <button type="button" className="btn-demo-quick" id="btn-quick-admin">Admin/Consultant</button>
          </div>
        </div>

        <div className="auth-footer-prompt">
          Don't have an account? <a href="/signup">Create one</a>
        </div>
      </div>

      {/*  2. FORGOT PASSWORD VIEW  */}
      <div id="forgot-view" className="forgot-view">
        <h2 className="auth-title">Reset your password</h2>
        <p className="auth-subtitle">Enter the email address associated with your Dellics account.</p>

        <form id="forgot-form" className="auth-form" noValidate>
          <div className="input-field-wrap">
            <label htmlFor="reset-email" className="input-label">Email Address</label>
            <input type="email" id="reset-email" className="input-box" placeholder="Enter your registered email" required />
          </div>

          <button type="submit" className="btn-submit-auth" id="btn-reset-submit">
            Send Reset Link
          </button>
        </form>

        <div className="auth-footer-prompt">
          Remember your password? <a href="#" id="btn-back-to-login">Back to Log In</a>
        </div>
      </div>

    </div>
  </div>

  {/*  FOOTER  */}
  

  {/*  Store Script & Auth Handler  */}
  
  

    </main>
  );
}
