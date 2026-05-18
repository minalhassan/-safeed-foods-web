
import { PrismaClient } from '../src/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';

async function main() {
  const connectionString = process.env.DATABASE_URL;
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const products = await prisma.product.findMany();
    console.log("Products in DB:");
    products.forEach(p => console.log(`- ${p.id}: ${p.name}`));

    const users = await prisma.user.findMany();
    console.log("\nUsers in DB:");
    users.forEach(u => console.log(`- ${u.id}: ${u.phone} (${u.email})`));
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
