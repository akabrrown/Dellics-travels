import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@supabase/supabase-js";
import { verifyPassword } from "@/lib/password";

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
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Direct verify against PostgreSQL Supabase database
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

    // 2. Direct password verification if password_hash exists in database
    if (dbUser.password_hash) {
      const isValid = verifyPassword(password, dbUser.password_hash);
      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 },
        );
      }
    }

    // 3. If Supabase Auth is available, verify password with Supabase
    let session = null;
    let authUser = null;
    if (supabaseAnonKey && !supabaseAnonKey.includes("placeholder")) {
      try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error || !data?.user) {
          return NextResponse.json(
            { error: "Invalid email or password" },
            { status: 401 },
          );
        }

        session = data.session;
        authUser = data.user;
      } catch (err) {
        console.error("Supabase auth verification:", err);
        return NextResponse.json(
          { error: "Authentication service temporarily unavailable" },
          { status: 503 },
        );
      }
    }

    return NextResponse.json({
      success: true,
      user: dbUser,
      session,
      authUser,
    });
  } catch (error: any) {
    console.error("Login verification error:", error);
    return NextResponse.json(
      { error: error.message || "Authentication service error" },
      { status: 500 },
    );
  }
}
