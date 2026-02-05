import { getPayPalAccessToken, paypal } from "../lib/paypal";

describe("PayPal", () => {
  test("should get access token", async () => {
    const accessToken = await getPayPalAccessToken();
    console.log(accessToken);

    expect(typeof accessToken).toBe("string");
    expect(accessToken.length).toBeGreaterThan(0);
    expect(accessToken).toBeDefined();
  });

  //   //test creat order
  test("should create order", async () => {
    const accessToken = await getPayPalAccessToken();
    const price = 10;
    const order = await paypal.createOrder(price);
    console.log(order);

    expect(typeof order).toBe("object");
    expect(order).toHaveProperty("id");
    expect(order).toHaveProperty("status");
    expect(order.status).toBe("CREATED");
    expect(order).toBeDefined();
  });
});
//test catpure orderr
// test("simulate capture order by id ", async () => {
//   const orderId = "123";

//   const mockcapturePayment = jest
//     .spyOn(paypal, "captureOrder")
//     .mockResolvedValue({
//       status: "COMPLETED",
//     });

//   const captureOrder = await paypal.captureOrder(orderId);
//   console.log(captureOrder);

//   expect(captureOrder.status).toBe("COMPLETED");
//   mockcapturePayment.mockRestore();
// });
