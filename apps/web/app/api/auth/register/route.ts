import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { getClientIp, rateLimiters } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, fullName, phone, password } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 },
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName?.trim() || cleanEmail.split("@")[0];
    const cleanPhone = phone?.trim() || null;

    // 1. Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email address already exists. Please sign in." },
        { status: 409 },
      );
    }

    const passwordHash = password ? hashPassword(password) : null;

    // 2. Create user in public."User"
    const dbUser = await prisma.user.create({
      data: {
        email: cleanEmail,
        name: cleanName,
        phone: cleanPhone,
        password_hash: passwordHash,
        role: "USER",
        membership_tier: "EXPLORER",
      },
    });

    // 3. Automatically sync to Supabase auth.users (so it immediately reflects in Supabase Auth dashboard)
    try {
      const userMeta = JSON.stringify({
        full_name: cleanName,
        name: cleanName,
        phone: cleanPhone || "",
        role: "USER",
        membership_tier: "EXPLORER",
      });

      await prisma.$executeRawUnsafe(`
        INSERT INTO auth.users (
          instance_id,
          id,
          aud,
          role,
          email,
          encrypted_password,
          email_confirmed_at,
          invited_at,
          confirmation_token,
          confirmation_sent_at,
          recovery_token,
          recovery_sent_at,
          email_change_token_new,
          email_change,
          email_change_sent_at,
          last_sign_in_at,
          raw_app_meta_data,
          raw_user_meta_data,
          is_super_admin,
          created_at,
          updated_at,
          phone,
          phone_confirmed_at,
          phone_change,
          phone_change_token,
          phone_change_sent_at,
          email_change_token_current,
          email_change_confirm_status,
          banned_until,
          reauthentication_token,
          reauthentication_sent_at,
          is_sso_user,
          deleted_at
        ) VALUES (
          '00000000-0000-0000-0000-000000000000',
          '${dbUser.id}'::uuid,
          'authenticated',
          'authenticated',
          '${cleanEmail}',
          '$2a$10$placeholderencryptedpasswordhashforemailrecoveryonly0000',
          NOW(),
          NULL,
          '',
          NULL,
          '',
          NULL,
          '',
          '',
          NULL,
          NOW(),
          '{"provider":"email","providers":["email"]}',
          '${userMeta.replace(/'/g, "''")}',
          false,
          NOW(),
          NOW(),
          ${cleanPhone ? `'${cleanPhone}'` : "NULL"},
          ${cleanPhone ? "NOW()" : "NULL"},
          '',
          '',
          NULL,
          '',
          0,
          NULL,
          '',
          NULL,
          false,
          NULL
        )
        ON CONFLICT (id) DO UPDATE SET
          email = EXCLUDED.email,
          raw_user_meta_data = EXCLUDED.raw_user_meta_data,
          updated_at = NOW();
      `);

      await prisma.$executeRawUnsafe(`
        INSERT INTO auth.identities (
          id,
          user_id,
          identity_data,
          provider,
          provider_id,
          last_sign_in_at,
          created_at,
          updated_at
        ) VALUES (
          '${dbUser.id}',
          '${dbUser.id}'::uuid,
          jsonb_build_object('sub', '${dbUser.id}', 'email', '${cleanEmail}'),
          'email',
          '${dbUser.id}',
          NOW(),
          NOW(),
          NOW()
        )
        ON CONFLICT (id) DO NOTHING;
      `);
    } catch (authSyncErr) {
      console.warn("Auto-sync to Supabase auth.users warning:", authSyncErr);
    }

    return NextResponse.json({
      success: true,
      user: {
        id: dbUser.id,
        email: dbUser.email,
        fullName: dbUser.name,
        phone: dbUser.phone || "",
        role: dbUser.role,
        membershipTier: dbUser.membership_tier,
      },
    });
  } catch (error: any) {
    console.error("Error creating user in database:", error);
    return NextResponse.json(
      { error: error.message || "Database storage failed" },
      { status: 500 },
    );
  }
}
