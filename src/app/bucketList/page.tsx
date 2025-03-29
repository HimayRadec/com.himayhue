'use client'
import { useEffect, useState } from 'react'

import GoogleMap from '@/components/GoogleMap'
import GoogleMapComponent from './GoogleMapComponent'
import MapsSearchForm from './MapsSearchForm'

export default function BucketList() {

  const [mapSearchQuery, setMapSearchQuery] = useState<string>("");
  const [searchResultsDetails, setSearchResultsDetails] = useState<string>("");
  const [places, setPlaces] = useState<google.maps.places.Place[]>([]);



  return (
    <div className='flex flex-grow border-t'>
      <GoogleMap searchQuery={mapSearchQuery} setSearchResultsDetails={setSearchResultsDetails} setPlaces={setPlaces} />

      <div className="w-1/3 bg-neutral-950 flex flex-col">
        <div className='w-full m-2'>
          <MapsSearchForm setMapSearchQuery={setMapSearchQuery} />
        </div>
        <div className='w-full m-2 flex flex-col'>
          <ul className='text-white'>
            {places.length === 0 && <li className='text-gray-400'>No results found</li>}
            {places.length > 0 && (
              <>
                {places.map((place, index) => (
                  <li key={index} className='mb-2'>
                    <strong>{place.displayName}</strong>
                    <br />
                    {place.formattedAddress}
                  </li>
                ))}
              </>
            )}
          </ul>
        </div>
      </div>

    </div>
  )
}
