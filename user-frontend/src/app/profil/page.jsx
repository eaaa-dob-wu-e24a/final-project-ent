"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RiEdit2Fill } from "react-icons/ri";
import { FiLogOut } from "react-icons/fi";
import { Input } from "../../components/ui/input"; // Importing shadcn Input component
import { logout } from "@/actions/auth.actions";

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // State for success message
  const router = useRouter();

  // Fetch user profile from the backend
  useEffect(() => {
    const fetchUserProfile = async () => {
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

        const data = await response.json();
        setUserProfile(data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("An error occurred while fetching user data.");
      }
    };

    fetchUserProfile(); // Trigger fetch when component mounts
  }, []);

  const handleLogout = async () => {
    const result = await logout();

    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/");
    }
  };

  // Update the user profile
  const handleUpdateProfile = async () => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/api/user/update/",
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: userProfile.username,
            email: userProfile.email,
            phone_number: userProfile.phone_number,
            profile_picture: userProfile.profile_picture, // Update with new picture if changed
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! Status: ${response.status}`
        );
      }

      const updatedProfile = await response.json();
      setUserProfile(updatedProfile);

      // Display success message
      setSuccessMessage("Your profile was updated successfully!");

      // Clear the success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);

      console.log("Profile updated successfully:", updatedProfile);
    } catch (err) {
      console.error("Error updating user profile:", err.message);
      setError(err.message);
    }
  };

  // Handle profile picture update via button
  const handleProfilePictureUpdate = () => {
    const newPictureUrl = prompt("Enter the new profile picture URL:");
    if (newPictureUrl) {
      setUserProfile({ ...userProfile, profile_picture: newPictureUrl });
    }
  };

  // If no data yet, show loading message
  if (!userProfile) {
    return <div>Loading...</div>;
  }

  // Render user profile once data is available
  return (
    <div className="container mx-auto p-6">
      <div className="max-w-lg mx-auto bg-gray-100 shadow-md rounded-lg p-6">
        {/* Profile Picture */}
        <div className="relative justify-center items-center mb-6 flex">
          <div className="relative">
            <img
              src={userProfile.profile_picture || "/default-profile.png"}
              alt="Profile Picture"
              className="w-24 h-24 rounded-full border-2 border-gray-300"
            />
            <button
              onClick={handleProfilePictureUpdate}
              className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 bg-white p-2 rounded-full shadow-md border border-gray-300 flex items-center justify-center"
              aria-label="Change Picture"
            >
              <RiEdit2Fill className="h-5 w-5 text-[#53BF6D]" />{" "}
              {/* Edit Icon */}
            </button>
          </div>
        </div>

        {/* User Info Form */}
        <form className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-[#060606]"
            >
              Brugernavn
            </label>
            <Input
              id="username"
              name="username"
              type="text"
              value={userProfile.username}
              onChange={(e) =>
                setUserProfile({ ...userProfile, username: e.target.value })
              }
              className="mt-1"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#060606]"
            >
              Email Adresse
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={userProfile.email || ""}
              onChange={(e) =>
                setUserProfile({ ...userProfile, email: e.target.value })
              }
              className="mt-1"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Telefonnummer
            </label>
            <Input
              id="phone"
              name="phone"
              type="text"
              value={userProfile.phone_number || ""}
              onChange={(e) =>
                setUserProfile({ ...userProfile, phone_number: e.target.value })
              }
              className="mt-1"
            />
          </div>

          <button
            type="button"
            onClick={handleUpdateProfile}
            className="w-full bg-[#53BF6D] text-white py-2 px-4 rounded-md shadow hover:bg-green-600"
          >
            Opdater profil
          </button>
        </form>

        {/* Logout Button */}
        <div className="mt-7 text-center">
          <button
            type="button"
            onClick={handleLogout}
            className="text-gray-600 flex items-center justify-center space-x-2"
          >
            <FiLogOut className="h-5 w-5 text-[#53BF6D]" /> {/* Logout Icon */}
            <span>Log ud</span>
          </button>
          {successMessage && (
            <div className="mt-2 text-green-600">{successMessage}</div>
          )}
          {error && <div className="mt-2 text-red-600">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default Profile;
