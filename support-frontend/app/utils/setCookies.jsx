import { redirect } from "@remix-run/node";

export const getAccessToken = async (request) => {
  const cookieHeader = request.headers.get("Cookie");

  const accessToken = cookieHeader
    ? cookieHeader
        .split("; ")
        .find((row) => row.startsWith("access_token="))
        ?.split("=")[1]
    : null;

  if (!accessToken) {
    throw redirect("/login");
  }

  return accessToken;
};