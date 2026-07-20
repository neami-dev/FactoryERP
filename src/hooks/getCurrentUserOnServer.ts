import { getUserById } from "@/lib/actions/user.actions";
import { getServerSession } from "next-auth";

export async function getCurrentUserOnServer() {
  const session = await getServerSession();
  const userId = Number(session?.user?.id);

  if (!userId) return null;

  const user = await getUserById(userId);
  return user;
}
