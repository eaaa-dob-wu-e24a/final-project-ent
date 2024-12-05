// app/routes/login.jsx
import { useActionData, Form } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { accessTokenCookie } from "./utils/session.server";

export const action = async ({ request }) => {
  try {
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");

    const response = await fetch(
      `${process.env.BACKEND_URL}/api/auth/signin/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      }
    );

    if (!response.ok) {
      const data = await response.json();
      return json({ error: data.error || "Login failed" }, { status: 400 });
    }

    const data = await response.json();

    // Set the access_token as an HTTP-only cookie
    return redirect("/", {
      headers: {
        "Set-Cookie": await accessTokenCookie.serialize(data.access_token),
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return json({ error: "An error occurred during login." }, { status: 500 });
  }
};

export default function Login() {
  const actionData = useActionData();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Form
        method="post"
        className="w-full max-w-md bg-white p-8 rounded-lg shadow"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {actionData?.error && (
          <p className="text-red-500 mb-4">{actionData.error}</p>
        )}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Login
        </button>
      </Form>
    </div>
  );
}
