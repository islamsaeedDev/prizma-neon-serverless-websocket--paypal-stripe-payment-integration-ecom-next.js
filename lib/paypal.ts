const base = process.env.PAYPAL_API_URL || "https://api-m.sandbox.paypal.com";

export const paypal = {
  //create order function
  createOrder: async function createOrder(price: number) {
    const accesstoken = await getPayPalAccessToken();
    const url = `${base}/v2/checkout/orders`;

    const response = await fetch(url, {
      method: "POST",

      headers: {
        Authorization: `Bearer ${accesstoken}`,
        "content-type": "application/json",
      },

      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: price,
            },
          },
        ],
      }),
    });

    return await handleResponse(response);
  },

  //capture order function
  captureOrder: async function captureOrder(orderId: string) {
    const accessToken = await getPayPalAccessToken();

    const url = `${base}/v2/checkout/orders/${orderId}/capture`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return await handleResponse(response);
  },
};

//generate paypal access token
export async function getPayPalAccessToken() {
  //ashing the client and  secet during request not hash  but changing how it look and paypal  decode that :)
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`,
  ).toString("base64");

  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const jsonData = await handleResponse(res);

  return jsonData.access_token;
}

async function handleResponse(response: Response) {
  if (response.ok) {
    return await response.json();
  } else {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}
