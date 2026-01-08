import { prisma } from "@/db/prisma";
import { convertToPlainObjectz } from "../utils";

export const getLatestProducts = async (product_limit: number) => {
  const data = await prisma.product.findMany({
    take: product_limit,
    orderBy: {
      createdAt: "desc",
    },
  });

  return convertToPlainObjectz(data);
};

//get single product
export async function getProductBySlug(slug: string) {
  return await prisma.product.findFirst({
    where: { slug: slug },
  });
}
