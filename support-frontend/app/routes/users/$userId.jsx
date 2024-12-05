// app/routes/users/$userID.jsx
import { useLoaderData, Link } from "@remix-run/react";
import { json } from "@remix-run/node";
import { requireAdmin } from "../../utils/session.server";

export const loader = async ({ request, params }) => {
  const accessToken = await requireAdmin(request);
  const { userID } = params;

  // Fetch user data from the backend
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/user/read/?user_id=${userID}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    console.error("Failed to fetch user data:", await response.text());
    throw new Response("Failed to fetch user data", {
      status: response.status,
    });
  }

  const user = await response.json();
  return json(user);
};

export default function UserDetail() {
  const user = useLoaderData();

  return (
    <div className="p-6">
      <Link to="/" className="text-blue-500 hover:underline">
        ← Back to Users List
      </Link>
      <h1 className="text-2xl font-bold mb-4">User Details</h1>
      <div className="bg-white p-5 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">{user.username}</h2>
        <p className="text-gray-600 mb-1">Phone Number: {user.phone_number}</p>
        {/* Add other user details as needed */}
      </div>
    </div>
  );
}
