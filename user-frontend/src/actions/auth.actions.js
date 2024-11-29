"use server";

import { cookies } from "next/headers";

export async function logout() {
  // Retrieve the access token from cookies
  const accessToken = cookies().get("access_token")?.value;

  // Return an error if no access token is found
  if (!accessToken) {
    console.error("No access token found in cookies.");
    return { error: "No access token found in cookies." };
  }

  // Send a request to the backend to log out the user
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/auth/signout/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Attach the access token in the Authorization header
        },
        body: JSON.stringify({ access_token: accessToken }), // Include the token in the request body
      }
    );

    // If the request fails, return an error
    if (!response.ok) {
      const errorData = await response.json(); // Parse the error response from the backend
      console.error("Failed to log out:", errorData.error);
      return { error: errorData.error || "Failed to log out." };
    }

    // Clear the access token cookie
    cookies().set("access_token", "", { expires: new Date(0) }); // Set the cookie to expire immediately

    // Return a success message
    return { success: true, message: "Logged out successfully." };

    // If an error occurs during the request, return an error
  } catch (error) {
    console.error("Failed to log out:", error);
    return { error: "An error occurred while logging out." };
  }
}

// Note: The login function is currently client-side.
// To move it server-side, ensure the access token cookie is also set server-side.