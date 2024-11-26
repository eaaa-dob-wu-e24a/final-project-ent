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
          process.env.NEXT_PUBLIC_API_URL + "/api/user/read/",
          {
            method: "GET", // Use GET to fetch user profile
            credentials: "include", // Ensure cookies are sent with the request
          }
        );
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const data = await response.json();
        console.log("Fetched Data: ", data);
    
        setUserProfile(data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("An error occurred while fetching user data.");
      }
    };
    

    fetchUserProfile(); // Trigger the fetch when the component mounts
  }, []);

  // If an error occurred, display the error message
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  // If no data yet, show loading message
  if (!userProfile) {
    return <div>Loading...</div>;
  }

  // Render user profile once data is available
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
