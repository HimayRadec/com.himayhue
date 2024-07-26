"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

function AuthButton() {
  const { data: session } = useSession();

  return (
    <div className="">
      {session ? (
        <Button onClick={() => signOut()}>Logout</Button>
      ) : (
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      )}
    </div>
  );
}

export default AuthButton;
