"use server";

import { cookies } from "next/headers";

export async function getUserPosts() {
  // Await and get cookies
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("access_token")?.value;

  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/post/read/?user_only=true",
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
      throw new Error(result.error || "Failed to fetch posts");
    }

    return await response.json();

    // Catch and throw error if failed to fetch posts
  } catch (error) {
    throw new Error(error.message || "Failed to fetch posts");
  }
}

// Function to get a non-user specific post
export async function getSpecificNonUserPost(post_id) {
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
      process.env.NEXT_PUBLIC_API_URL +
        `/api/post/read/?post_id=${post_id}&user_only=false`,
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
      throw new Error(result.error || "Failed to fetch post");
    }

    // Return result if response is ok
    return result;

    // Catch and throw error if failed to fetch post
  } catch (error) {
    throw new Error(error.message || "Failed to fetch post");
  }
}

// Function to get specific post for a user
export async function getSpecificPost(post_id) {
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
      process.env.NEXT_PUBLIC_API_URL +
        `/api/post/read/?post_id=${post_id}&user_only=true`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // if response is not ok, throw error
    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || "Failed to fetch post");
    }

    // Await and return response as json
    return await response.json();
  } catch (error) {
    console.error("Error fetching post details", error);
    throw new Error(error.message || "Failed to fetch post");
  }
}

// Function to update a post
export async function updatePost({ post_id, description, price }) {
  // Await and get cookies
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("access_token")?.value;

  // If access token is missing, throw error
  if (!accessToken) {
    console.error("Access token is missing.");
    throw new Error("Unauthorized");
  }

  try {
    const formData = new FormData();
    formData.append("post_id", post_id);

    if (description) formData.append("description", description);
    if (price) formData.append("price", price);

    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/post/update/",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error || "Failed to update post");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
}
