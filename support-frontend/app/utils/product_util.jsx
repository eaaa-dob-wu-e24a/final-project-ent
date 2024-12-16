// app/utils/product_util.js
import { getAccessToken } from "./setCookies";

export async function fetchProducts(request, queryParams = "") {
  const accessToken = await getAccessToken(request);
  const customUserAgent = "MinUserAgent/1.0";
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/product/read/${queryParams}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "user-agent": customUserAgent,
      },
    }
  );

  if (!response.ok) {
    console.error("Failed to fetch products:", await response.text());
    throw new Response("Failed to fetch products", { status: response.status });
  }

  return response.json();
}

export async function fetchProduct(request, product_id) {
  return fetchProducts(request, `?product_id=${product_id}`);
}
