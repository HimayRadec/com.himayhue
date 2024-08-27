'use client';
import React from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Input } from '@/components/ui/input';
import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form"

const FormSchema = z.object({
   searchInput: z.string().min(2, {
      message: "Search must be at least 2 characters.",
   }),
})

export default function MapsSearchForm() {

   const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
         searchInput: "",
      },
   })


   function onSubmit(data: z.infer<typeof FormSchema>) {
      toast({
         title: "You submitted the following values:",
         description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
               <code className="text-white">{JSON.stringify(data, null, 2)}</code>
            </pre>
         ),
      })




      console.log(`Search: ${data.searchInput}`);
   }


   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-3">
            <FormField
               control={form.control}
               name="searchInput"
               render={({ field }) => (
                  <FormItem>
                     <FormControl>
                        <Input placeholder="Search Google Maps" {...field} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <Button type="submit">Search</Button>
         </form>
      </Form>
   )
}
