import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Place Order",
  description: "Place your order",
};


const PlaceOrderPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Place Order</h1>
      <p className="text-gray-600">Place your order</p>
    </div>
  ) 
}

export default PlaceOrderPage