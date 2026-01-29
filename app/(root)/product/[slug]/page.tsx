import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ProductPrice from "@/components/shared/products/product-price";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/prisma/actions/product.actions";
import ProductImages from "@/components/shared/products/product-images";
import AddToCart from "@/components/shared/products/add-to-cart";
import { getMyCart } from "@/lib/actions/cart.actions";

const ProductDetails = async (props: { params: Promise<{ slug: string }> }) => {
  const { slug } = await props.params;

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const cart = await getMyCart();

  return (
    <>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-5">
          {/* image */}
          <div className="col-span-2">
            <ProductImages images={product.images as string[]} />
          </div>
          {/* details */}
          <div className="col-span-2 p-5">
            <div className="flex flex-col gap-6">
              <p>
                {product.brand} {product.category}
              </p>
              <h1 className="h3-bold">{product.name}</h1>
              <p>
                {Number(product.ratting)} of {Number(product.numReviews)}{" "}
                reviews
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 ">
                <ProductPrice
                  className="bg-green-100 text-green-700 w-24 rounded-full px-5 py-2"
                  value={Number(product.price)}
                />
              </div>
            </div>

            <div className="mt-10">
              <p className="font-semibold mb-1.5">Description</p>
              <p>{product.description}</p>
            </div>
          </div>

          {/* action columns */}
          <div>
            <Card>
              <CardContent className="py-2 px-4 ">
                <div className="mb-2 flex justify-between">
                  <div>price</div>
                  <div>
                    <ProductPrice value={Number(product.price)} />
                  </div>
                </div>

                <div className="mb-2 flex justify-between">
                  <div>status</div>
                  {product.stock > 0 ? (
                    <Badge>in stock</Badge>
                  ) : (
                    <Badge variant="destructive">out of stock</Badge>
                  )}
                </div>

                {product.stock > 0 && (
                  <>
                    <div className=" flex justify-between">
                      <div>stock</div>
                      <div>{product.stock}</div>
                    </div>

                    <div className=" mt-4">
                      <AddToCart
                        cart={cart}
                        item={{
                          productId: product.id,
                          name: product.name,
                          slug: product.slug,
                          price: product.price,
                          qty: 1,
                          image: product.images![0],
                        }}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductDetails;
