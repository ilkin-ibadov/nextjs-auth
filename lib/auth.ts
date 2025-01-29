import { NextAuthOptions, getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";

import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

import { MongoDBAdapter } from "@auth/mongodb-adapter"
import client from "../lib/db"

export const authConfig: NextAuthOptions = {
  adapter: MongoDBAdapter(client),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      return ({ ...token, ...user })
    },
    session: async ({ session, token }) => {
      console.log("Token from method:", token)

      session.user = token;

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export async function loginIsRequiredServer() {
  const session = await getServerSession(authConfig);
  if (!session) return redirect("/");
}

export function loginIsRequiredClient() {
  if (typeof window !== "undefined") {
    const session = useSession();
    const router = useRouter();
    if (!session) router.push("/");
  }
}
