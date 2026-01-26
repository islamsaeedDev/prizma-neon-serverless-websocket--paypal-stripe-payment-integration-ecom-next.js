import NextAuth, { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma.node";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcryptjs";
import { authConfig } from "./auth.config";
import { cookies } from "next/headers";

export const config = {
  ...authConfig,
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },

      async authorize(credentials) {
        if (credentials === null) return null;

        //find use in DB

        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        if (!user) {
          return null;
        }

        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password,
          );
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }
        // if password doesn`t  not match :)
        return null;
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        //if  no name get it from  email
        if (user.name === "NO_NAME") {
          token.name = user.email!.split("@")[0];

          // update DB as  the  token
          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }

        //
        if (trigger === "signIn" || trigger === "signUp") {
          const cookiesObject = await cookies();
          const sessionCartId = cookiesObject.get("sessionCartId")?.value;

          if (sessionCartId) {
            const sessionCart = await prisma.cart.findFirst({
              where: { id: sessionCartId },
            });

            if (sessionCart) {
              //delete current user cart
              await prisma.cart.deleteMany({
                where: { userId: user.id },
              });

              //update session cart
              await prisma.cart.update({
                where: { id: sessionCartId },
                data: { userId: user.id },
              });
              //set sessionCartId cookie
              //cookiesObject.set("sessionCartId", sessionCartId);
            }
          }
        }
      }

      return token;
    },
    async session({ session, user, trigger, token }: any) {
      //set user id from token
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;

      //handle name update
      if (trigger === "update") {
        session.user.name = user.name;
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
