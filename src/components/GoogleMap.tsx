'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Loader } from "@googlemaps/js-api-loader";

export default function GoogleMap({ searchQuery }: { searchQuery: string }) {
   const mapRef = useRef<HTMLDivElement>(null);
   const mapInstanceRef = useRef<google.maps.Map | null>(null);
   const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral | null>(null);

   useEffect(() => {
      const loader = new Loader({
         apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
         version: "weekly",
      });

      const initMap = async () => {
         if (!mapRef.current) return;

         // Import the necessary libraries
         const { Map } = await loader.importLibrary("maps");
         const { AdvancedMarkerElement } = await loader.importLibrary("marker");

         const mapOptions: google.maps.MapOptions = {
            center: currentLocation || { lat: 37.7749, lng: -122.4194 }, // Default to San Francisco if location is not set
            mapTypeId: "terrain",
            zoom: 15,
            mapId: "a1079c9cea2794a7",
         };

         // Create the map if not already created
         if (!mapInstanceRef.current) {
            mapInstanceRef.current = new Map(mapRef.current as HTMLDivElement, mapOptions);
         } else if (currentLocation) {
            mapInstanceRef.current.setCenter(currentLocation);
         }

         // Create an advanced marker if currentLocation is available
         if (currentLocation) {
            const marker = new AdvancedMarkerElement({
               map: mapInstanceRef.current,
               position: currentLocation,
               title: "Current Location",
            })
         };


         // findPlaces(mapInstanceRef.current);
         getCurrentLocation();

      };

      initMap();
   }, [currentLocation]);

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
         language: 'en-US',
         maxResultCount: 8,
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

   const getCurrentLocation = () => {
      if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(
            (position) => {
               setCurrentLocation({
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
               });
            },
            (error) => {
               console.error("Error getting location:", error);
            }
         );
      } else {
         console.error("Geolocation is not supported by this browser.");
      }
   };

   return (
      <div ref={mapRef} className="google-map w-full"></div>
   )
}
