import sampleData from "@/db/sample-data";
import { prisma } from "@/lib/prisma.node";

export async function seed() {
  console.log(" Seed started");
  await prisma.product.deleteMany();

  await prisma.user.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();

  const result = await prisma.product.createMany({
    data: sampleData.products,
    skipDuplicates: true,
  });

  const result2 = await prisma.user.createMany({
    data: sampleData.users,
    skipDuplicates: true,
  });

  console.log("✅ Inserted products count:", result.count);
  console.log("✅ Inserted users count:", result2.count);
}

seed();
//npx tsx ./db/seed
