import { ProductList } from "@/components/shared/products/product-list";
import { LATEST_PRODUCT_LIMIT } from "@/lib/constants";

import { getLatestProducts } from "@/prisma/actions/product.actions";

export const metadata = {
  title: "Home",
};
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const HomePage = async () => {
  await delay(1500);
  const latestProducts = await getLatestProducts(LATEST_PRODUCT_LIMIT);

  return (
    <div>
      <ProductList
        data={latestProducts}
        title="Newest Arrivals"
        limit={LATEST_PRODUCT_LIMIT}
      />
    </div>
  );
};

export default HomePage;
