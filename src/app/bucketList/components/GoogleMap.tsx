'use client'
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

   const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral | null>(null);
   const [locationCircle, setLocationCircle] = useState<google.maps.Circle | null>(null);
   const [mapOptions, setMapOptions] = useState<google.maps.MapOptions>({
      center: { lat: 37.7749, lng: -122.4194 },
      mapTypeId: "terrain",
      zoom: 15,
      mapId: "a1079c9cea2794a7",
   });

   // Cleanup markers on unmount
   useEffect(() => {
      return () => {
         searchResultPlacesMarkers.current.forEach(marker => marker.map = null);
         searchResultPlacesMarkers.current = [];
      };
   }, []);


   // Asks for the user's location and initializes the map
   useEffect(() => {
      getCurrentLocation();
      const initMap = async () => {
         if (!mapElement.current) return;

         const { Map } = await loadGoogleMap();
         await createMapInstance(Map);
      };

      initMap();

   }, []);

   // center map to current location
   useEffect(() => {
      if (currentLocation && mapInstanceRef.current) centerMapToCurrentLocation();
   }, [currentLocation]);


   // Update Search Result Places Pins when places change
   useEffect(() => {
      if (mapInstanceRef.current && searchResultPlaces.length) displaySearchResultsPlaces(searchResultPlaces);
   }, [searchResultPlaces]);

   // Update Bucket List Places Pins when places change
   useEffect(() => {
      if (mapInstanceRef.current && bucketListPlaces.length) displayBucketListPlaces(bucketListPlaces);
   }, [bucketListPlaces]);


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
      else console.error("Geolocation is not supported by this browser.");
   };

   const loadGoogleMap = async () => {
      const loader = new Loader({
         apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
         version: "weekly",
      });
      return loader.importLibrary("maps");
   };

   const createMapInstance = async (Map: any) => {
      if (!mapElement.current || mapInstanceRef.current) return;

      mapInstanceRef.current = new Map(mapElement.current as HTMLDivElement, mapOptions);
   };

   const centerMapToCurrentLocation = () => {
      if (!mapInstanceRef.current || !currentLocation) return;
      mapInstanceRef.current.setCenter(currentLocation);
   };


   async function displaySearchResultsPlaces(places: google.maps.places.Place[]) {
      if (!places.length) return;

      const bounds = new google.maps.LatLngBounds();
      const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

      // Clear previous markers
      searchResultPlacesMarkers.current.forEach(marker => marker.map = null);
      searchResultPlacesMarkers.current = [];

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
      if (!places.length) return;

      const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

      // Clear previous markers
      bucketListPlacesMarkers.current.forEach(marker => marker.map = null);
      bucketListPlacesMarkers.current = [];

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
      <div ref={mapElement} className="w-full" />
   )
}