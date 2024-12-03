"use server";

import { cookies } from "next/headers";

export async function getProducts() {
  // Await and get cookies
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("access_token")?.value;

  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/product/my-products/read/",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Await and get response as json
    const result = await response.json();

    // If response is not ok, throw error
    if (!response.ok) {
      throw new Error(result.error || "Failed to fetch products");
    }

    // Return result if response is ok
    return result;

    // Catch and throw error if failed to fetch products
  } catch (error) {
    throw new Error(error.message || "Failed to fetch products");
  }
}

// Function to get specific product
export async function getSpecificProduct(product_id) {

  // Await and get cookies
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("access_token")?.value;

  // If access token is missing, throw error
  if (!accessToken) {
    console.error("Access token is missing.");
    throw new Error("Unauthorized");
  }

  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + `/api/product/read/product_id/?product_id=${product_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // If response is not ok, throw error
    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || "Failed to fetch product details");
    }

    // Await and return response as json
    return await response.json();

    // Catch and throw error if failed to fetch product details
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw error;
  }
}


export async function updateProduct(data) {
  const cookiesStore = cookies();
  const accessToken = cookiesStore.get("access_token")?.value;

  if (!accessToken) {
    throw new Error("Unauthorized. Missing access token.");
  }

  try {
    // Send the data as a POST request to the PHP endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product/update/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
      body: data, // FormData instance or JSON string, depending on the PHP endpoint expectations
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error || "Failed to update product");
    }

    return await response.json(); // Successful response
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}
