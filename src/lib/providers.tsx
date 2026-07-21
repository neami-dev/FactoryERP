"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from "react";
import AuthGuard from "./AuthGuard";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import CheckHasPermission from "./CheckHasPermission";


export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <AuthGuard>
          {/* <CheckHasPermission> */}
            {children}
          {/* </CheckHasPermission> */}
          </AuthGuard>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </SessionProvider>
  );
}
