'use client'
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"

import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form"
import { z } from "zod"

const formSchema = z.object({
   username: z.string().min(2, {
      message: "username must be at least 2 characters.",
   }),
})


export default function DatabaseForm() {
   const form = useForm()
   function onSubmit() {
      console.log(`Submitted`)
   }

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
               control={form.control}
               name="username"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Username</FormLabel>
                     <FormControl>
                        <Input placeholder="shadcn" {...field} />
                     </FormControl>
                     <FormDescription>
                        This is your public display name.
                     </FormDescription>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <Button type="submit">Submit</Button>
         </form>
      </Form>
   )
}