"use client";
/*===============================================
=          Signup form           =
===============================================*/

import { useState } from "react";
import LendrLogo from "./lendr-logo";
import Link from "next/link";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Image from "next/image";

export default function SignupForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone_number: "",
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    const payload = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      phone_number: formData.phone_number,
    };

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/api/auth/signup/",

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An unknown error occurred.");
      }

      setSuccessMessage("User registered successfully!");
      setFormData({
        username: "",
        email: "",
        password: "",
        phone_number: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-w-[385px] min-h-svh max-w-lg mx-auto p-6 rounded-lg shadow-md">
      <div className="mx-auto mt-5 p-6 rounded-lg">
        <Image
          className="mx-auto my-8"
          src="/images/lendrlogo.png"
          alt="Product Image"
          width={200}
          height={300}
        />
        <h2 className="text-2xl font-bold text-center mb-4">Registrer</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {successMessage && (
          <p className="text-green-500 text-center mb-4">{successMessage}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="username"
            >
              Brugernavn
            </label>
            <Input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="password"
            >
              Adgangskode
            </label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="phone_number"
            >
              Telefon nummer
            </label>
            <Input
              type="text"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>

          <Button variant="default" size="lg" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Registrer"}
          </Button>
          <h4 className="text-center mt-4">Har du allerede en bruger?</h4>
          <Link
            href="/"
            className="text-blue-500 hover:underline text-center block mt-2"
          >
            Login
          </Link>
        </form>
      </div>
    </div>
  );
}
