export interface SendPasswordResetEmailParams {
  to: string;
  name?: string;
  resetUrl: string;
}

function buildResetPasswordHtml({
  name,
  resetUrl,
}: {
  name?: string;
  resetUrl: string;
}): string {
  const displayName = name ? name.trim() : "Traveler";
  const year = new Date().getFullYear();
  // Truncate the URL at 72 chars so it fits cleanly in monospace fallback block
  const shortUrl = resetUrl.length > 72 ? resetUrl.slice(0, 69) + "..." : resetUrl;

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <title>Reset your password — Dellics Travels</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;-webkit-font-smoothing:antialiased;mso-line-height-rule:exactly;">

  <!-- Inbox preview line (hidden) -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">Reset your Dellics Travels password. This link is valid for 60 minutes.&#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847;</div>

  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f8fafc;">
    <tr>
      <td align="center" style="padding:32px 16px 48px;">

        <!--[if mso]><table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0"><tr><td><![endif]-->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:580px;">

          <!-- ── TOP BRAND BAR ── -->
          <tr>
            <td style="padding-bottom:24px;text-align:left;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="border-left:3px solid #ea580c;padding-left:12px;">
                    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:2.5px;color:#94a3b8;text-transform:uppercase;line-height:1;">DELLICS TRAVELS</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── MAIN CARD ── -->
          <tr>
            <td style="background-color:#ffffff;border:1px solid #e2e8f0;border-radius:4px;overflow:hidden;">

              <!-- Card top accent line -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="height:3px;background-color:#ea580c;font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>

              <!-- Card body -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding:44px 44px 40px;">

                    <!-- Section label -->
                    <p style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:2px;color:#94a3b8;text-transform:uppercase;">Account Security</p>

                    <!-- Headline -->
                    <h1 style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:28px;font-weight:800;color:#0f172a;line-height:1.25;letter-spacing:-0.5px;">Password reset<br>requested</h1>

                    <!-- Body -->
                    <p style="margin:0 0 32px;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#475569;line-height:1.75;">
                      Hello ${displayName},<br><br>
                      We received a request to reset the password for your Dellics Travels account. Use the button below to set a new password. If you did not make this request, you can ignore this email.
                    </p>

                    <!-- CTA -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="border-radius:3px;background-color:#ea580c;">
                          <!--[if mso]>
                          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"
                            href="${resetUrl}" style="height:48px;v-text-anchor:middle;width:200px;" arcsize="6%" stroke="f" fillcolor="#ea580c">
                          <w:anchorlock/>
                          <center style="color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;letter-spacing:0.5px;">Reset password</center>
                          </v:roundrect>
                          <![endif]-->
                          <!--[if !mso]><!-->
                          <a href="${resetUrl}" target="_blank" style="display:inline-block;padding:14px 32px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.5px;mso-hide:all;">Reset password</a>
                          <!--<![endif]-->
                        </td>
                      </tr>
                    </table>

                    <!-- Expiry -->
                    <p style="margin:28px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#94a3b8;line-height:1.6;">
                      This link expires in <span style="color:#0f172a;font-weight:700;">60 minutes</span> and is single-use.
                    </p>

                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding:0 44px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr><td style="height:1px;background-color:#f1f5f9;font-size:0;line-height:0;">&nbsp;</td></tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Fallback URL block -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding:24px 44px 40px;">
                    <p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#94a3b8;line-height:1.5;">Button not working? Copy and paste this link into your browser:</p>
                    <p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:11px;color:#64748b;word-break:break-all;line-height:1.7;background-color:#f8fafc;border-left:2px solid #e2e8f0;padding:10px 12px;">${shortUrl}</p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- ── FOOTER ── -->
          <tr>
            <td style="padding:28px 0 0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="text-align:center;">
                    <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#cbd5e1;line-height:1.6;">
                      &copy; ${year} Dellics Travels &middot; IATA Accredited Agency
                    </p>
                    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#e2e8f0;line-height:1.6;">
                      This is an automated message. Do not reply to this email.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
        <!--[if mso]></td></tr></table><![endif]-->

      </td>
    </tr>
  </table>

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

  console.log("=================================================================");
  console.log("[PASSWORD RESET LINK GENERATED]");
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

  return { success: true };
}