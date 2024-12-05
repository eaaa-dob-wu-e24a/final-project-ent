"use server";

import { cookies } from "next/headers";

export async function createOrder({ rental_period, post_id }) {
  const accessToken = cookies().get("access_token")?.value;

  if (!accessToken) {
    console.error("No access token found in cookies.");
    return { error: "No access token found in cookies." };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/order/create/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          rental_period,
          order_status: "afventer", // Or any default status you prefer
          post_id,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Failed to create order:", data.error);
      return { error: data.error || "Failed to create order." };
    }

    return { success: true, order: data };
  } catch (error) {
    console.error("Failed to create order:", error);
    return { error: "An error occurred while creating the order." };
  }
}
