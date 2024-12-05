"use server";

import { cookies } from "next/headers";

export async function getUser() {
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("access_token")?.value;

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

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to fetch user");
    }

    return result;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch user");
  }
}

export async function updateUser({
  username,
  email,
  phone_number,
  profile_picture,
  path,
}) {

  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("access_token")?.value;

  if (!accessToken) {
    console.error("Access token is missing.");
    throw new Error("Unauthorized");
  }

  try {
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

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || "Failed to update user");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}
