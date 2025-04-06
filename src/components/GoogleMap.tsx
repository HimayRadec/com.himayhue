'use client';
import { useEffect, useRef, useState, Dispatch, SetStateAction } from 'react';
import { Loader } from "@googlemaps/js-api-loader";

interface GoogleMapProps {
   searchQuery: string;
   setSearchResultsDetails: Dispatch<SetStateAction<string>>;
   setPlaces: Dispatch<SetStateAction<google.maps.places.Place[]>>;

}

/**
 * Google map component that displays a map centered on the user's location and a blue location circle.
 * If a search query is provided, it will search for places on the map and drop markers on the locations.
 * If the user has an existing bucket list, it will drop markers on the locations.
 * 
 * @param searchQuery - The search query to search for places on the map.
 * @returns JSX.Element GoogleMap
 */
export default function GoogleMap({ searchQuery, setSearchResultsDetails, setPlaces }: GoogleMapProps) {
   const mapElement = useRef<HTMLDivElement>(null); // Reference to the map div element
   const mapInstanceRef = useRef<google.maps.Map | null>(null); // Google Map instance
   const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral | null>(null);
   const [locationCircle, setLocationCircle] = useState<google.maps.Circle | null>(null);
   const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);


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


      const initMap = async () => {
         // Checks for an element with the ref mapRef
         if (!mapElement.current) return;

         const loader = new Loader({
            apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
            version: "weekly",
         });

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
      const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

      // Here is where you pass the parameters for the search request
      const request = {
         textQuery: searchQuery,
         fields: ['formattedAddress', 'displayName', 'location', 'websiteURI', 'primaryTypeDisplayName',],
         language: 'en-US',
         maxResultCount: 15,
         region: 'us',
         useStrictTypeFiltering: false,
      };

      const { places } = await Place.searchByText(request);

      if (places.length) {
         const { LatLngBounds } = await google.maps.importLibrary("core") as google.maps.CoreLibrary;
         const bounds = new LatLngBounds();

         // Clear previous markers
         markersRef.current.forEach(marker => marker.map = null);  // Remove each marker from the map
         markersRef.current = []; // Clear the markers arrayy


         // Collect all the places into a new array
         const newPlaces: google.maps.places.Place[] = places.map((place) => {
            if (place.location) bounds.extend(place.location as google.maps.LatLng);

            // Create pins
            const searchResultPin = new PinElement({
               scale: 1.0,
               background: '#ffc107',  // Vibrant yellow for optimism and attention
               borderColor: '#ffab00',  // Slightly darker yellow border
               glyphColor: '#fff',  // Black icon for better contrast
            });

            // Add marker to map
            const marker = new AdvancedMarkerElement({
               position: place.location || { lat: 0, lng: 0 },
               map: map,
               title: place.displayName || "Result",
               content: searchResultPin.element,
            });
            markersRef.current.push(marker);

            return place;
         });

         setPlaces(newPlaces);
         map.fitBounds(bounds);
         if (map.getZoom()! > 18) map.setZoom(18);
      }
      else console.log('No results for:', searchQuery);
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
      else console.error("Geolocation is not supported by this browser.");
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
      <div ref={mapElement} className="w-full" />
   )
}
