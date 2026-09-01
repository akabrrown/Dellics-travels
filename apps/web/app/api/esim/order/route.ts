import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      country = "Ghana",
      data = "5 GB",
      validity = "30 Days",
      price = 14,
      email = "traveler@dellicstravels.com",
      deviceModel = "Universal Smartphone",
    } = body;

    const cleanEmail = (email || "").trim().toLowerCase() || "traveler@dellicstravels.com";
    const numPrice = typeof price === "number" ? price : parseFloat(String(price).replace(/[^0-9.]/g, "")) || 14;
    const numDataGb = parseFloat(String(data).replace(/[^0-9.]/g, "")) || 5;
    const numValidity = parseInt(String(validity).replace(/[^0-9]/g, ""), 10) || 30;

    // 1. Find or create Traveler in database
    let user = await prisma.user.findFirst({
      where: { email: cleanEmail },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: cleanEmail,
          name: cleanEmail.split("@")[0] || "eSIM Traveler",
          role: "USER",
          membership_tier: "EXPLORER",
          points_balance: 500,
        },
      });
    }

    // 2. Upsert eSIM Plan
    const packageId = `dellics-${country.toLowerCase().replace(/[^a-z0-9]/g, "")}-${numDataGb}gb`;
    const plan = await prisma.eSIMPlan.upsert({
      where: { airalo_package_id: packageId },
      update: {
        price: numPrice,
        data_gb: numDataGb,
        validity_days: numValidity,
      },
      create: {
        country_or_region: country,
        data_gb: numDataGb,
        validity_days: numValidity,
        price: numPrice,
        airalo_package_id: packageId,
      },
    });

    const timestamp = Date.now();
    const iccid = `8900${timestamp.toString().slice(-12)}91`;
    const activationToken = Math.random().toString(36).substring(2, 10).toUpperCase();
    const smdpAddress = "smdp.gsma.dellicstravels.com";
    const lpaActivationCode = `LPA:1$${smdpAddress}$${activationToken}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(lpaActivationCode)}`;

    // 3. Create eSIM Order in database
    const order = await prisma.eSIMOrder.create({
      data: {
        user_id: user.id,
        esim_plan_id: plan.id,
        paystack_reference: `esim_${timestamp}_${Math.random().toString(36).slice(2, 6)}`,
        qr_code_url: qrCodeUrl,
        iccid,
        status: "ACTIVE",
      },
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        country,
        data: `${numDataGb} GB`,
        validity: `${numValidity} Days`,
        price: `$${numPrice.toFixed(2)}`,
        iccid,
        smdpAddress,
        activationCode: lpaActivationCode,
        qrCodeUrl,
        deviceModel,
        status: "ACTIVE",
        recipientEmail: cleanEmail,
      },
    });
  } catch (error: any) {
    console.error("eSIM order endpoint error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process eSIM order" },
      { status: 500 },
    );
  }
}
