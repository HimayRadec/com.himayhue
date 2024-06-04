import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
  ],
})