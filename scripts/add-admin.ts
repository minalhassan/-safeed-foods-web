import { prisma } from "../src/lib/prisma";
import { Role } from "../src/generated/prisma";

async function addAdmin() {
  try {
    const admin = await prisma.user.upsert({
      where: { email: "admin@safeed.com" },
      update: {
        password: "rabby1122",
        role: Role.ADMIN,
      },
      create: {
        name: "Admin",
        email: "admin@safeed.com",
        phone: "01800000000",
        password: "rabby1122",
        role: Role.ADMIN,
        address: "Admin Office",
      }
    });
    console.log("✅ Admin user ensured in database:");
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${admin.password}`);
  } catch (error) {
    console.error("❌ Failed to add admin:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

addAdmin();
