import { createCookie } from "@remix-run/node";

export const accessTokenCookie = createCookie("access_token", {
  path: "/", // Cookie will be sent to all routes
  secure: true, // Only send over HTTPS
  sameSite: "none", // For cross-site usage if needed
  // No 'expires' or 'maxAge' here means it's a session cookie by default.
  // Add these if you want to control cookie lifetime.
});
