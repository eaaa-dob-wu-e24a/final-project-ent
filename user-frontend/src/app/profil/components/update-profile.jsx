"use client";
import { RiEdit2Fill } from "react-icons/ri";
import { FiLogOut } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/actions/auth.actions";
import { toast } from "react-hot-toast";

export default function UpdateProfile({ user, updateUser }) {
  // State for user data
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [phone_number, setPhoneNumber] = useState(user.phone_number);
  const [profile_picture, setProfilePicture] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    user.profile_picture
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/user/update/${user.profile_picture}`
      : "/images/noavatar.png"
  );

  // Router to redirect
  const router = useRouter();

  // Handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser({
        username,
        email,
        phone_number,
        profile_picture,
      });
      toast.success("Profilen er opdateret!");
      router.push("/profil");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Noget gik galt. Prøv igen.");
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="w-11/12 mx-auto pt-14">
      <div className="max-w-lg mx-auto">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="relative justify-center items-center mb-6 flex">
            <div className="relative">
              <Image
                src={imagePreview}
                alt="Profile Picture"
                className="w-44 h-44 rounded-full border-2 object-cover border-gray-300"
                width={100}
                height={100}
              />
              <label
                htmlFor="profile-upload"
                className="absolute bottom-3 right-4 transform translate-x-1/4 translate-y-1/4 bg-white p-2 rounded-full shadow-md border border-gray-300 flex items-center justify-center cursor-pointer"
                aria-label="Change Picture"
              >
                <RiEdit2Fill className="h-6 w-6 text-darkgreen" />
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={phone_number}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1"
            />
          </div>

          <Button
            variant="default"
            size="medium"
            type="submit"
            className="text-base mt-4"
          >
            Opdater Profil
          </Button>
        </form>

        {/* Logout Button */}
        <div className="mt-7 text-center">
          <button
            type="button"
            className="text-gray-600 flex items-center justify-center space-x-2"
            onClick={handleLogout}
          >
            <FiLogOut className="h-5 w-5 text-darkgreen" />
            <span>Log ud</span>
          </button>
        </div>
      </div>
    </div>
  );
}
