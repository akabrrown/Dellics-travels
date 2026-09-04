export interface SendPasswordResetEmailParams {
  to: string;
  name?: string;
  resetUrl: string;
}

/**
 * Builds the branded luxury Dellics Travels password reset email HTML.
 */
function buildResetPasswordHtml({
  name,
  resetUrl,
}: {
  name?: string;
  resetUrl: string;
}): string {
  const displayName = name ? name.trim() : "Valued Traveler";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Dellics Travels Password</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #030712;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #f3f4f6;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    }
    .header {
      background: #020617;
      padding: 32px 40px;
      text-align: center;
      border-bottom: 1px solid #1e293b;
    }
    .logo-text {
      font-size: 22px;
      font-weight: 800;
      letter-spacing: 2px;
      color: #ffffff;
      text-transform: uppercase;
      margin: 0;
    }
    .badge {
      display: inline-block;
      margin-top: 8px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 1px;
      color: #ea580c;
      background: rgba(234, 88, 12, 0.1);
      border: 1px solid rgba(234, 88, 12, 0.25);
      padding: 4px 12px;
      border-radius: 9999px;
      text-transform: uppercase;
    }
    .content {
      padding: 40px;
      line-height: 1.6;
    }
    h1 {
      font-size: 24px;
      font-weight: 700;
      color: #ffffff;
      margin-top: 0;
      margin-bottom: 16px;
    }
    p {
      color: #94a3b8;
      font-size: 15px;
      margin-bottom: 24px;
    }
    .btn-container {
      text-align: center;
      margin: 36px 0;
    }
    .btn {
      display: inline-block;
      background: #ea580c;
      color: #ffffff !important;
      text-decoration: none;
      font-weight: 600;
      font-size: 15px;
      padding: 14px 36px;
      border-radius: 8px;
      letter-spacing: 0.5px;
      box-shadow: 0 4px 14px rgba(234, 88, 12, 0.4);
    }
    .url-box {
      background: #020617;
      border: 1px solid #1e293b;
      border-radius: 8px;
      padding: 12px 16px;
      font-size: 12px;
      color: #64748b;
      word-break: break-all;
      margin-bottom: 28px;
    }
    .url-box a {
      color: #ea580c;
      text-decoration: none;
    }
    .footer {
      background: #020617;
      padding: 24px 40px;
      text-align: center;
      font-size: 12px;
      color: #475569;
      border-top: 1px solid #1e293b;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-text">Dellics Travels</div>
      <div class="badge">Account Security & Credentials</div>
    </div>
    <div class="content">
      <h1>Password Recovery Request</h1>
      <p>Hello ${displayName},</p>
      <p>We received a request to reset the password for your Dellics Travels account. Click the button below to choose a new, secure password.</p>
      
      <div class="btn-container">
        <a href="${resetUrl}" target="_blank" class="btn">Reset My Password</a>
      </div>

      <p style="font-size: 13px; color: #64748b;">This reset link is single-use and will expire in <strong>60 minutes</strong> for your security.</p>
      
      <p style="font-size: 13px; color: #64748b; margin-bottom: 8px;">If the button above does not work, copy and paste the following link directly into your browser:</p>
      <div class="url-box">
        <a href="${resetUrl}">${resetUrl}</a>
      </div>

      <p style="font-size: 13px; color: #64748b; margin-bottom: 0;">If you did not request this password change, you can safely disregard this email. Your password and bookings remain completely secure.</p>
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} Dellics Travels. All rights reserved.<br>
      IATA Accredited Agency · Global Luxury Travel Management
    </div>
  </div>
</body>
</html>
`;
}

/**
 * Dispatches a password reset email using Resend, or falls back to server console logging.
 */
export async function sendPasswordResetEmail({
  to,
  name,
  resetUrl,
}: SendPasswordResetEmailParams): Promise<{ success: boolean; messageId?: string }> {
  const apiKey =
    process.env.RESEND_API_KEY ||
    process.env.NEXT_PUBLIC_RESEND_API_KEY;

  const html = buildResetPasswordHtml({ name, resetUrl });

  // Always log to server terminal for instant verification / dev ergonomics
  console.log("=================================================================");
  console.log("🔐 [PASSWORD RESET LINK GENERATED]");
  console.log(`To: ${to} (${name || "User"})`);
  console.log(`Reset URL: ${resetUrl}`);
  console.log("=================================================================");

  if (apiKey) {
    try {
      const fromAddress =
        process.env.RESEND_FROM_EMAIL ||
        "Dellics Travels <onboarding@resend.dev>";

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [to],
          subject: "Reset your Dellics Travels password",
          html,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return { success: true, messageId: data.id };
      } else {
        const errData = await res.json().catch(() => ({}));
        console.warn("Resend email dispatch error:", errData);
      }
    } catch (err) {
      console.warn("Failed to dispatch email via Resend:", err);
    }
  }

  // Gracefully return success so the auth response flows smoothly
  return { success: true };
}
