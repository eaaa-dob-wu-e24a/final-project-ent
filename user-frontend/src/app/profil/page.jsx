"use client";
import { useEffect, useState } from "react";

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);

  // Fetch user profile from the backend
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_API_URL + "/api/user/read/"
        ); // Endpoint to call PHP backend
        const data = await response.json();

        if (response.ok) {
          setUserProfile(data);
        } else {
          setError(data.error);
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching user data");
      }
    };

    fetchUserProfile();
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-xl mx-auto p-4 bg-white shadow-lg rounded-lg">
        <div className="text-center">
          <img
            src={userProfile.profile_picture || "/default-profile.png"}
            alt="Profile Picture"
            className="w-32 h-32 rounded-full mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold">{userProfile.username}</h2>
          <p className="text-gray-500">{userProfile.email}</p>
        </div>

        <div className="mt-6">
          <div className="flex justify-between">
            <span className="font-semibold">Phone Number:</span>
            <span>{userProfile.phone_number}</span>
          </div>

          <div className="flex justify-between mt-2">
            <span className="font-semibold">Rating:</span>
            <span>{userProfile.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
