"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  // Get cookies object
  const cookiesStore = await cookies();

  // Get access token from cookies
  const accessToken = cookiesStore.get("access_token")?.value;

  if (!accessToken) {
    console.error("No access token found in cookies.");
    return { error: "No access token found in cookies." };
  }

  try {
    // Send a request to the backend to log out the user
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/auth/signout/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ access_token: accessToken }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to log out:", errorData.error);
      return { error: errorData.error || "Failed to log out." };
    }

    // Clear the access token cookie
    await cookiesStore.set("access_token", "", { expires: new Date(0) }); // Correct use of `await`

    // Redirect to the homepage or login page
    redirect("/");
  } catch (error) {
    console.error("Failed to log out:", error);
    return { error: "An error occurred while logging out." };
  }
}
