import getSession from '@/lib/getSession'
import { redirect } from "next/navigation";
import React from 'react'

export default async function Dashboard() {
   const session = await getSession()
   const user = session?.user;

   if (!user) {
      redirect("/signin?callbackUrl=/dashboard");
   }

   return (
      <div>Welcome {user.name}</div>
   )
}
