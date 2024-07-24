'use client'

import React, { useState } from 'react'
import Link from "next/link"
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button"
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function RegisterUser() {
   const [email, setEmail] = useState('')
   const [name, setName] = useState('')
   const [password, setPassword] = useState('')
   const [error, setError] = useState('')
   const [success, setSuccess] = useState('')

   const router = useRouter();

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()

      // Clear previous messages
      setError('')
      setSuccess('')

      // Check if all fields are filled
      if (!email || !name || !password) {
         setError('Please fill in all fields.')
         return
      }

      try {
         const response = await fetch('/api/registerUser', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, name, password }),
         })

         const data = await response.json()

         if (response.ok) {
            setSuccess(data.message)
            // Optionally reset form fields
            setEmail('')
            setName('')
            setPassword('')
            router.push('/login')
         } else {
            setError(data.message)
         }
      } catch (err) {
         setError('An unexpected error occurred. Please try again later.')
      }
   }

   return (
      <Card className="mx-auto max-w-sm mt-16">
         <CardHeader>
            <CardTitle className="text-xl">Sign Up</CardTitle>
            <CardDescription>
               Enter your information to create an account
            </CardDescription>
         </CardHeader>
         <CardContent>
            <form onSubmit={handleSubmit}>
               <div className="grid gap-4">
                  <div className="grid gap-2">
                     <Label htmlFor="name">Name</Label>
                     <Input
                        id="name"
                        placeholder="John Smith"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                     />
                  </div>
                  <div className="grid gap-2">
                     <Label htmlFor="email">Email</Label>
                     <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                     />
                  </div>
                  <div className="grid gap-2">
                     <Label htmlFor="password">Password</Label>
                     <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                     />
                  </div>
                  <Button type="submit" className="w-full">
                     Create an account
                  </Button>
                  <Button variant="outline" className="w-full">
                     Sign up with GitHub
                  </Button>
               </div>
               {error && <p className="mt-4 text-red-500">{error}</p>}
               {success && <p className="mt-4 text-green-500">{success}</p>}
               <div className="mt-4 text-center text-sm">
                  Already have an account?{" "}
                  <Link href="/login" className="underline">
                     Sign in
                  </Link>
               </div>
            </form>
         </CardContent>
      </Card>
   )
}
