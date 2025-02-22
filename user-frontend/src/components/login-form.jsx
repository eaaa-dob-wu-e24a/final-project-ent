"use client";

/*===============================================
=          Login form is the  first page that is shown / rendered to the client.           =
===============================================*/

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LendrLogo from "./lendr-logo";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Image from "next/image";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      email: email,
      password: password,
      admin: false,
    };

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/api/auth/signin/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include", // Include cookies in the request
        }
      );

      const result = await response.json();

      if (response.ok) {
        document.cookie = `access_token=${result.access_token}; Path=/; Secure; SameSite=None`;
        // Redirect to a protected page or dashboard
        router.push("/hjem");
      } else {
        console.error("Login failed with error:", result.error);
        alert(result.error);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred during login. Please try again later.");
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
        <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
        <form onSubmit={handleSubmit}>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className=""
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <Input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className=""
              required
            />
          </div>

          <Button variant="default" size="lg" type="submit">
            Login
          </Button>
          <h4 className="text-center mt-4">Har du ikke en bruger?</h4>
          <Link
            href="/opret-bruger"
            className="text-blue-500 hover:underline text-center block mt-2"
          >
            Register
          </Link>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
