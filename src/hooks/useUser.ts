import { IUser } from "@/interfaces";
import { getUserById } from "@/lib/actions/user.actions";
import { useQuery } from "@tanstack/react-query";

import { UseQueryResult } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export default function useUser(): UseQueryResult<IUser, Error> {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery<IUser, Error>({
    queryKey: ["me"],
    queryFn: async () => {
      const sessionRes = await getUserById(Number(userId));
      if (!sessionRes) {
        throw new Error("User not found");
      }
      return sessionRes;
    },
    enabled: !!userId,
    refetchOnWindowFocus: false,
  });
}
