"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border text-black rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-1">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
