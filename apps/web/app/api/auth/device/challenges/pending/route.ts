import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ challenges: [] });
    }

    // Fetch active pending challenges for this user that haven't expired
    const challenges: any[] = await prisma.$queryRawUnsafe(`
      SELECT 
        "id", "challenge_token", "device_name", "browser", "os", "ip_address", "location", "verification_code", "expires_at", "created_at"
      FROM public."DeviceLoginChallenge"
      WHERE "user_id" = '${userId}'
        AND "status" = 'PENDING'
        AND "expires_at" > NOW()
      ORDER BY "created_at" DESC
      LIMIT 1;
    `);

    return NextResponse.json({
      challenges: challenges || [],
    });
  } catch (error: any) {
    console.error("Pending challenges fetch error:", error);
    return NextResponse.json({ challenges: [] });
  }
}
