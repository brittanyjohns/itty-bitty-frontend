//export const BASE_URL = '10.0.2.2:4000/api/'; // For Android emulator
// export const BASE_URL = 'localhost:4000/api/'; // For web development

// ionic cap run android -l --external
const API_URL = import.meta.env.VITE_API_URL;

export const AUTO_REFRESH_RATE = 30000; // 30 seconds
export const REFRESH_RATE = 45000; // 45 seconds

export const BASE_URL = API_URL
  ? API_URL + "/api/"
  : "http://localhost:4000/api/"; // For web development
export const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
export const STRIPE_PRICING_TABLE_ID = import.meta.env
  .VITE_STRIPE_PRICING_TABLE_ID;
export const STRIPE_PAYMENT_LINK_URL = import.meta.env
  .VITE_STRIPE_PAYMENT_LINK_URL;
export const STRIPE_CUSTOMER_PORTAL_URL = import.meta.env
  .VITE_STRIPE_CUSTOMER_PORTAL_URL;

export const userHeaders = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
};

export const childAccountHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: `Bearer ${localStorage.getItem("child_token")}`,
};
