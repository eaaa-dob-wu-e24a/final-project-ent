import { useLoaderData, Link, useFetcher } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { getAccessToken } from "../utils/setCookies";

export const loader = async ({ request, params }) => {
  const accessToken = await getAccessToken(request);

  if (!accessToken) {
    return redirect("/login");
  }

  const { userId } = params;

  // Fetch user data from the backend
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/user/read/?target_user_id=${userId}`,
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
  user.profile_picture = `${process.env.BACKEND_URL}/api/user/update/${user.profile_picture}`;
  return json(user);
};

export const action = async ({ request, params }) => {
  const accessToken = await getAccessToken(request);

  const { userId } = params;
  const formData = await request.formData();
  const updatedData = {
    username: formData.get("username"),
    email: formData.get("email"),
    phone_number: formData.get("phone_number"),
    profile_picture: formData.get("profile_picture"),
  };

  // Update user data in the backend
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/user/update/?target_user_id=${userId}`,
    {
      method: "POST",
      body: JSON.stringify(updatedData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    console.error("Failed to update user data:", await response.text());
    throw new Response("Failed to update user data", {
      status: response.status,
    });
  }

  return json({ success: true });
};

export default function UserDetail() {
  const user = useLoaderData();
  const fetcher = useFetcher();

  return (
    <div className="p-6">
      <Link to="/" className="text-blue-500 hover:underline">
        ← Back to Users List
      </Link>
      <h1 className="text-2xl font-bold mb-4">User Details</h1>
      <div className="bg-white p-5 rounded-lg shadow">
        <fetcher.Form method="post" encType="multipart/form-data">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              name="username"
              type="text"
              defaultValue={user.username}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              name="email"
              type="email"
              defaultValue={user.email}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="phone_number"
            >
              Phone Number
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="phone_number"
              name="phone_number"
              type="text"
              defaultValue={user.phone_number}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="profile_picture"
            >
              Profile Picture
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="profile_picture"
              name="profile_picture"
              type="file"
            />
            {user.profile_picture && (
              <img
                src={user.profile_picture}
                alt="Profile"
                className="mt-2 w-32 h-32 rounded-full"
              />
            )}
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Update User
            </button>
          </div>
        </fetcher.Form>
      </div>
    </div>
  );
}
