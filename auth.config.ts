import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

export const authConfig = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    authorized({ request, auth }: any) {
      // array  of regex patterns of paths i want to  pprotect

      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/,
        /\/admin\/(.*)/,
      ];
      const pathname = new URL(request.url).pathname;

      if (!auth && protectedPaths.some((path) => path.test(pathname))) {
        return false;
      }

      ///
      //check for session cart cookie

      if (!request.cookies.get("sessionCartId")) {
        // gennerate new session for cart id cookie
        const sessionCartId = crypto.randomUUID();
        //clone req headers
        const newRequestHeaders = new Headers(request.headers);
        // create new response  and  the new headers

        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });

        //set new cookie
        response.cookies.set("sessionCartId", sessionCartId);
        return response;
      } else {
        return NextResponse.next();
      }
    },
  },
  providers: [],
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;
