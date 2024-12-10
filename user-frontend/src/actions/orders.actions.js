"use server";

import { cookies } from "next/headers";

export async function createOrder({
  rental_period,
  post_id,
  start_date,
  end_date,
  destination,
}) {
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
          start_date,
          end_date,
          destination,
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

// function to get user owned orders
export async function getUserOwnerOrders() {
  // Await and get cookies
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("access_token")?.value;

  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/order/read/?owner_only=true",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || "Failed to fetch orders");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Failed to fetch orders");
  }
}

// function to get user rented orders
export async function getUserRenterOrders() {
  // Await and get cookies
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("access_token")?.value;

  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/order/read/?renter_only=true",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || "Failed to fetch orders");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Failed to fetch orders");
  }
}

// function to get specific order
export async function getSpecificOrder(order_id) {
  // Await and get cookies
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("access_token")?.value;

  if (!accessToken) {
    console.error("Access token is missing.");
    throw new Error("Unauthorized");
  }

  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + `/api/order/read/?order_id=${order_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || "Failed to fetch order");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Failed to fetch order");
  }
}
