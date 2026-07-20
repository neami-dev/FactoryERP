import { usercolumns } from "@/components/users/userColums";
import { UsersTable } from "@/components/users/UsersTable";
import { getAllRoles } from "@/lib/actions/role.actions";

import { getAllUsers } from "@/lib/actions/user.actions";

export default async function page() {
  const allUsers = await getAllUsers({});
  const allRoles = await getAllRoles();
 

  return (
    <section>
      <UsersTable data={allUsers} columns={usercolumns} roles={allRoles?.data} />
    </section>
  );
}
