// 'use client'
import { useState, useEffect, useRef } from 'react'
import { Loader } from "@googlemaps/js-api-loader";

// Types
import { PinColor } from '@/types/bucketListTypes';
import { BucketListPlace } from '@/types/bucketListTypes';

interface GoogleMapProps {
   searchResultPlaces: google.maps.places.Place[];
   bucketListPlaces: BucketListPlace[];
}

export default function GoogleMap({ searchResultPlaces, bucketListPlaces }: GoogleMapProps) {
   const mapElement = useRef<HTMLDivElement>(null); // Reference to the map div element
   const mapInstanceRef = useRef<google.maps.Map | null>(null); // Google Map instance

   const searchResultPlacesMarkers = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
   const bucketListPlacesMarkers = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

   const [locationCircle, setLocationCircle] = useState<google.maps.Circle | null>(null);
   const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral | null>(null);

   const DEFAULT_CENTER = { lat: 39.8283, lng: -98.5795 }; // Center of USA
   const MAP_OPTIONS: google.maps.MapOptions = {
      center: DEFAULT_CENTER,
      mapTypeId: "terrain",
      zoom: 15,
      mapId: "a1079c9cea2794a7",
   };

   // Cleanup markers on unmount
   useEffect(() => {
      return () => {
         searchResultPlacesMarkers.current.forEach(marker => marker.map = null);
         searchResultPlacesMarkers.current = [];
      };
   }, []);

   useEffect(() => {
      (async () => {
         await initMap();

         try {
            const coords = await getCurrentLocation();
            if (coords) mapInstanceRef.current?.setCenter(coords);
         }
         catch {
            console.warn("User denied location or something went wrong.");
         }
      })();
   }, []);


   // Update Search Result Places Pins when places change
   useEffect(() => {
      if (mapInstanceRef.current) displaySearchResultsPlaces(searchResultPlaces);
   }, [searchResultPlaces]);


   // Update Bucket List Places Pins when places change
   useEffect(() => {
      if (mapInstanceRef.current) displayBucketListPlaces(bucketListPlaces);
   }, [bucketListPlaces]);


   async function getCurrentLocation(): Promise<google.maps.LatLngLiteral | null> {
      if (!navigator.geolocation) {
         console.error("Geolocation is not supported by this browser.");
         return null;
      }

      return new Promise((resolve, reject) => {
         navigator.geolocation.getCurrentPosition(
            (position) => {
               const coords = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
               };
               setCurrentLocation(coords);
               resolve(coords); // ✅ return location directly
            },
            (error) => {
               console.error("Error getting location:", error);
               reject(null);
            }
         );
      });
   }


   async function initMap(): Promise<void> {
      if (!mapElement.current) return;

      const loader = new Loader({
         apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
         version: 'weekly',
      });

      try {
         const { Map } = await loader.importLibrary('maps');
         mapInstanceRef.current = new Map(mapElement.current, MAP_OPTIONS);
      }
      catch (e) {
         console.error('Error loading Google Maps:', e);
      }
   }

   async function displaySearchResultsPlaces(places: google.maps.places.Place[]) {
      // Clear previous markers
      searchResultPlacesMarkers.current.forEach(marker => marker.map = null);
      searchResultPlacesMarkers.current = [];

      if (!places.length) return;

      const bounds = new google.maps.LatLngBounds();
      const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

      // Create a new marker for each place
      places.forEach(place => {
         if (place.location) bounds.extend(place.location as google.maps.LatLng);

         // Create Pin
         const searchResultPin = new PinElement({
            scale: 1.0,
            background: PinColor.Result,  // Vibrant yellow for optimism and attention
            borderColor: PinColor.Result,  // Slightly darker yellow border
            glyphColor: '#fff',  // Black icon for better contrast
         });

         // Add marker to map
         const marker = new AdvancedMarkerElement({
            position: place.location || { lat: 0, lng: 0 },
            map: mapInstanceRef.current,
            title: place.displayName || "Result",
            content: searchResultPin.element,
         });
         searchResultPlacesMarkers.current.push(marker);

      });

      mapInstanceRef.current?.fitBounds(bounds);
      if (mapInstanceRef.current?.getZoom()! > 18) mapInstanceRef.current?.setZoom(18);

   }

   async function displayBucketListPlaces(places: BucketListPlace[]) {
      // Clear previous markers
      bucketListPlacesMarkers.current.forEach(marker => marker.map = null);
      bucketListPlacesMarkers.current = [];

      if (!places.length) return;

      const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;


      // Create a new marker for each place
      places.forEach(place => {
         // Create Pin
         const bucketListPin = new PinElement({
            scale: 1.0,
            background: place.dateVisited ? PinColor.Visited : PinColor.Unvisited,
            borderColor: place.dateVisited ? PinColor.Visited : PinColor.Unvisited,
            glyphColor: '#fff',
         });

         // Add marker to map
         const marker = new AdvancedMarkerElement({
            position: place.location,
            map: mapInstanceRef.current,
            title: place.displayName,
            content: bucketListPin.element,
         });
         bucketListPlacesMarkers.current.push(marker);
      });

   }

   return (
      <div ref={mapElement} className="w-full">
      </div>
   )
}