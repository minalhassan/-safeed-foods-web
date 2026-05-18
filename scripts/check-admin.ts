import { prisma } from "../src/lib/prisma";

async function checkAdmin() {
  try {
    const admin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });
    if (admin) {
      console.log("✅ Admin found:");
      console.log(`Email: ${admin.email}`);
      console.log(`Role: ${admin.role}`);
      // Password intentionally not printed
    } else {
      console.log("❌ No admin found in database.");
    }
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin();
