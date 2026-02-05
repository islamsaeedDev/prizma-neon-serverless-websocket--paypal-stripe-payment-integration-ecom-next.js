import { hashSync } from "bcryptjs";

const sampleData = {
  users: [
    {
      name: "islam2 ",
      email: "admin@example.com",
      password: hashSync("123456", 10),
      role: "admin",
    },
    {
      name: "islam2",
      email: "user@example.com",
      password: hashSync("123456", 10),
      role: "user",
    },
  ],
  products: [
    {
      name: "Dragon W9 30W Wireless Charging Pad",
      slug: "dragon-w9-30w-wireless-charging-pad",
      category: "Wireless Charging Pad",
      description: "Dragon W9 30W Wireless Charging Pad",
      images: [
        "/images/sample-products/p1-1.jpg",
        "/images/sample-products/p1-2.jpg",
        "/images/sample-products/p1-3.jpg",
      ],
      price: 59.99,
      brand: "Dragon",
      ratting: 4.5,
      numReviews: 10,
      stock: 5,
      isFeatured: true,
      banner: "banner-1.jpg",
    },
    {
      name: "Brooks Brothers Long Sleeved Shirt",
      slug: "brooks-brothers-long-sleeved-shirt",
      category: "Men's Dress Shirts",
      description:
        "Timeless style and premium comfort Timeless style and premium comfort",
      images: [
        "/images/sample-products/p2-1.jpg",
        "/images/sample-products/p2-2.jpg",
        "/images/sample-products/p2-3.jpg",
      ],
      price: 85.9,
      brand: "Brooks Brothers",
      ratting: 4.2,
      numReviews: 8,
      stock: 10,
      isFeatured: true,
      banner: "banner-2.jpg",
    },
  ],
};

export default sampleData;
