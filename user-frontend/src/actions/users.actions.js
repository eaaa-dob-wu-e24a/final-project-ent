"use server";

import { cookies } from "next/headers";

export async function getUser() {
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("access_token")?.value;

  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/user/read/logged-in-user",
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
