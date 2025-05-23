import Apple from "next-auth/providers/apple"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"

export default {
   providers: [
      // Apple,
      GitHub,
      Google({
         clientId: process.env.GOOGLE_CLIENT_ID,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
   ]
} satisfies NextAuthConfig