// src/auth.ts

import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

// Assuming the database name is stored in an environment variable
const databaseName = process.env.DATABASE_NAME;

export const { handlers, signIn, signOut, auth } = NextAuth({
   adapter: MongoDBAdapter(clientPromise, { databaseName }),
   session: { strategy: "jwt" },
   ...authConfig,
});
