import { NextResponse } from "next/server";
import { prisma } from "@dellics/database";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, id, fullName, phone, membershipTier } = body;

    if (!email && !id) {
      return NextResponse.json(
        { error: "User identifier (email or id) is required" },
        { status: 400 },
      );
    }

    const where = id ? { id } : { email: email.trim().toLowerCase() };

    const existing = await prisma.user.findFirst({
      where,
    });

    let updatedUser;
    if (existing) {
      updatedUser = await prisma.user.update({
        where: { id: existing.id },
        data: {
          name: fullName !== undefined ? fullName.trim() : existing.name,
          phone: phone !== undefined ? phone.trim() : existing.phone,
          membership_tier: membershipTier || existing.membership_tier,
        },
      });
    } else if (email) {
      updatedUser = await prisma.user.create({
        data: {
          id: id || undefined,
          email: email.trim().toLowerCase(),
          name: fullName?.trim() || email.split("@")[0],
          phone: phone?.trim() || null,
          role: "USER",
          membership_tier: membershipTier || "EXPLORER",
        },
      });
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Error updating user in database:", error);
    return NextResponse.json(
      { error: error.message || "Database update failed" },
      { status: 500 },
    );
  }
}
