import { useLoaderData } from "@remix-run/react";
import Users from "../components/users";
import Posts from "../components/posts";
import { json } from "@remix-run/node";

import { fetchUsers } from "../utils/user";
import { fetchPosts } from "../utils/post";

export const loader = async ({ request }) => {
  const [users, posts] = await Promise.all([
    fetchUsers(request),
    fetchPosts(request),
  ]);

  return json({ users, posts });
};

export default function AdminDashboard() {
  const { users, posts } = useLoaderData();
  // Amount of users and posts currently active
  const totalUsers = users.length;
  const totalPosts = posts.length;

  return (
    <div>
      {/* Main Content */}
      <div className="flex-grow py-4">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <div className="flex gap-4 justify-between">
          <div className="bg-white shadow w-full rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-700">
              Total brugere registreret
            </h3>
            <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
          </div>
          <div className="bg-white w-full shadow rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-700">
              Total Online Opslag
            </h3>
            <p className="text-3xl font-bold text-gray-900">{totalPosts}</p>
          </div>
        </div>

        <div className="flex flex-col">
          <Users users={users} layout="flex" />
          <Posts posts={posts} />
        </div>
      </div>
    </div>
  );
}
