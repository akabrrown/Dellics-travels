import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@supabase/supabase-js";
import { verifyPassword } from "@/lib/password";
import { getClientIp, rateLimiters } from "@/lib/rate-limit";
import {
  parseUserAgent,
  computeDeviceFingerprint,
  generateVerificationCode,
  extractCoarseLocation,
} from "@/lib/device";
import crypto from "crypto";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://gfypumkjomlvvpiiwdfq.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const body = await req.json().catch(() => ({}));
    const { email, password, deviceEntropy } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const userAgent = req.headers.get("user-agent") || "";
    const parsedDevice = parseUserAgent(userAgent);
    const deviceFingerprint = computeDeviceFingerprint(userAgent, deviceEntropy);
    const location = extractCoarseLocation(req.headers);

    // 1. Verify user credentials against PostgreSQL database
    const dbUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: {
        trips: true,
        memberships: true,
        reviews: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const userRecord = dbUser as typeof dbUser & { password_hash?: string | null };
    if (userRecord.password_hash) {
      const isValid = verifyPassword(password, userRecord.password_hash);
      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 },
        );
      }
    }

    // 2. Query active trusted device for "One Device One Account" policy
    let activeDevices: any[] = [];
    try {
      activeDevices = await prisma.$queryRawUnsafe(`
        SELECT * FROM public."UserDevice"
        WHERE "user_id" = '${dbUser.id}' AND "is_active" = true
        ORDER BY "last_active_at" DESC;
      `);
    } catch (e) {
      console.warn("UserDevice query notice:", e);
    }

    // If no active device exists on account, register this device as primary and proceed
    if (!activeDevices || activeDevices.length === 0) {
      try {
        await prisma.$executeRawUnsafe(`
          INSERT INTO public."UserDevice" (
            "id", "user_id", "device_fingerprint", "device_name", "browser", "os", "ip_address", "location", "is_primary", "is_active", "last_active_at", "created_at", "updated_at"
          ) VALUES (
            gen_random_uuid(), '${dbUser.id}', '${deviceFingerprint}', '${parsedDevice.deviceName.replace(/'/g, "''")}', '${parsedDevice.browser}', '${parsedDevice.os}', '${ip}', '${location.replace(/'/g, "''")}', true, true, NOW(), NOW(), NOW()
          );
        `);
      } catch (devErr) {
        console.warn("Device registration notice:", devErr);
      }

      return NextResponse.json({
        success: true,
        user: dbUser,
        deviceStatus: "PRIMARY_REGISTERED",
      });
    }

    // Check if the current device matches the user's active device
    const matchingDevice = activeDevices.find(
      (d) => d.device_fingerprint === deviceFingerprint
    );

    if (matchingDevice) {
      // Recognized primary device: update last active timestamp
      try {
        await prisma.$executeRawUnsafe(`
          UPDATE public."UserDevice"
          SET "last_active_at" = NOW(), "ip_address" = '${ip}', "location" = '${location.replace(/'/g, "''")}'
          WHERE "id" = '${matchingDevice.id}'::uuid;
        `);
      } catch (updErr) {
        console.warn("Device timestamp update notice:", updErr);
      }

      return NextResponse.json({
        success: true,
        user: dbUser,
        deviceStatus: "RECOGNIZED_DEVICE",
      });
    }

    // 3. DIFFERENT DEVICE DETECTED -> Trigger Google/Telegram style cross-device verification challenge!
    const primaryDevice = activeDevices[0];
    const challengeToken = crypto.randomUUID();
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

    // Invalidate prior pending challenges for this user
    try {
      await prisma.$executeRawUnsafe(`
        UPDATE public."DeviceLoginChallenge"
        SET "status" = 'EXPIRED', "updated_at" = NOW()
        WHERE "user_id" = '${dbUser.id}' AND "status" = 'PENDING';
      `);

      await prisma.$executeRawUnsafe(`
        INSERT INTO public."DeviceLoginChallenge" (
          "id", "user_id", "challenge_token", "device_fingerprint", "device_name", "browser", "os", "ip_address", "location", "status", "verification_code", "expires_at", "created_at", "updated_at"
        ) VALUES (
          gen_random_uuid(), '${dbUser.id}', '${challengeToken}', '${deviceFingerprint}', '${parsedDevice.deviceName.replace(/'/g, "''")}', '${parsedDevice.browser}', '${parsedDevice.os}', '${ip}', '${location.replace(/'/g, "''")}', 'PENDING', '${verificationCode}', '${expiresAt.toISOString()}', NOW(), NOW()
        );
      `);
    } catch (chErr) {
      console.error("Challenge creation error:", chErr);
    }

    return NextResponse.json({
      requiresDeviceApproval: true,
      challengeToken,
      verificationCode,
      primaryDeviceName: primaryDevice.device_name || "Your Primary Device",
      attemptedDevice: parsedDevice.deviceName,
      attemptedLocation: location,
      expiresInSeconds: 300,
      userId: dbUser.id,
    });
  } catch (error: any) {
    console.error("Login verification error:", error);
    return NextResponse.json(
      { error: error.message || "Authentication service error" },
      { status: 500 },
    );
  }
}
