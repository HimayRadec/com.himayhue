import { signIn } from "next-auth/react"
import Link from "next/link"
export function SignIn() {
   return <Link href='/login'>Sign In</Link>
}

