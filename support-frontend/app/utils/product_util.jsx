// app/utils/product.js
import { getAccessToken } from "./setCookies";

export async function fetchProducts(request) {
  const accessToken = await getAccessToken(request);
  const customUserAgent = "MinUserAgent/1.0";
  const response = await fetch(`${process.env.BACKEND_URL}/api/product/read/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "user-agent": customUserAgent,
    },
  });

  if (!response.ok) {
    console.error("Failed to fetch products:", await response.text());
    throw new Response("Failed to fetch products", { status: response.status });
  }

  return response.json();
}
