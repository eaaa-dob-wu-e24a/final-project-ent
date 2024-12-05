// app/routes/admin.jsx
import { useLoaderData } from "@remix-run/react";
import Users from "../components/users";
import { json } from "@remix-run/node";
import { requireAdmin } from "./utils/session.server";

export const loader = async ({ request }) => {
  const accessToken = await requireAdmin(request);

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
    <div>
      <h1>Admin Dashboard</h1>
      <Users users={users} />
    </div>
  );
}
