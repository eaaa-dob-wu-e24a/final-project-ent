// app/utils/order.js
import { getAccessToken } from "./setCookies";
import { fetchWithUserAgent } from "~/utils/fetchWithUserAgent";

export async function fetchOrders(request) {
  const accessToken = await getAccessToken(request);
  const response = await fetch(`${process.env.BACKEND_URL}/api/order/read/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error("Failed to fetch orders:", await response.text());
    throw new Response("Failed to fetch orders", { status: response.status });
  }

  return response.json();
}

export async function fetchOrder(order_id, request) {
  const accessToken = await getAccessToken(request);
  const response = await fetchWithUserAgent(
    `${process.env.BACKEND_URL}/api/order/read/?order_id=${order_id}/`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    console.error("Failed to fetch order:", await response.text());
    throw new Response("Failed to fetch order", { status: response.status });
  }

  return response.json();
}

// Remove updateOrder and deleteOrder if not needed for now
// export async function updateOrder(order_id, data, request) { /*...*/ }
// export async function deleteOrder(order_id, request) { /*...*/ }
