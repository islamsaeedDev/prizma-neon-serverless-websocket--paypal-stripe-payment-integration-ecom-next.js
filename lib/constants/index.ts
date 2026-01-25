export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Tratoo";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "Tratto Brand ecccomerce with  stripe and  paypal  checkout ";
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export const LATEST_PRODUCT_LIMIT =
  Number(process.env.LATEST_PRODUCT_LIMIT) || 4;

export const signInDefaultValues = {
  email: "admin@example.com",
  password: "123456",
};

export const signUpDefaultValues = {
  email: "",
  password: "",
  confirmPassword: "",
  name: "",
};

export const shippingAddressDefaultValues = {
  fullName: "islam saeed",
  streetAddress: "123 Main St",
  city: "Cairo",
  postalCode: "12345",
  country: "egypt",
  lat: "",
  lng: "",
};
