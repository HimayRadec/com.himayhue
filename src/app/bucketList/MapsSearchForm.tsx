'use client';
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


interface MapsSearchFormProps {
   /**
    * Function to update the map search query state in the parent component.
    * @param query - The search query string entered by the user.
    */
   setMapSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}


/**
 * MapsSearchForm Component
 *
 * A reusable form for searching locations on Google Maps.
 * Validates the input to ensure it meets the required criteria before submission.
 *
 * Features:
 * - Form validation with Zod
 * - State management using React Hook Form
 * - Resetting input after successful submission
 *
 * @param {MapsSearchFormProps} props - The component props.
 * @returns {JSX.Element} The rendered search form component.
 */
export default function MapsSearchForm({ setMapSearchQuery }: MapsSearchFormProps) {
   const [inputText, setInputText] = useState('');

   // Validation schema using Zod
   const FormSchema = z.object({
      searchInput: z
         .string()
         .min(2, { message: "Search must be at least 2 characters." }),
   });

   // Initialize form state and validation
   const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: { searchInput: "" },
   });


   /**
    * Handles form submission.
    * Updates the shared search query state and resets the input field.
    *
    * @param {z.infer<typeof FormSchema>} data - The validated form data.
    */
   function onSubmit(data: z.infer<typeof FormSchema>) {
      setMapSearchQuery(data.searchInput); // Update the shared state
      setInputText(""); // Clear the input field
      console.log(`Search: ${data.searchInput}`); // Log the search query for debugging
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
