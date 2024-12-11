import { getUser, updateUser, deleteUser } from "@/actions/users.actions";
import UpdateProfile from "./components/update-profile";

export default async function Page() {
  const user = await getUser();

  return (
    <UpdateProfile
      user={user}
      updateUser={updateUser}
      deleteUser={deleteUser}
    />
  );
}
