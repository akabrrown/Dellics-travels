import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { challengeToken, decision, userId } = body;

    if (!challengeToken || !decision || !['APPROVE', 'DENY'].includes(decision)) {
      return NextResponse.json(
        { error: "Valid challenge token and decision (APPROVE/DENY) are required." },
        { status: 400 },
      );
    }

    const challenges: any[] = await prisma.$queryRawUnsafe(`
      SELECT * FROM public."DeviceLoginChallenge"
      WHERE "challenge_token" = '${challengeToken}'
      LIMIT 1;
    `);

    if (!challenges || challenges.length === 0) {
      return NextResponse.json(
        { error: "Challenge not found or expired." },
        { status: 404 },
      );
    }

    const challenge = challenges[0];

    if (decision === "APPROVE") {
      // 1. Mark challenge approved
      await prisma.$executeRawUnsafe(`
        UPDATE public."DeviceLoginChallenge"
        SET "status" = 'APPROVED', "updated_at" = NOW()
        WHERE "id" = '${challenge.id}'::uuid;
      `);

      // 2. Strict One Device One Account: Retire older devices and activate new device
      await prisma.$executeRawUnsafe(`
        UPDATE public."UserDevice"
        SET "is_active" = false, "updated_at" = NOW()
        WHERE "user_id" = '${challenge.user_id}';
      `);

      await prisma.$executeRawUnsafe(`
        INSERT INTO public."UserDevice" (
          "id", "user_id", "device_fingerprint", "device_name", "browser", "os", "ip_address", "location", "is_primary", "is_active", "last_active_at", "created_at", "updated_at"
        ) VALUES (
          gen_random_uuid(), '${challenge.user_id}', '${challenge.device_fingerprint}', '${challenge.device_name.replace(/'/g, "''")}', '${challenge.browser}', '${challenge.os}', '${challenge.ip_address}', '${challenge.location?.replace(/'/g, "''")}', true, true, NOW(), NOW(), NOW()
        );
      `);

      return NextResponse.json({
        success: true,
        message: "New device approved successfully.",
      });
    } else {
      // User tapped DENY
      await prisma.$executeRawUnsafe(`
        UPDATE public."DeviceLoginChallenge"
        SET "status" = 'DENIED', "updated_at" = NOW()
        WHERE "id" = '${challenge.id}'::uuid;
      `);

      // Optionally dispatch security email alert
      const resendApiKey = process.env.RESEND_API_KEY;
      if (resendApiKey) {
        try {
          const user = await prisma.user.findUnique({
            where: { id: challenge.user_id },
            select: { email: true, name: true },
          });

          if (user) {
            await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${resendApiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                from: process.env.RESEND_FROM_EMAIL || "Dellics Travels <support@dellicstravels.com>",
                to: [user.email],
                subject: "Security Alert: Unauthorized Sign-In Blocked",
                html: `
                  <div style="font-family: sans-serif; background: #030712; color: #f3f4f6; padding: 32px; border-radius: 12px;">
                    <h2 style="color: #ef4444;">Unauthorized Sign-In Attempt Blocked</h2>
                    <p>Hello ${user.name || "Valued Traveler"},</p>
                    <p>You recently denied a sign-in request on your primary device.</p>
                    <div style="background: #111827; padding: 16px; border-radius: 8px; border-left: 4px solid #ef4444;">
                      <p style="margin: 4px 0;"><strong>Device:</strong> ${challenge.device_name}</p>
                      <p style="margin: 4px 0;"><strong>Location:</strong> ${challenge.location || "Unknown"}</p>
                      <p style="margin: 4px 0;"><strong>IP Address:</strong> ${challenge.ip_address || "Hidden"}</p>
                    </div>
                    <p style="margin-top: 16px;">If this was not you, we strongly recommend resetting your password immediately.</p>
                  </div>
                `,
              }),
            });
          }
        } catch (mailErr) {
          console.warn("Security alert email notice:", mailErr);
        }
      }

      return NextResponse.json({
        success: true,
        message: "Sign-in attempt blocked.",
      });
    }
  } catch (error: any) {
    console.error("Challenge response error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process security decision." },
      { status: 500 },
    );
  }
}
