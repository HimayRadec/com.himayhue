'use client';
import React, { useEffect, useState } from 'react';
import {
   APIProvider,
   Map,
   AdvancedMarker,
   Pin,
} from '@vis.gl/react-google-maps';

export default function GoogleMap() {
   const googleMapsAPIKey: string = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;
   const currentLatLong: google.maps.LatLngLiteral = { lat: 33.4228583, lng: -111.944015 };

   type pointsOfInterest = { key: string; location: google.maps.LatLngLiteral };
   const [locations, setLocations] = useState<pointsOfInterest[]>([
      {
         key: 'myLocation',
         location: currentLatLong, // Add your location to the initial state
      },
   ]);

   async function findPlaces() {
      const { Place } = (await google.maps.importLibrary("places")) as google.maps.PlacesLibrary;

      const request = {
         textQuery: 'Canes',
         fields: ['addressComponents', 'displayName', 'location', 'businessStatus'],
         includedType: 'restaurant',
         locationBias: currentLatLong,
         isOpenNow: true,
         language: 'en-US',
         maxResultCount: 3,
         minRating: 3.2,
         region: 'us',
         useStrictTypeFiltering: false,
      };

      //@ts-ignore
      const { places } = await Place.searchByText(request);

      if (places.length) {
         console.log(places);

         const newLocations = places.map((place) => ({
            key: place.displayName!,
            location: {
               lat: place.location!.lat(),
               lng: place.location!.lng(),
            },
         }));

         setLocations((prevLocations) => [...prevLocations, ...newLocations]);
      } else {
         console.log('No results');
      }
   }

   useEffect(() => {
      findPlaces();
   }, []);

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
      <div>
         <APIProvider apiKey={googleMapsAPIKey} onLoad={() => console.log('Maps API has loaded.')}>
            <Map
               className="w-screen h-screen"
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
   );
}
