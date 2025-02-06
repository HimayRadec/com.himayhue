'use client';
import React, { useEffect, useState } from 'react';
import {
   APIProvider,
   Map,
   AdvancedMarker,
   Pin,
} from '@vis.gl/react-google-maps';
import MapsSearchForm from '../bucketList/MapsSearchForm';
import { Separator } from '@/components/ui/separator';



export default function GoogleMap() {
   const [mapSearchQuery, setMapSearchQuery] = useState<string>('');
   const [currentLatLong, setCurrentLatLong] = useState<google.maps.LatLngLiteral>({ lat: 33.4228583, lng: -111.944015 });
   const [pointsOfInterest, setPointsOfInterest] = useState<google.maps.LatLngLiteral[]>([]);
   const [mapSearchResults, setMapSearchResults] = useState<google.maps.places.PlaceResult[]>([]);

   const googleMapsAPIKey: string = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

   type pointsOfInterest = { key: string; location: google.maps.LatLngLiteral };


   const [locations, setLocations] = useState<pointsOfInterest[]>([
      {
         key: 'myLocation',
         location: currentLatLong, // Add your location to the initial state
      },
   ]);

   async function findPlaces(searchQuery: string) {
      const { Place } = (await google.maps.importLibrary("places")) as google.maps.PlacesLibrary;

      const request = {
         textQuery: searchQuery,
         fields: ['addressComponents', 'formattedAddress', 'displayName', 'location', 'businessStatus'],
         locationBias: currentLatLong,
         // isOpenNow: true,
         language: 'en-US',
         maxResultCount: 3,
         // minRating: 3.2,
         region: 'us',
         useStrictTypeFiltering: false,
      };

      //@ts-ignore
      const { places } = await Place.searchByText(request);

      if (places.length) {
         console.log(places);

         const newLocations = places.map((place) => ({
            key: `${place.displayName} ${place.formattedAddress}`,
            location: {
               lat: place.location!.lat(),
               lng: place.location!.lng(),
            },
         }));

         setLocations((prevLocations) => [...prevLocations, ...newLocations]);
      }
      else {
         console.log('No results');
      }
   }

   useEffect(() => {
      console.log('Searching for:', mapSearchQuery);
      findPlaces(mapSearchQuery);
   }, [mapSearchQuery]);

   const PointsOfInterestMarkers = (props: { pointsOfInterest: pointsOfInterest[] }) => {
      return (
         <>
            {props.pointsOfInterest.map((pointOfInterest) => (
               <AdvancedMarker
                  key={pointOfInterest.key}
                  position={pointOfInterest.location}
               >
                  <Pin
                     background={
                        pointOfInterest.key === 'myLocation' ? '#4285F4' : '#FBBC04' // Blue for your location
                     }
                     glyphColor="#000"
                     borderColor="#000"
                  />
               </AdvancedMarker>
            ))}
         </>
      );
   };

   return (
      <div className='flex flex-row min-h-screen'>

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
                  <PointsOfInterestMarkers pointsOfInterest={locations} />
               </Map>
            </APIProvider>
         </div>

         {/* Search Sidebar  */}
         <div className='w-1/4 border'>
            <MapsSearchForm setMapSearchQuery={setMapSearchQuery} />
            <div>
               <ul>
                  {locations.map((location) => (
                     <li key={location.key}>{location.key}</li>
                  ))}
               </ul>
            </div>
         </div>

      </div>
   );
}
