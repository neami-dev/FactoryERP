import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/((?!api/auth|login|forgot-password|reset-password|_next|favicon.ico|icons|images|fonts|public).*)",
  ],
};
// export const config = {
//   matcher: [
//     "/((?!api/auth|login|_next|favicon.ico|icons|images|fonts|public|api/reception/pdf/weights/|reception/pdf/weights/).*)",
//   ],
// };
