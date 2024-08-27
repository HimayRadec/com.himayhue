'use client';
import React, { useEffect, useRef } from 'react';
import { Loader } from "@googlemaps/js-api-loader";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form"
import { Input } from '@/components/ui/input';
import { toast } from "@/components/ui/use-toast"

const FormSchema = z.object({
   searchInput: z.string().min(2, {
      message: "Search must be at least 2 characters.",
   }),
})

export default function Map() {
   const mapRef = useRef<HTMLDivElement>(null);

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


   useEffect(() => {
      const loader = new Loader({
         apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
         version: "weekly", // Ensure you're using the latest version
      });

      const initMap = async () => {
         if (!mapRef.current) return;

         // Import the necessary libraries
         const { Map } = await loader.importLibrary("maps");
         const { AdvancedMarkerElement, PinElement } = await loader.importLibrary("marker");

         const position = {
            lat: 33.4484,
            lng: -112.0740,
         };

         const mapOptions: google.maps.MapOptions = {
            center: position,
            mapTypeId: "terrain",
            zoom: 10,
            mapId: "a1079c9cea2794a7",
         };

         // Create the map
         const map = new Map(mapRef.current as HTMLDivElement, mapOptions);

         // Create an advanced marker
         new AdvancedMarkerElement({
            map: map,
            position: position,
            title: "Title text for the marker at lat: 37.419, lng: -122.03",
         });
      };

      initMap();
   }, []);


   return (
      <div className="flex flex-grow border-t">
         <div ref={mapRef} className="google-map w-3/4"></div>

         <div className='w-1/4 bg-neutral-950'>

            <div className='p-4'>
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
            </div>

         </div>

      </div>
   );
}
