// app/routes/index.jsx
import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div>
      <h1>Welcome to the Front Page</h1>
      <p>This is a public page.</p>
      <Link to="/login">Admin Login</Link>
    </div>
  );
}
