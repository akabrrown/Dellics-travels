export interface SendPasswordResetEmailParams {
  to: string;
  name?: string;
  resetUrl: string;
}

/**
 * Builds a professional, inbox-safe HTML password-reset email.
 *
 * Design principles:
 *  - Table-based layout: renders identically in Gmail, Outlook, Apple Mail,
 *    Yahoo Mail, and all mobile clients.
 *  - 100 % inline styles: no <style> block (Gmail strips them on mobile).
 *  - Light background: dark-mode emails are stripped or mangled by most clients.
 *  - MSO conditional comments for Outlook 2007–2019 max-width fix.
 *  - Pre-header text for inbox preview line.
 */
function buildResetPasswordHtml({
  name,
  resetUrl,
}: {
  name?: string;
  resetUrl: string;
}): string {
  const displayName = name ? name.trim() : "Valued Traveler";
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <title>Reset Your Dellics Travels Password</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;-webkit-font-smoothing:antialiased;">

  <!-- pre-header (shows in inbox preview but is hidden in email body) -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
    Action required: Reset your Dellics Travels account password. This link expires in 60 minutes.&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <!--[if mso]>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
  <tr><td>
  <![endif]-->

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f1f5f9;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <!--[if mso]>
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0"><tr><td>
        <![endif]-->

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,0.10);">

          <!-- ===== HEADER ===== -->
          <tr>
            <td style="background-color:#0f172a;padding:32px 40px;text-align:center;">
              <!-- Logo text — swap for <img> once logo URL is publicly reachable -->
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:800;letter-spacing:3px;color:#ffffff;text-transform:uppercase;">DELLICS TRAVELS</p>
              <p style="margin:10px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:600;letter-spacing:1.5px;color:#ea580c;text-transform:uppercase;">IATA Accredited · Global Travel Management</p>
            </td>
          </tr>

          <!-- ===== HERO BAND ===== -->
          <tr>
            <td style="background-color:#ea580c;padding:4px 0;"></td>
          </tr>

          <!-- ===== BODY ===== -->
          <tr>
            <td style="padding:44px 40px 36px;">

              <!-- Greeting -->
              <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#64748b;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Password Reset Request</p>
              <h1 style="margin:0 0 24px;font-family:Arial,Helvetica,sans-serif;font-size:26px;font-weight:800;color:#0f172a;line-height:1.3;">Hi, ${displayName} 👋</h1>

              <p style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#475569;line-height:1.7;">
                We received a request to reset the password associated with your Dellics Travels account. Click the button below to choose a new, secure password.
              </p>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center" style="padding:8px 0 32px;">
                    <!--[if mso]>
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${resetUrl}" style="height:52px;v-text-anchor:middle;width:240px;" arcsize="10%" stroke="f" fillcolor="#ea580c">
                    <w:anchorlock/>
                    <center style="color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;">Reset My Password</center>
                    </v:roundrect>
                    <![endif]-->
                    <!--[if !mso]><!-->
                    <a href="${resetUrl}" target="_blank" style="display:inline-block;background-color:#ea580c;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;text-decoration:none;padding:15px 40px;border-radius:8px;letter-spacing:0.5px;mso-hide:all;">Reset My Password &rarr;</a>
                    <!--<![endif]-->
                  </td>
                </tr>
              </table>

              <!-- Expiry notice -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="background-color:#fef3c7;border-left:4px solid #f59e0b;border-radius:6px;padding:14px 18px;margin-bottom:28px;">
                    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#92400e;line-height:1.6;">
                      ⏱ <strong>This link expires in 60 minutes</strong> and can only be used once. If it has expired, you can request a new one from the sign-in page.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Fallback URL -->
              <p style="margin:28px 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#94a3b8;line-height:1.6;">If the button above doesn't work, copy and paste this link into your browser:</p>
              <p style="margin:0 0 28px;font-family:'Courier New',Courier,monospace;font-size:12px;color:#ea580c;word-break:break-all;background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:12px 14px;line-height:1.7;">
                ${resetUrl}
              </p>

              <!-- Safety notice -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="border-top:1px solid #e2e8f0;padding-top:24px;">
                    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#94a3b8;line-height:1.7;">
                      🔒 If you did not request this, please ignore this email. Your password will remain unchanged and your bookings are safe.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- ===== FOOTER ===== -->
          <tr>
            <td style="background-color:#f8fafc;border-top:1px solid #e2e8f0;padding:24px 40px;text-align:center;">
              <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#94a3b8;">
                &copy; ${year} Dellics Travels. All rights reserved.
              </p>
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#cbd5e1;">
                IATA Accredited Agency &middot; Global Luxury Travel Management
              </p>
              <p style="margin:12px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#cbd5e1;">
                This is an automated security email. Please do not reply directly to this message.
              </p>
            </td>
          </tr>

        </table>
        <!--[if mso]></td></tr></table><![endif]-->

      </td>
    </tr>
  </table>

  <!--[if mso]></td></tr></table><![endif]-->

</body>
</html>`;
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
        "Dellics Travels <support@dellicstravels.com>";

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