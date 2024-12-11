"use server";

import { cookies } from "next/headers";

export async function getUser() {
  // Await and get cookies
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("access_token")?.value;

  // If access token is missing, return null
  if (!accessToken) {
    return null;
  }

  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/user/read/",
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
      throw new Error(result.error || "Failed to fetch user");
    }

    // Return result if response is ok
    return result;

    // Catch and throw error if failed to fetch user
  } catch (error) {
    throw new Error(error.message || "Failed to fetch user");
  }
}

export async function updateUser({
  username,
  email,
  phone_number,
  profile_picture,
}) {
  // Await and get cookies
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("access_token")?.value;

  // If access token is missing, throw error
  if (!accessToken) {
    console.error("Access token is missing.");
    throw new Error("Unauthorized");
  }

  try {
    // Create form data
    const formData = new FormData();

    if (username) formData.append("username", username);
    if (email) formData.append("email", email);
    if (phone_number) formData.append("phone_number", phone_number);

    if (profile_picture) {
      formData.append("profile_picture", profile_picture);
    }

    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/user/update/",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      }
    );

    // If response is not ok, throw error
    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || "Failed to update user");
    }

    // Await and return response as json
    return await response.json();
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

export async function deleteUser() {
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
      process.env.NEXT_PUBLIC_API_URL + "/api/user/delete/",
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // If response is not ok, throw error
    if (!response.ok) {
      throw new Error("Failed to delete user");
    }

    // Await and return response as json
    await cookiesStore.set("access_token", "", { expires: new Date(0) });
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}
