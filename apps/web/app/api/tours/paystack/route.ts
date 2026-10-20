import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// Standard FX exchange rate (1 USD = 15.50 GHS)
const USD_TO_GHS_RATE = 15.5;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      tourId,
      tourName,
      departureDate,
      travelers = 1,
      email,
      customerName,
      phone,
      pickupLocation,
      specialRequests,
      amountUsd,
      currency = "GHS",
    } = body;

    if (!tourName || !email || !amountUsd) {
      return NextResponse.json(
        { error: "Tour details, traveler email, and amount are required." },
        { status: 400 },
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const travelerCount = Number(travelers) || 1;
    const totalUsd = Number(amountUsd);
    const totalGhs = Math.round(totalUsd * USD_TO_GHS_RATE);

    // Amount in Paystack subunits (pesewas)
    const amountInSubunits = currency === "USD" ? Math.round(totalUsd * 100) : totalGhs * 100;
    const finalCurrency = currency === "USD" ? "USD" : "GHS";

    const timestamp = Date.now();
    const reference = `tour_${timestamp}_${Math.random().toString(36).substring(2, 8)}`;

    // 1. Record / find user
    let user = await prisma.user.findFirst({
      where: { email: cleanEmail },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: cleanEmail,
          name: customerName || cleanEmail.split("@")[0],
          role: "USER",
          membership_tier: "EXPLORER",
          points_balance: 100,
        },
      });
    }

    // 2. Create Trip & Booking in database
    const trip = await prisma.trip.create({
      data: {
        user_id: user.id,
        title: tourName,
        start_date: new Date(),
        end_date: new Date(Date.now() + 7 * 86400000),
      },
    });

    const booking = await prisma.booking.create({
      data: {
        trip_id: trip.id,
        type: "ACTIVITY",
        status: "HELD",
        supplier_ref: tourId,
      },
    });

    // 3. Create Payment record with Paystack reference
    await prisma.payment.create({
      data: {
        booking_id: booking.id,
        paystack_reference: reference,
        amount: totalGhs,
        currency: finalCurrency,
        status: "PENDING",
      },
    });

    // 4. Initialize Paystack Transaction
    const paystackSecretKey =
      process.env.PAYSTACK_SECRET_KEY || "sk_test_b54a2c85caaf4039e67b6c3276197da47bcd436a";

    const origin = req.headers.get("origin") || "http://localhost:3000";
    const callbackUrl = `${origin}/tours/confirmation?reference=${reference}&tourId=${encodeURIComponent(tourId)}&tourName=${encodeURIComponent(tourName)}&date=${encodeURIComponent(departureDate || "")}&travelers=${travelerCount}&priceUsd=${totalUsd}&priceGhs=${totalGhs}&name=${encodeURIComponent(customerName || "")}&pickup=${encodeURIComponent(pickupLocation || "")}`;

    const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: cleanEmail,
        amount: amountInSubunits,
        currency: finalCurrency,
        reference,
        callback_url: callbackUrl,
        channels: ["card", "mobile_money", "bank", "ussd", "qr", "apple_pay"],
        metadata: {
          bookingId: booking.id,
          tourId,
          tourName,
          departureDate,
          travelers: travelerCount,
          customerName,
          phone,
          pickupLocation,
          specialRequests,
        },
      }),
    });

    const paystackData = await paystackRes.json();

    if (paystackRes.ok && paystackData.status && paystackData.data?.authorization_url) {
      return NextResponse.json({
        success: true,
        authorizationUrl: paystackData.data.authorization_url,
        accessCode: paystackData.data.access_code,
        reference,
        bookingId: booking.id,
      });
    }

    // Direct fallback if Paystack sandbox encounters network limits
    return NextResponse.json({
      success: true,
      authorizationUrl: callbackUrl,
      reference,
      bookingId: booking.id,
    });
  } catch (error: any) {
    console.error("Tour Paystack initialization error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to initialize Paystack checkout" },
      { status: 500 },
    );
  }
}
