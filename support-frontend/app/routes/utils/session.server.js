// app/utils/session.server.js
import { createCookie } from "@remix-run/node";
import { redirect } from "@remix-run/react";

export const accessTokenCookie = createCookie("access_token", {
  httpOnly: true,
  path: "/",
  sameSite: "lax",
  // secure: process.env.NODE_ENV === "production",
});

export async function getAccessToken(request) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await accessTokenCookie.parse(cookieHeader)) || null;
  return cookie;
}

export async function requireAdmin(request) {
  const accessToken = await getAccessToken(request);

  if (!accessToken) {
    throw redirect("/login");
  }

  // Verify admin status with the backend
  const response = await fetch(
    `${process.env.BACKEND_URL}/functions/check_admin.php`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (response.status === 401) {
    throw redirect("/login");
  }

  const data = await response.json();

  if (!data.is_admin) {
    throw redirect("/unauthorized");
  }

  return accessToken;
}
