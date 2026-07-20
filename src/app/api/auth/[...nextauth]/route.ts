import NextAuth from "next-auth";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      role?: string;
      username?: string;
    } & DefaultSession["user"];
  }
  interface User {
    id?: string;
    role?: string;
    username?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
