"use client";
import { Session } from "next-auth";
import { SignOut } from "./SignOut-Button";
import { SignIn } from "./SignIn-Button";
import * as React from "react";
import Link from "next/link";
import {
   NavigationMenu,
   NavigationMenuContent,
   NavigationMenuIndicator,
   NavigationMenuItem,
   NavigationMenuLink,
   NavigationMenuList,
   NavigationMenuTrigger,
   navigationMenuTriggerStyle,
   NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

export function MainNavigationMenu({ session }: { session: Session | null }) {
   return (
      <NavigationMenu className="border">
         <NavigationMenuList>
            <NavigationMenuItem>
               <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
               <NavigationMenuContent>
                  <NavigationMenuLink>Link</NavigationMenuLink>
               </NavigationMenuContent>
            </NavigationMenuItem>
         </NavigationMenuList>

         <NavigationMenuItem>
            <Link href="/docs" legacyBehavior passHref>
               <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Documentation
               </NavigationMenuLink>
            </Link>
         </NavigationMenuItem>
         {session ? <SignOut /> : <SignIn />}
         <NavigationMenuItem>
         </NavigationMenuItem>
      </NavigationMenu>
   );
}
