// app/utils/user.jsx
import { getAccessToken } from "./setCookies";

export async function fetchUsers(request) {
  const accessToken = await getAccessToken(request);
  const customUserAgent = "MinUserAgent/1.0";
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/user/read/?user_list=true`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "user-agent": customUserAgent,
      },
    }
  );

  if (!response.ok) {
    throw new Response("Failed to fetch users", { status: response.status });
  }

  return response.json();
}
