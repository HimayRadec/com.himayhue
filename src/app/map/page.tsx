'use client';
import React, { useEffect, useRef } from 'react';
import { Loader } from "@googlemaps/js-api-loader";

export default function Map() {
   const mapRef = useRef<HTMLDivElement>(null);

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
      <div className="flex border justify-center items-center h-screen bg-black">
         <div ref={mapRef} className="w-full max-w-4xl h-[500px] border-4 border-gray-300 shadow-lg"></div>
      </div>
   );
}
