"use client";

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import UserButton from "./UserButton";
import { Button } from "./ui/button";

export default function NavBar() {
   const session = useSession();
   const user = session.data?.user;
   console.log(session);
   const links = ["bucketList"]

   return (
      <header className="sticky w-full top-0 bg-background px-3 shadow-sm border-b">
         <nav className="mx-auto flex h-14 items-center justify-between gap-3">
            <div>
               <Link href="/" className="">
                  Home
               </Link>s
               <Link href="/bucketList" className="ml-4">
                  Bucket List
               </Link>
            </div>

            <div className="flex items-center gap-3">
               {user && user.name}
               {user && <UserButton user={user} />}
            </div>

            {!user && session.status !== "loading" && <SignInButton />}
         </nav>
      </header>
   );
}

function SignInButton() {
   return <Button onClick={() => signIn()}>Sign in</Button>;
}