'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Loader } from "@googlemaps/js-api-loader";

export default function GoogleMap({ searchQuery }: { searchQuery: string }) {
   const mapRef = useRef<HTMLDivElement>(null);
   const mapInstanceRef = useRef<google.maps.Map | null>(null); // Keep map instance


   useEffect(() => {
      const loader = new Loader({
         apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
         version: "weekly", // Ensure you're using the latest version
      });

      const initMap = async () => {
         if (!mapRef.current) return;

         // Import the necessary libraries
         const { Map } = await loader.importLibrary("maps");
         const { AdvancedMarkerElement } = await loader.importLibrary("marker");

         const position = {
            lat: 33.4484,
            lng: -112.0740,
         };

         const mapOptions: google.maps.MapOptions = {
            center: position,
            mapTypeId: "terrain",
            zoom: 15,
            mapId: "a1079c9cea2794a7",
         };

         // Create the map if not already created
         if (!mapInstanceRef.current) {
            mapInstanceRef.current = new Map(mapRef.current as HTMLDivElement, mapOptions);
         }

         // Create an advanced marker
         new AdvancedMarkerElement({
            map: mapInstanceRef.current,
            position: position,
            title: "Title text for the marker at lat: 37.419, lng: -122.03",
         });

         findPlaces(mapInstanceRef.current);
      };

      initMap();
   }, []); // Only run this effect on mount

   useEffect(() => {
      if (mapInstanceRef.current) {
         findPlaces(mapInstanceRef.current); // Re-run the place search when searchQuery changes
      }
   }, [searchQuery]); // Re-run the effect when searchQuery changes

   async function findPlaces(map: google.maps.Map) {
      console.log('Searching for places: ', searchQuery);

      const { Place } = await google.maps.importLibrary("places") as google.maps.PlacesLibrary;
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
      const request = {
         textQuery: searchQuery,
         fields: ['displayName', 'location', 'businessStatus'],
         // includedType: 'restaurant',
         // locationBias: { lat: 37.4161493, lng: -122.0812166 },
         isOpenNow: true,
         language: 'en-US',
         maxResultCount: 8,
         minRating: 3.2,
         region: 'us',
         useStrictTypeFiltering: false,
      };

      //@ts-ignore
      const { places } = await Place.searchByText(request);

      if (places.length) {
         console.log(`Found ${places.length} places`);

         const { LatLngBounds } = await google.maps.importLibrary("core") as google.maps.CoreLibrary;
         const bounds = new LatLngBounds();

         // Loop through and get all the results.
         places.forEach((place) => {
            const markerView = new AdvancedMarkerElement({
               map,
               position: place.location,
               title: place.displayName,
            });

            bounds.extend(place.location as google.maps.LatLng);
            console.log(place);
         });

         map.fitBounds(bounds);
         map.setZoom(15);

      }
      else {
         console.log('No results');
      }
   }


   return (
      <div ref={mapRef} className="google-map w-full"></div>
   )
}
