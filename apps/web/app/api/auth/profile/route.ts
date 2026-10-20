import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      email,
      id,
      fullName,
      phone,
      nationality,
      homeAirport,
      seatPreference,
      mealPreference,
      emergencyContact,
      emergencyPhone,
      passportNumber,
      passportExpiry,
      passportCountry,
      pointsBalance,
      membershipTier,
      onboardingCompleted,
    } = body;

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

    const updateData: any = {};

    if (fullName !== undefined) updateData.name = fullName.trim();
    if (phone !== undefined) updateData.phone = phone ? phone.trim() : null;
    if (nationality !== undefined) updateData.nationality = nationality;
    if (homeAirport !== undefined) updateData.home_airport = homeAirport;
    if (seatPreference !== undefined) updateData.seat_preference = seatPreference;
    if (mealPreference !== undefined) updateData.meal_preference = mealPreference;
    if (emergencyContact !== undefined) updateData.emergency_contact = emergencyContact;
    if (emergencyPhone !== undefined) updateData.emergency_phone = emergencyPhone;
    if (passportNumber !== undefined) updateData.passport_number = passportNumber;
    if (passportExpiry !== undefined) updateData.passport_expiry = passportExpiry;
    if (passportCountry !== undefined) updateData.passport_country = passportCountry;
    if (pointsBalance !== undefined) updateData.points_balance = pointsBalance;
    if (membershipTier !== undefined) updateData.membership_tier = membershipTier;
    if (onboardingCompleted !== undefined) updateData.onboarding_completed = onboardingCompleted;

    let updatedUser;
    if (existing) {
      updatedUser = await prisma.user.update({
        where: { id: existing.id },
        data: updateData,
      });
    } else {
      const cleanEmail = email
        ? email.trim().toLowerCase()
        : id
          ? `${id}@traveler.dellicstravels.com`
          : "traveler@dellicstravels.com";
      updatedUser = await prisma.user.create({
        data: {
          id: id || undefined,
          email: cleanEmail,
          name: fullName ? fullName.trim() : cleanEmail.split("@")[0] || "Traveler",
          phone: phone ? phone.trim() : null,
          role: "traveler",
          membership_tier: membershipTier || "EXPLORER",
          points_balance: pointsBalance !== undefined ? pointsBalance : 500,
          ...updateData,
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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.trim().toLowerCase();
    const id = searchParams.get("id");

    if (!email && !id) {
      return NextResponse.json(
        { error: "Email or ID is required to fetch profile" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findFirst({
      where: id ? { id } : { email },
      include: {
        trips: true,
        memberships: true,
        reviews: true,
        price_alerts: true,
      },
    });

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error("Error retrieving user from database:", error);
    return NextResponse.json(
      { error: error.message || "Database retrieval failed" },
      { status: 500 },
    );
  }
}
