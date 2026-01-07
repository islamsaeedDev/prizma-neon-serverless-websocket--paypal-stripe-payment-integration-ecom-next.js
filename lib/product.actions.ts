import { prisma } from "./prisma";
import { convertToPlainObjectz } from "./utils";

export const getLatestProducts = async (product_limit: number) => {
  const data = await prisma.product.findMany({
    take: product_limit,
    orderBy: {
      createdAt: "desc",
    },
  });

  return convertToPlainObjectz(data);
};
