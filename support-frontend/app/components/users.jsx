export default function Users({ users }) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>
      <ul className="space-y-4">
        {users.map((user) => (
          <li key={user.PK_ID} className="p-4 border rounded shadow">
            <p className="text-lg font-semibold">Username: {user.username}</p>
            <p>Phone Number: {user.phone_number}</p>
            <p>Rating: {user.rating}</p>
            <p>User Login ID: {user.user_login_id}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
