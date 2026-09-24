export interface SendAdminOtpEmailParams {
  to: string;
  name?: string;
  otpCode: string;
}

export function buildAdminOtpHtml({
  name,
  otpCode,
}: {
  name?: string;
  otpCode: string;
}): string {
  const displayName = name ? name.trim() : "Admin";
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <title>Your Dellics Admin Login Code</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;-webkit-font-smoothing:antialiased;mso-line-height-rule:exactly;">

  <!-- Inbox preview line (hidden) -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">Your 6-digit access code for the Dellics Operations Portal is ${otpCode}.&#847; &#847; &#847; &#847; &#847; &#847; &#847;</div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f8fafc;">
    <tr>
      <td align="center" style="padding:32px 16px 48px;">
        <!--[if mso]><table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0"><tr><td><![endif]-->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:580px;">
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
          <tr>
            <td style="background-color:#ffffff;border:1px solid #e2e8f0;border-radius:4px;overflow:hidden;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr><td style="height:3px;background-color:#ea580c;font-size:0;line-height:0;">&nbsp;</td></tr>
              </table>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding:44px 44px 40px;">
                    <p style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:2px;color:#94a3b8;text-transform:uppercase;">Admin Security</p>
                    <h1 style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:28px;font-weight:800;color:#0f172a;line-height:1.25;letter-spacing:-0.5px;">Portal Access Code</h1>
                    <p style="margin:0 0 24px;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#475569;line-height:1.75;">
                      Hello ${displayName},<br><br>
                      Enter the 6-digit code below to securely access the Dellics Travels Operations Portal. This code expires in 5 minutes.
                    </p>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="background-color:#f1f5f9;border:1px solid #e2e8f0;border-radius:6px;padding:16px 24px;text-align:center;">
                          <p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:32px;font-weight:bold;letter-spacing:6px;color:#0f172a;">${otpCode}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 0 0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="text-align:center;">
                    <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#cbd5e1;line-height:1.6;">
                      &copy; ${year} Dellics Travels &middot; IATA Accredited Agency
                    </p>
                    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#e2e8f0;line-height:1.6;">
                      This is an automated security message. Do not share this code with anyone.
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

export function buildAdminForgotPasswordHtml({
  name,
  otpCode,
}: {
  name?: string;
  otpCode: string;
}): string {
  const displayName = name ? name.trim() : "Admin";
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <title>Reset Your Dellics Admin Password</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;-webkit-font-smoothing:antialiased;mso-line-height-rule:exactly;">

  <!-- Inbox preview line (hidden) -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">Your 6-digit access code for resetting your password is ${otpCode}.&#847; &#847; &#847; &#847; &#847; &#847; &#847;</div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f8fafc;">
    <tr>
      <td align="center" style="padding:32px 16px 48px;">
        <!--[if mso]><table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0"><tr><td><![endif]-->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:580px;">
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
          <tr>
            <td style="background-color:#ffffff;border:1px solid #e2e8f0;border-radius:4px;overflow:hidden;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr><td style="height:3px;background-color:#ea580c;font-size:0;line-height:0;">&nbsp;</td></tr>
              </table>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding:44px 44px 40px;">
                    <p style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:2px;color:#94a3b8;text-transform:uppercase;">Admin Security</p>
                    <h1 style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:28px;font-weight:800;color:#0f172a;line-height:1.25;letter-spacing:-0.5px;">Password Reset Request</h1>
                    <p style="margin:0 0 24px;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#475569;line-height:1.75;">
                      Hello ${displayName},<br><br>
                      We received a request to reset your password for the Dellics Travels Operations Portal. Enter the 6-digit code below to set a new password. This code expires in 15 minutes.
                    </p>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="background-color:#f1f5f9;border:1px solid #e2e8f0;border-radius:6px;padding:16px 24px;text-align:center;">
                          <p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:32px;font-weight:bold;letter-spacing:6px;color:#0f172a;">${otpCode}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 0 0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="text-align:center;">
                    <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#cbd5e1;line-height:1.6;">
                      &copy; ${year} Dellics Travels &middot; IATA Accredited Agency
                    </p>
                    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#e2e8f0;line-height:1.6;">
                      If you did not request a password reset, you can safely ignore this email.
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
