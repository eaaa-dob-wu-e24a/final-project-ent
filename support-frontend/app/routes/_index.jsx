import { useLoaderData } from "@remix-run/react";
import Users from "../components/users";
import { json } from "@remix-run/node";
import { getAccessToken } from "../utils/setCookies";

export const loader = async ({ request }) => {
  const accessToken = await getAccessToken(request);

  // Fetch users from the backend
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/user/read/?user_list=true`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    console.error("Failed to fetch admin data:", await response.text());
    throw new Response("Failed to fetch admin data", {
      status: response.status,
    });
  }

  const users = await response.json();
  return json(users);
};

export default function AdminDashboard() {
  const users = useLoaderData();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <Users users={users} />
      </div>
    </div>
  );
}
