import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@supabase/supabase-js";

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
    const body = await req.json();
    const { email, fullName, phone, password } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 },
      );
    }

    // 1. Try Supabase Auth API if anon key is available
    let supabaseUserId: string | null = null;
    if (supabaseAnonKey && password) {
      try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        const { data: sbData, error: sbError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName?.trim() || "",
              phone: phone?.trim() || "",
              membership_tier: "EXPLORER",
            },
          },
        });
        if (!sbError && sbData.user) {
          supabaseUserId = sbData.user.id;
        }
      } catch (err) {
        console.error("Supabase Auth API signup attempt:", err);
      }
    }

    // 2. Direct PostgreSQL Supabase DB write via Prisma
    const existing = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email address already exists. Please sign in." },
        { status: 409 },
      );
    }

    const dbUser = await prisma.user.create({
      data: {
        id: supabaseUserId || undefined,
        email: email.trim().toLowerCase(),
        name: fullName?.trim() || email.split("@")[0],
        phone: phone?.trim() || null,
        role: "USER",
        membership_tier: "EXPLORER",
      },
    });

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
