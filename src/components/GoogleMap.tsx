'use client';
import React, { use, useEffect, useRef, useState } from 'react';
import { Loader } from "@googlemaps/js-api-loader";

export default function GoogleMap({ searchQuery }: { searchQuery: string }) {
   const mapRef = useRef<HTMLDivElement>(null);
   const mapInstanceRef = useRef<google.maps.Map | null>(null);
   const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral | null>(null);
   const [locationCircle, setLocationCircle] = useState<google.maps.Circle | null>(null);

   const [mapOptions, setMapOptions] = useState<google.maps.MapOptions>({
      center: { lat: 37.7749, lng: -122.4194 },
      mapTypeId: "terrain",
      zoom: 15,
      mapId: "a1079c9cea2794a7",
   });


   // Asks for the user's location
   useEffect(() => {
      getCurrentLocation();
   }, []);


   // Create Map
   useEffect(() => {
      const loader = new Loader({
         apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
         version: "weekly",
      });

      const initMap = async () => {
         // Checks for an element with the ref mapRef
         if (!mapRef.current) return;

         const { Map } = await loader.importLibrary("maps");

         // Create a new map instance if it doesn't exist
         if (!mapInstanceRef.current) mapInstanceRef.current = new Map(mapRef.current as HTMLDivElement, mapOptions);

         // Sets the center of the map to the current location and adds a marker
         if (currentLocation) {

            updateLocationCircle(currentLocation);
            updateMapCenter(currentLocation);
            mapInstanceRef.current.setCenter(currentLocation);
         };
      };

      initMap();
   }, [currentLocation]);

   useEffect(() => {
      if (mapInstanceRef.current) {
         searchOnGoogleMap(mapInstanceRef.current);
      }
   }, [searchQuery]);

   async function searchOnGoogleMap(map: google.maps.Map) {
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

      console.log('Searching for places: ', searchQuery);

      // Stores the results of the search in the places variable
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
            console.log(`found place: ${place.displayName}`);
            console.log(place.toJSON());
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
      }
      else {
         console.error("Geolocation is not supported by this browser.");
      }
   };

   function updateLocationCircle(newCenter: google.maps.LatLngLiteral) {
      if (locationCircle) {
         locationCircle.setCenter(newCenter);
      }
      else {
         // Create a new location circle
         const newCircle = new google.maps.Circle({
            strokeColor: "#ffffff",
            fillColor: "#75aaff",
            fillOpacity: 1,
            map: mapInstanceRef.current,
            center: newCenter,
            radius: 5,
         });


         setLocationCircle(newCircle);
      }
   }

   function updateMapCenter(newCenter: google.maps.LatLngLiteral) {
      setMapOptions((prevOptions) => ({
         ...prevOptions,
         center: newCenter,
      }));
   }


   return (
      <div ref={mapRef} className="google-map w-full"></div>
   )
}
