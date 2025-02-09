'use client';
import React, { useEffect, useState } from 'react';
import {
   APIProvider,
   Map,
   AdvancedMarker,
   Pin,
} from '@vis.gl/react-google-maps';
import MapsSearchForm from '../bucketList/MapsSearchForm';
import { BucketListSpot, PinColor } from '@/types/bucketList';



export default function GoogleMap() {
   type pointOfInterest = { key: string; location: google.maps.LatLngLiteral };
   const googleMapsAPIKey: string = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;


   const [mapSearchQuery, setMapSearchQuery] = useState<string>('');
   const [mapSearchResults, setMapSearchResults] = useState<google.maps.places.PlaceResult[]>([]);
   const [currentLatLong, setCurrentLatLong] = useState<google.maps.LatLngLiteral>({ lat: 33.4228583, lng: -111.944015 });
   const [placesData, setPlacesData] = useState<google.maps.places.Place[]>([]);
   const [hoveredIndex, setHoveredIndex] = useState<number | null>(null); // Track the hovered index
   const [bucketListSpots, setBucketListSpots] = useState<BucketListSpot[]>([
      { id: '1', name: 'Grand Canyon', formattedAddress: '', location: { lat: 36.1069, lng: -112.1129 }, visited: false },
      { id: '2', name: 'Yellowstone National Park', formattedAddress: 'A national park in Wyoming', location: { lat: 44.4280, lng: -110.5885 }, visited: true },
   ]);

   const [pointsOfInterest, setPointsOfInterest] = useState<pointOfInterest[]>([]);

   async function findPlaces(searchQuery: string) {
      if (!searchQuery) return;

      // Load the Places library from the Google Maps JavaScript API
      const { Place } = (await google.maps.importLibrary("places")) as google.maps.PlacesLibrary;

      // Create a request object with the search query and other parameters
      const request = {
         textQuery: searchQuery,
         fields: ['addressComponents', 'formattedAddress', 'displayName', 'location', 'businessStatus'],
         locationBias: currentLatLong,
         // isOpenNow: true,
         language: 'en-US',
         maxResultCount: 100,
         // minRating: 3.2,
         region: 'us',
         useStrictTypeFiltering: false,
      };

      const { places: placesResults } = await Place.searchByText(request) as { places: google.maps.places.Place[] };

      setPlacesData(placesResults);

      if (placesResults.length) {

         const newPointsOfInterest = placesResults.map((place) => {

            // Return the new point of interest object
            return {
               key: `${place.id}`,
               location: {
                  lat: place.location!.lat(),
                  lng: place.location!.lng(),
               },
            };
         });


         setPointsOfInterest([...newPointsOfInterest]);
      }
      else {
         console.log('No results');
      }
   }

   useEffect(() => {
      console.log('Searching for:', mapSearchQuery);
      findPlaces(mapSearchQuery);
   }, [mapSearchQuery]);

   /**
    * 
    * @param props { pointOfInterest: pointsOfInterest[] } - An array of points of interest to be displayed on the map.
    * @returns {JSX.Element} A component that renders map pins for the given points of interest.
    */
   const MapPins = (props: { pointsOfInterest: pointOfInterest[] }) => {
      return (
         <>
            {/* Current Location Map Pin  */}
            <AdvancedMarker
               key='myLocation'
               position={currentLatLong}
            >
               <div className="relative flex items-center justify-center">
                  {/* Outer pulsing circle */}
                  <div className="absolute w-6 h-6 rounded-full bg-blue-400 opacity-50 animate-pulse"></div>
                  {/* Inner solid circle */}
                  <div className="w-4 h-4 rounded-full bg-blue-500 shadow-md"></div>
               </div>
            </AdvancedMarker>

            {/* Map Pins For Search Results  */}
            {props.pointsOfInterest.map((pointOfInterest, index) => (
               <AdvancedMarker
                  key={pointOfInterest.key}
                  position={pointOfInterest.location}
                  onMouseEnter={() => setHoveredIndex(index)}  // Highlight map pin on hover
                  onMouseLeave={() => setHoveredIndex(null)}  // Reset hover state
               >
                  <Pin
                     background={hoveredIndex === index ? '#FBBC04' : '#b8180d'} // Highlight if hovered
                     glyphColor="#fff"
                     borderColor={hoveredIndex === index ? '#FBBC04' : '#fff'}
                  />
               </AdvancedMarker>
            ))}

            {/* Map Pins For Bucket List Spots  */}
            {bucketListSpots.map((spot, index) => {
               let pinColor = spot.visited ? PinColor.Visited : PinColor.Unvisited;
               return (
                  <AdvancedMarker
                     key={spot.id}
                     position={spot.location}
                     onMouseEnter={() => setHoveredIndex(index)} // Highlight map pin on hover
                     onMouseLeave={() => setHoveredIndex(null)} // Reset hover state
                  >
                     <Pin
                        background={pinColor}
                        glyphColor={pinColor}
                        borderColor={hoveredIndex === index ? PinColor.Hovered : pinColor}
                        scale={hoveredIndex === index ? 1 : 0.7}
                     />
                  </AdvancedMarker>
               );
            })}



         </>
      );
   };

   return (
      <div className='flex flex-row'>

         {/* Google Map */}
         <div className='w-3/4'>
            <APIProvider apiKey={googleMapsAPIKey} onLoad={() => console.log('Maps API has loaded.')}>
               <Map
                  className="w-full h-full"
                  defaultCenter={currentLatLong}
                  defaultZoom={13}
                  gestureHandling="greedy"
                  mapId="DEMO_MAP_ID"
                  disableDefaultUI={true}
               >
                  <MapPins pointsOfInterest={pointsOfInterest} />
               </Map>
            </APIProvider>
         </div>

         {/* Search Sidebar  */}
         <div className="w-1/4 border flex flex-col h-screen">
            <MapsSearchForm setMapSearchQuery={setMapSearchQuery} />
            <div className="flex-grow overflow-y-auto">
               <ul className="flex flex-col h-full">
                  {placesData.map((place, index) => (
                     <li
                        key={place.id}
                        className={`text-center py-4 border ${hoveredIndex === index ? 'bg-yellow-300' : ''
                           }`} // Highlight list item
                        onMouseEnter={() => setHoveredIndex(index)} // Highlight list item on hover
                        onMouseLeave={() => setHoveredIndex(null)} // Reset hover state
                     >
                        <div className="font-bold">{place.displayName}</div>
                        <div className="font-light">{place.formattedAddress}</div>
                     </li>
                  ))}
               </ul>
            </div>
         </div>


      </div>
   );
}
