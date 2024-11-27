'use client';
import React, { use, useEffect, useRef, useState } from 'react';
import { Loader } from "@googlemaps/js-api-loader";

interface GoogleMapProps {
   searchQuery: string;
   setSearchResultsDetails: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * Google map component that displays a map centered on the user's location and a blue location circle.
 * If a search query is provided, it will search for places on the map and drop markers on the locations.
 * If the user has an existing bucket list, it will drop markers on the locations.
 * 
 * @param searchQuery - The search query to search for places on the map.
 * @returns JSX.Element GoogleMap
 */
export default function GoogleMap({ searchQuery, setSearchResultsDetails }: GoogleMapProps) {
   const mapElement = useRef<HTMLDivElement>(null); // Reference to the map div element
   const mapInstanceRef = useRef<google.maps.Map | null>(null); // Google Map instance
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
         if (!mapElement.current) return;

         const { Map } = await loader.importLibrary("maps");

         // Create a new map instance if it doesn't exist
         if (!mapInstanceRef.current) mapInstanceRef.current = new Map(mapElement.current as HTMLDivElement, mapOptions);

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
      if (mapInstanceRef.current && searchQuery) {
         searchOnGoogleMap(mapInstanceRef.current);
      }
   }, [searchQuery]);

   async function searchOnGoogleMap(map: google.maps.Map) {
      const { Place } = await google.maps.importLibrary("places") as google.maps.PlacesLibrary;
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

      // Create a new request object with the search query
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

         setSearchResultsDetails(`Found ${places[0].displayName} places`);

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
      <div ref={mapElement} className="google-map w-full"></div>
   )
}
