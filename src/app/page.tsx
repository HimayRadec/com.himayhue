import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SignIn } from "@/components/sign-in";
import { SignOut } from "@/components/signout-button";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col items-center justify-center gap-1">
        <Image
          src={session?.user?.image ?? ''}
          alt="logo"
          width={200}
          height={200}
        />
        <div>Hello my name is {session?.user?.name}</div>
        <div>My email is {session?.user?.email}</div>
      </div>
      <div className="border">
        {session ? <SignOut /> : <SignIn />}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>

    </main>
  );
}
