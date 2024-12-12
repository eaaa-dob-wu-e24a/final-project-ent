// app/utils/post.js
import { getAccessToken } from "./setCookies";

export async function fetchPosts(request) {
  const accessToken = await getAccessToken(request);
  const customUserAgent = "MinUserAgent/1.0";
  const response = await fetch(`${process.env.BACKEND_URL}/api/post/read/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "user-agent": customUserAgent,
    },
  });

  if (!response.ok) {
    console.error("Failed to fetch posts:", await response.text());
    throw new Response("Failed to fetch posts", { status: response.status });
  }

  return response.json();
}
