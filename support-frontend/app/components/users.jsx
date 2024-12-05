// app/components/Users.jsx
export default function Users({ users }) {
  if (!users || users.length === 0) {
    return <p>No users found.</p>;
  }

  return (
    <div>
      <h2>All Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.PK_ID}>
            <p>Username: {user.username}</p>
            <p>Phone Number: {user.phone_number}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
