import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Users from "../components/users"; // Adjust the import path as necessary

export const loader = async () => {
  const response = await fetch(
    process.env.REMIX_PUBLIC_API_URL + "/api/user/read/",
    {
      method: "GET",
    }
  );

  console.log("ApI url", process.env.REMIX_PUBLIC_API_URL);
  if (!response.ok) {
    throw new Response("Failed to fetch users", { status: response.status });
  }

  const users = await response.json();
  return json(users);
};

export default function Index() {
  const users = useLoaderData() || [];
  return (
    <div>
      <h1>Welcome to the Front Page</h1>
      <Users users={users} />
    </div>
  );
}
