"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import {
   Menubar,
   MenubarContent,
   MenubarItem,
   MenubarMenu,
   MenubarSeparator,
   MenubarShortcut,
   MenubarTrigger,
} from "@/components/ui/menubar"




const components: { title: string; href: string; description: string }[] = [
   {
      title: "Alert Dialog",
      href: "/docs/primitives/alert-dialog",
      description:
         "A modal dialog that interrupts the user with important content and expects a response.",
   },
   {
      title: "Hover Card",
      href: "/docs/primitives/hover-card",
      description:
         "For sighted users to preview content available behind a link.",
   },
   {
      title: "Progress",
      href: "/docs/primitives/progress",
      description:
         "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
   },
   {
      title: "Scroll-area",
      href: "/docs/primitives/scroll-area",
      description: "Visually or semantically separates content.",
   },
   {
      title: "Tabs",
      href: "/docs/primitives/tabs",
      description:
         "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
   },
   {
      title: "Tooltip",
      href: "/docs/primitives/tooltip",
      description:
         "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
   },
]

export function MainNavigationMenu() {
   return (
      <Menubar className="justify-end">

         <MenubarMenu>
            <MenubarTrigger>Languages</MenubarTrigger>
            <MenubarContent>
               <MenubarItem>Javascript</MenubarItem>
               <MenubarItem>Swift</MenubarItem>
            </MenubarContent>
         </MenubarMenu>
         <MenubarMenu>
            <MenubarTrigger>Projects</MenubarTrigger>
            <MenubarContent>
               <MenubarItem>Pump Stats</MenubarItem>
            </MenubarContent>
         </MenubarMenu>
         <MenubarMenu>
            <MenubarTrigger>Demos</MenubarTrigger>
            <MenubarContent>
               <MenubarItem>Login</MenubarItem>
            </MenubarContent>
         </MenubarMenu>

      </Menubar>


   )
}
