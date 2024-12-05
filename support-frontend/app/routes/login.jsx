// app/routes/login.jsx
import { useActionData, Form, redirect } from "@remix-run/react";
import { json } from "@remix-run/node";
import { accessTokenCookie } from "./utils/session.server";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  const response = await fetch(`${process.env.BACKEND_URL}/signin/index.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    return json({ error: data.error || "Login failed" }, { status: 400 });
  }

  // Set the access_token as a cookie
  return redirect("/admin", {
    headers: {
      "Set-Cookie": await accessTokenCookie.serialize(data.access_token),
    },
  });
};

export default function Login() {
  const actionData = useActionData();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md"></div>
      <Form method="post">
        <div>
          <label>
            Email:
            <input type="email" name="email" required />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input type="password" name="password" required />
          </label>
        </div>
        {actionData?.error && (
          <p style={{ color: "red" }}>{actionData.error}</p>
        )}
        <button type="submit">Login</button>
      </Form>
    </div>
  );
}
