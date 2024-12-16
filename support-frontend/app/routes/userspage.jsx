// app/routes/userpage.jsx
import { useState } from "react";
import { json } from "@remix-run/node";
import { fetchUsers } from "../utils/user_util";
import Users from "../components/users";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }) => {
  const users = await fetchUsers(request);
  return json({ users });
};

export default function UsersPage() {
  const { users } = useLoaderData();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Alle brugere</h1>
      <input
        type="text"
        placeholder="Søg brugere..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded w-full max-w-md"
      />
      <Users users={filteredUsers} layout="grid" />
    </div>
  );
}
