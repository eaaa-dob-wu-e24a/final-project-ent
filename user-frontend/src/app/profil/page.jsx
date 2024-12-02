"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RiEdit2Fill } from "react-icons/ri";
import { FiLogOut } from "react-icons/fi";
import { Input } from "../../components/ui/input"; // Importing shadcn Input component
import { logout } from "@/actions/auth.actions";
import { fetchUserProfile, updateUserProfile } from "@/actions/user.actions";

const Profile = () => {
  const [originalUserProfile, setOriginalUserProfile] = useState(null); // Store the original state
  const [userProfile, setUserProfile] = useState(null); // Editable profile
  const [imagePreview, setImagePreview] = useState("/dummypicture.webp");
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for skeleton UI
  const router = useRouter();

  // Fetch user profile from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchUserProfile();
        setOriginalUserProfile(data);
        setUserProfile(data);
        setImagePreview(
          data.profile_picture
            ? `${process.env.NEXT_PUBLIC_API_URL}/api/user/update/${data.profile_picture}`
            : "/dummypicture.webp"
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchData();
  }, []);

  // Handle file selection and preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Update profile
  const handleUpdateProfile = async () => {
    try {
      if (!userProfile) return;

      const formData = new FormData();

      // Add only changed fields to the FormData
      if (userProfile.username !== originalUserProfile.username) {
        formData.append("username", userProfile.username);
      }
      if (userProfile.phone_number !== originalUserProfile.phone_number) {
        formData.append("phone_number", userProfile.phone_number);
      }
      if (userProfile.email !== originalUserProfile.email) {
        formData.append("email", userProfile.email);
      }
      if (imageFile) {
        formData.append("profile_picture", imageFile);
      }

      if (!Array.from(formData.entries()).length) {
        setError("No changes detected.");
        return;
      }

      await updateUserProfile(formData); // Call the action
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFetchUserProfile = async () => {
    const result = await fetchUserProfile();

    if (result?.error) {
      setError(result.error);
    } else {
      setOriginalUserProfile(result);
      setUserProfile(result);
      setImagePreview(
        result.profile_picture
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/user/update/${result.profile_picture}`
          : "/dummypicture.webp"
      );
    }
  };

  const handleLogout = async () => {
    const result = await logout();

    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/");
    }
  };

  if (loading) {
    // Show skeleton UI while loading
    return (
      <div className="container mx-auto p-6">
        <div className="max-w-lg mx-auto bg-gray-100 shadow-md rounded-lg p-6">
          <div className="w-24 h-24 rounded-full bg-gray-300 animate-pulse mx-auto mb-4" />
          <div className="space-y-4">
            <div className="h-4 bg-gray-300 animate-pulse rounded" />
            <div className="h-4 bg-gray-300 animate-pulse rounded" />
            <div className="h-4 bg-gray-300 animate-pulse rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-lg mx-auto bg-gray-100 shadow-md rounded-lg p-6">
        {/* Profile Picture */}
        <div className="relative justify-center items-center mb-6 flex">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Profile Picture"
              className="w-24 h-24 rounded-full border-2 border-gray-300"
            />
            <label
              htmlFor="profile-upload"
              className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 bg-white p-2 rounded-full shadow-md border border-gray-300 flex items-center justify-center cursor-pointer"
              aria-label="Change Picture"
            >
              <RiEdit2Fill className="h-5 w-5 text-[#53BF6D]" />
            </label>
            <input
              type="file"
              name="profile_picture"
              id="profile-upload"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* User Info Form */}
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
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
              value={userProfile?.username || ""}
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
              value={userProfile?.email || ""}
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
              value={userProfile?.phone_number || ""}
              onChange={(e) =>
                setUserProfile({
                  ...userProfile,
                  phone_number: e.target.value,
                })
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
            <FiLogOut className="h-5 w-5 text-[#53BF6D]" />
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
