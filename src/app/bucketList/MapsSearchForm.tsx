'use client';
import React, { useState } from 'react'
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

export default function MapsSearchForm({ setMapSearchQuery }: { setMapSearchQuery: React.Dispatch<React.SetStateAction<string>> }) {
   const [inputText, setInputText] = useState('');

   const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputText(event.target.value);

      //run auto suggestion
   };


   const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
         searchInput: "",
      },
   })


   function onSubmit(data: z.infer<typeof FormSchema>) {

      setMapSearchQuery(inputText); // Update the shared state
      setInputText(''); // Reset the input field after submission


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
                        <Input
                           placeholder="Search Google Maps"
                           {...field}
                           // Wrap field.onChange to handle additional state updates
                           onChange={(event) => {
                              field.onChange(event);  // Call React Hook Form's onChange
                              setInputText(event.target.value);  // Update custom state
                           }}
                        />
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
