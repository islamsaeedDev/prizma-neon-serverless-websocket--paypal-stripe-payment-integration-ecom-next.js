import { convertToPlainObjectz } from "../../lib/utils";
import { prisma } from "@/lib/prisma.node";

export const getLatestProducts = async (product_limit: number) => {
  const data = await prisma
    .$extends({
      result: {
        product: {
          price: {
            compute(product) {
              return product.price.toString();
            },
          },
          ratting: {
            compute(product) {
              return product.ratting.toString();
            },
          },
        },
      },
    })
    .product.findMany({
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
