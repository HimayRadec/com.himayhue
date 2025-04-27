// middleware.ts
import NextAuth from "next-auth";
import authConfig from "./auth.config";

// Simply export auth middleware directly
export const { auth: middleware } = NextAuth(authConfig);
