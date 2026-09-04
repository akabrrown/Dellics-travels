import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  hashPassword,
  hashToken,
  validatePasswordPolicy,
} from "@/lib/password";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, token, password } = body;

    if (!email || !token || !password) {
      return NextResponse.json(
        { error: "Email, reset token, and new password are required." },
        { status: 400 },
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Validate password policy (min 8 chars, uppercase, lowercase, number)
    const policyCheck = validatePasswordPolicy(password);
    if (!policyCheck.isValid) {
      return NextResponse.json(
        {
          error: policyCheck.errors[0] || "Password does not meet security requirements.",
          details: policyCheck.errors,
        },
        { status: 400 },
      );
    }

    // 2. Hash incoming plain token to match database SHA-256 hash
    const tokenHash = hashToken(token.trim());

    // 3. Look up active, unused token
    const tokenRecord = await prisma.passwordResetToken.findFirst({
      where: {
        email: cleanEmail,
        token_hash: tokenHash,
        used_at: null,
      },
      include: {
        user: true,
      },
    });

    if (!tokenRecord) {
      return NextResponse.json(
        {
          error:
            "Invalid or expired password reset link. Please request a new recovery link.",
        },
        { status: 400 },
      );
    }

    // 4. Verify expiration timestamp (60 min window)
    if (new Date() > new Date(tokenRecord.expires_at)) {
      // Invalidate expired token
      await prisma.passwordResetToken.update({
        where: { id: tokenRecord.id },
        data: { used_at: new Date() },
      });

      return NextResponse.json(
        {
          error:
            "This password reset link has expired. Reset links are valid for 60 minutes. Please request a new link.",
        },
        { status: 400 },
      );
    }

    // 5. Generate secure scrypt hash
    const newPasswordHash = hashPassword(password);

    // 6. Execute database updates atomically
    await prisma.$transaction(async (tx) => {
      // Update user password hash
      await tx.user.update({
        where: { id: tokenRecord.user_id },
        data: {
          password_hash: newPasswordHash,
        },
      });

      // Mark this token as consumed
      await tx.passwordResetToken.update({
        where: { id: tokenRecord.id },
        data: {
          used_at: new Date(),
        },
      });

      // Purge any stale tokens for this user
      await tx.passwordResetToken.deleteMany({
        where: {
          user_id: tokenRecord.user_id,
          id: { not: tokenRecord.id },
        },
      });
    });

    // 7. Sync to Supabase Auth if service role is present
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.SUPABASE_URL ||
      "https://gfypumkjomlvvpiiwdfq.supabase.co";

    if (supabaseServiceKey && !supabaseServiceKey.includes("placeholder")) {
      try {
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
        await supabaseAdmin.auth.admin.updateUserById(tokenRecord.user_id, {
          password,
        });
      } catch (sbErr) {
        console.warn("Supabase Auth sync optional fallback:", sbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message:
        "Your password has been successfully updated. You can now sign in with your new credentials.",
    });
  } catch (error: any) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      {
        error:
          error.message ||
          "Failed to update password. Please try again or contact support.",
      },
      { status: 500 },
    );
  }
}
