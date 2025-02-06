'use client';
import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
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

interface MapsSearchFormProps {
   setMapSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

export default function MapsSearchForm({ setMapSearchQuery }: MapsSearchFormProps) {
   const [inputText, setInputText] = useState('');


   // Validation and form state management
   const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
         searchInput: "",
      },
   })


   function onSubmit(data: z.infer<typeof FormSchema>) {

      setMapSearchQuery(data.searchInput); // Update the shared state
      setInputText(''); // Reset the input field after submission


      console.log(`Search: ${data.searchInput}`);
   }


   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-3">
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
