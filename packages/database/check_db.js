const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const inquiries = await prisma.inquiry.count();
        const users = await prisma.user.count();
        const bookings = await prisma.booking.count();
        console.log(`Inquiries: ${inquiries}, Users: ${users}, Bookings: ${bookings}`);
    } catch (e) {
        console.error("Error:", e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
