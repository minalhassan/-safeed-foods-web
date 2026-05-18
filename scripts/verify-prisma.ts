import { prisma } from "../src/lib/prisma";

async function verify() {
  try {
    const userCount = await prisma.user.count();
    console.log(`✅ Connected. User count: ${userCount}`);
  } catch (error) {
    console.error("❌ Connection failed:");
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verify();
