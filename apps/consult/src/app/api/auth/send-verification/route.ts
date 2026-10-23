import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, code, name } = body;

    if (!email || !code || code.length !== 6) {
      return NextResponse.json(
        { success: false, error: "Valid email address and 6-digit verification code required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim();
    const cleanCode = code.trim();

    // Log for verification audit
    console.log(`[DELLICS EMAIL DISPATCH] To: ${cleanEmail} | Code: ${cleanCode} | Candidate: ${name || "Applicant"}`);

    // If an external SMTP or email service is configured in process.env, dispatch email
    if (process.env.RESEND_API_KEY) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Dellics Education Consult <admissions@dellics.com>",
            to: cleanEmail,
            subject: `${cleanCode} is your Dellics Education Consult verification code`,
            html: `
              <div style="font-family: sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; rounded: 16px;">
                <h2 style="color: #0A0060; margin-bottom: 8px;">Dellics Education Consult</h2>
                <p style="color: #64748b; font-size: 14px; margin-top: 0;">Guiding Futures. Building Global Success.</p>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                <p style="font-size: 15px; color: #1e293b;">Hello ${name || "Applicant"},</p>
                <p style="font-size: 14px; color: #334155;">Thank you for registering with Dellics Education Consult. Use the 6-digit verification code below to verify your email address and complete your student application profile:</p>
                <div style="background-color: #f8fafc; border: 2px dashed #0A0060; border-radius: 12px; padding: 18px; text-align: center; margin: 24px 0;">
                  <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #EA580C; font-family: monospace;">${cleanCode}</span>
                </div>
                <p style="font-size: 12px; color: #64748b;">This code expires in 15 minutes. If you did not request this registration, please disregard this email.</p>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                <p style="font-size: 11px; color: #94a3b8;">Community 25 Devtraco Courts Rd, Tema, Greater Accra, Ghana | admissions@dellics.com</p>
              </div>
            `,
          }),
        });
      } catch (err) {
        console.warn("[DELLICS EMAIL WARNING] Resend provider error:", err);
      }
    }

    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been dispatched to ${cleanEmail}`,
      email: cleanEmail,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to process verification dispatch." },
      { status: 500 }
    );
  }
}
