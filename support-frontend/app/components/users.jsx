// app/components/Users.jsx
import { Link } from "@remix-run/react";

export default function Users({ users }) {
  if (!Array.isArray(users) || users.length === 0) {
    return <p>No users found.</p>;
  }

  return (
    <div className="p-6">
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {users.map((user) => (
          <li key={user.PK_ID}>
            <Link to={`/users/${user.PK_ID}`} className="block">
              <div className="p-5 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200">
                <h2 className="text-xl font-semibold mb-2">{user.username}</h2>
                <p className="text-gray-600 mb-1">
                  Phone Number: {user.phone_number}
                </p>
                {/* Add other user details if needed */}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
