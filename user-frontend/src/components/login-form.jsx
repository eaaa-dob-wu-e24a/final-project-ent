"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LendrLogo from "./lendr-logo";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      email: email,
      password: password,
    };

    console.log("Submitting login form with data:", data);

    try {
      const response = await fetch("http://localhost:4000/api/auth/signin/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include", // Include cookies in the request
      });

      console.log("Received response:", response);

      const result = await response.json();

      console.log("Parsed response JSON:", result);

      if (response.ok) {
        console.log("Login successful, redirecting...");
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
        <LendrLogo />
        <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
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
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 text-white font-bold rounded-md shadow bg-blue-500 hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>
          <h4 className="text-center mt-4">Har du ikke en bruger?</h4>
          <Link
            href="/signup"
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
