import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Challenge token required" },
        { status: 400 },
      );
    }

    const challenges: any[] = await prisma.$queryRawUnsafe(`
      SELECT * FROM public."DeviceLoginChallenge"
      WHERE "challenge_token" = '${token}'
      LIMIT 1;
    `);

    if (!challenges || challenges.length === 0) {
      return NextResponse.json({ status: "EXPIRED" });
    }

    const challenge = challenges[0];
    const isExpired = new Date(challenge.expires_at).getTime() < Date.now();

    if (isExpired && challenge.status === "PENDING") {
      await prisma.$executeRawUnsafe(`
        UPDATE public."DeviceLoginChallenge"
        SET "status" = 'EXPIRED', "updated_at" = NOW()
        WHERE "id" = '${challenge.id}'::uuid;
      `);
      return NextResponse.json({ status: "EXPIRED" });
    }

    if (challenge.status === "APPROVED") {
      // Fetch full user record to grant session
      const user = await prisma.user.findUnique({
        where: { id: challenge.user_id },
        include: {
          trips: true,
          memberships: true,
          reviews: true,
        },
      });

      return NextResponse.json({
        status: "APPROVED",
        user,
      });
    }

    return NextResponse.json({
      status: challenge.status, // PENDING, DENIED, EXPIRED
    });
  } catch (error: any) {
    console.error("Challenge poll error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to check challenge status" },
      { status: 500 },
    );
  }
}
