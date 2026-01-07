import "dotenv/config";
import sampleData from "../db/sample-data";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const prisma = new PrismaClient({
  adapter: new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
  }),
});

export async function seed() {
  console.log(" Seed started");
  await prisma.product.deleteMany();
  const result = await prisma.product.createMany({
    data: sampleData.products,
    skipDuplicates: true,
  });

  console.log("✅ Inserted products count:", result.count);
}

seed();
