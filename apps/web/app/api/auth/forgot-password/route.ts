import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateResetToken } from "@/lib/password";
import { sendPasswordResetEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 },
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(cleanEmail)) {
      return NextResponse.json(
        { error: "Please enter a properly formatted email address." },
        { status: 400 },
      );
    }

    // 1. Check if user exists in live PostgreSQL database
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      select: { id: true, name: true, email: true },
    });

    let debugResetUrl: string | undefined;

    // 2. If user exists, generate cryptographically random token with 60m expiry
    if (user) {
      const { token, tokenHash, expiresAt } = generateResetToken();

      // Invalidate existing unused tokens for this user
      await prisma.passwordResetToken.deleteMany({
        where: { user_id: user.id },
      });

      // Persist SHA-256 hashed token with expiry
      await prisma.passwordResetToken.create({
        data: {
          user_id: user.id,
          email: cleanEmail,
          token_hash: tokenHash,
          expires_at: expiresAt,
        },
      });

      // Derive frontend origin
      const origin =
        req.headers.get("origin") ||
        process.env.NEXTAUTH_URL ||
        process.env.NEXT_PUBLIC_APP_URL ||
        "http://localhost:3001";

      const resetUrl = `${origin}/reset-password?token=${token}&email=${encodeURIComponent(cleanEmail)}`;
      debugResetUrl = resetUrl;

      // Dispatch branded email
      await sendPasswordResetEmail({
        to: cleanEmail,
        name: user.name,
        resetUrl,
      });
    }

    // Always return generic success to prevent email enumeration attacks (OWASP)
    return NextResponse.json({
      success: true,
      message:
        "If an account exists with this email, a secure password reset link has been dispatched to your inbox.",
      ...(process.env.NODE_ENV !== "production" && debugResetUrl
        ? { debugResetUrl }
        : {}),
    });
  } catch (error: any) {
    console.error("Forgot password dispatch error:", error);
    return NextResponse.json(
      { error: "Unable to process password reset. Please try again shortly." },
      { status: 500 },
    );
  }
}
