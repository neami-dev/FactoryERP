"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { getUserById } from "./actions/user.actions";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session.user.id) {
      getUserById(Number(session.user.id))
        .then((res) => {
          if (!res) {
            signOut({ callbackUrl: "/login" });
          }
        } )
         
    }
  }, [status]);

  return <>{children}</>;
}
