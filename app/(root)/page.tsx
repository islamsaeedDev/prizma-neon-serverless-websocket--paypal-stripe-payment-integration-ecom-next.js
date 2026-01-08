import { ProductList } from "@/components/shared/products/product-list";
import { LATEST_PRODUCT_LIMIT } from "@/lib";

import { getLatestProducts } from "@/lib/actions/product.actions";

import React from "react";

export const metadata = {
  title: "Home",
};
// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const HomePage = async () => {
  // await delay(1500);
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
