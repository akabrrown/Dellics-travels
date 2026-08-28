import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function resetAllUsers() {
  console.log("⚠️ PERMANENT USER PURGE INITIATED ON SUPABASE POSTGRESQL DATABASE...");

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Delete dependent child records linked to users
      const deletedReviews = await tx.review.deleteMany();
      const deletedPayments = await tx.payment.deleteMany();
      const deletedBookings = await tx.booking.deleteMany();
      const deletedTrips = await tx.trip.deleteMany();
      const deletedMemberships = await tx.membership.deleteMany();
      const deletedRewards = await tx.rewardsLedger.deleteMany();
      const deletedPriceAlerts = await tx.priceAlert.deleteMany();
      const deletedFareFreezes = await tx.fareFreeze.deleteMany();
      const deletedESIMOrders = await tx.eSIMOrder.deleteMany();

      // 2. Permanently delete all Users
      const deletedUsers = await tx.user.deleteMany();

      return {
        deletedUsers: deletedUsers.count,
        deletedTrips: deletedTrips.count,
        deletedBookings: deletedBookings.count,
        deletedPayments: deletedPayments.count,
        deletedReviews: deletedReviews.count,
        deletedMemberships: deletedMemberships.count,
        deletedRewards: deletedRewards.count,
        deletedPriceAlerts: deletedPriceAlerts.count,
        deletedFareFreezes: deletedFareFreezes.count,
        deletedESIMOrders: deletedESIMOrders.count,
      };
    });

    console.log("✅ PERMANENT PURGE COMPLETED SUCCESSFULLY:");
    console.log(`- Users Deleted: ${result.deletedUsers}`);
    console.log(`- Trips Deleted: ${result.deletedTrips}`);
    console.log(`- Bookings Deleted: ${result.deletedBookings}`);
    console.log(`- Payments Deleted: ${result.deletedPayments}`);
    console.log(`- Memberships Deleted: ${result.deletedMemberships}`);
    console.log(`- eSIM Orders Deleted: ${result.deletedESIMOrders}`);

    const remainingCount = await prisma.user.count();
    console.log(`\n🔍 VERIFIED REMAINING USERS IN DATABASE: ${remainingCount}`);
  } catch (error) {
    console.error("❌ Failed to purge users from database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

resetAllUsers();
