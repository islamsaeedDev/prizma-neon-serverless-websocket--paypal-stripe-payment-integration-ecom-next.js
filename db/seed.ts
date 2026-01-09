import sampleData from "@/db/sample-data";
import { prisma } from "@/lib/prisma.node";

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
