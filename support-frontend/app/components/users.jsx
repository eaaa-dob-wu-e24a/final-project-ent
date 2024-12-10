// app/components/Users.jsx
import { Link } from "@remix-run/react";
import PropTypes from "prop-types";

export default function Users({ users, layout = "flex" }) {
  if (!Array.isArray(users) || users.length === 0) {
    return <p>Ingen brugere fundet.</p>;
  }

  // Define class names based on the layout prop
  const containerClasses =
    layout === "grid"
      ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      : "flex gap-4 overflow-x-auto whitespace-nowrap";

  const itemClasses =
    layout === "grid"
      ? "bg-white border border-gray-200 rounded-lg shadow p-4"
      : "shrink-0 w-60 bg-white border border-gray-200 rounded-lg shadow p-4";

  return (
    <div className="w-full max-w-[1200px] p-4">
      <h4 className="text-xl font-semibold mb-4">Brugere</h4>
      <ul className={containerClasses}>
        {users.map((user) => (
          <li key={user.PK_ID} className={itemClasses}>
            <Link to={`/users/${user.user_login_id}`} className="block">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {user.username}
                </h3>
                <p className="text-sm text-gray-500">
                  Tlf: {user.phone_number}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

Users.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      PK_ID: PropTypes.string.isRequired,
      user_login_id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      phone_number: PropTypes.string,
    })
  ).isRequired,
  layout: PropTypes.oneOf(["flex", "grid"]),
};
