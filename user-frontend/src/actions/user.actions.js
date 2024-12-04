// user.actions.js

export const fetchUserProfile = async () => {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/user/read/",
      {
        method: "GET",
        credentials: "include", // Include cookies for authorization
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Error fetching user profile:", err);
    throw new Error("An error occurred while fetching user data.");
  }
};

export const updateUserProfile = async (formData) => {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/user/update/",
      {
        method: "POST",
        credentials: "include",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.error || "Failed to update profile");
      } catch (e) {
        throw new Error("Unexpected response: " + errorText);
      }
    }

    return await response.json();
  } catch (err) {
    console.error("Error updating profile:", err.message);
    throw new Error(err.message);
  }
};

export const logout = async () => {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/user/logout/",
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to log out.");
    }

    return await response.json();
  } catch (err) {
    console.error("Error during logout:", err);
    return { error: "Logout failed. Please try again." };
  }
};
