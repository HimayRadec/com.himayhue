'use client';
import React, { useEffect, useRef } from 'react';
import { Loader } from "@googlemaps/js-api-loader";

export default function GoogleMapComponent() {
   const mapRef = useRef(null);

   useEffect(() => {
      const apiKey: string = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

      const loader = new Loader({
         apiKey: apiKey, // Replace with your actual Google Maps API key
         version: "weekly",
      });

      loader.load().then(() => {
         if (mapRef.current) {
            const map = new google.maps.Map(mapRef.current, {
               center: { lat: 33.4484, lng: -112.0740 }, // Phoenix coordinates
               zoom: 10,
            });
         }
      }).catch((e) => {
         console.error("Error loading Google Maps", e);
      });
   }, []);

   return (
      <div>
         <div ref={mapRef} style={{ width: '100%', height: '500px' }}></div>
      </div>
   );
}
