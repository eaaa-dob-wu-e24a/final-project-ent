"use client";
import { useEffect, useState } from "react";
import { getUser } from "@/actions/users.actions";
import Image from "next/image";

export default function ProfilePicture() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="h-[100px] w-25 bg-gray-200 rounded-full animate-pulse"></div>
    );
  }

  return (
    <Image
      className="rounded-full bg-white object-cover h-[100px] w-25"
      src={
        user && user.profile_picture
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/user/update/${user.profile_picture}`
          : "/images/noavatar.png"
      }
      alt="User Avatar"
      width={100}
      height={100}
    />
  );
}
