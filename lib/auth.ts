import { NextAuthOptions } from "next-auth";

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
      console.log("Token from method:", token)
      return ({ ...token, ...user })
    },
    session: async ({ session, token }) => {
      session.user = token;
      
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
