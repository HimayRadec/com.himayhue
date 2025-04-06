// src/auth.ts

import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import type { AdapterUser } from "next-auth/adapters";

// Assuming the database name is stored in an environment variable
const databaseName = process.env.DATABASE_NAME;


export const { handlers, signIn, signOut, auth } = NextAuth({
   adapter: MongoDBAdapter(clientPromise, { databaseName }),
   session: { strategy: "jwt" },
   ...authConfig,
   callbacks: {
      async jwt({ token, user }) {
         if (user) {
            const id = (user as AdapterUser).id;
            token.id = id;
         }
         return token;
      },

      // Add Mongo _id to session
      async session({ session, token }) {
         if (token?.id) {
            session.user.id = token.id as string;
         }
         return session;
      },
   },
});
