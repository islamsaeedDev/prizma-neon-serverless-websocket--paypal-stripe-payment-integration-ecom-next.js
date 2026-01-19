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
