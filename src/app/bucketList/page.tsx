'use client'
import { useEffect, useState } from 'react'

import GoogleMap from '@/components/GoogleMap'
import MapsSearchForm from './MapsSearchForm'

export default function BucketList() {

  const [mapSearchQuery, setMapSearchQuery] = useState<string>("");
  const [searchResultsDetails, setSearchResultsDetails] = useState<string>("");
  const [places, setPlaces] = useState<google.maps.places.PlaceResult[]>([]);



  return (
    <div className='flex flex-grow border-t'>
      <GoogleMap searchQuery={mapSearchQuery} setSearchResultsDetails={setSearchResultsDetails} setPlaces={setPlaces} />

      <div className="w-1/3 bg-neutral-950 flex">
        <div className='w-full m-2'>
          <MapsSearchForm setMapSearchQuery={setMapSearchQuery} />
        </div>
      </div>

    </div>
  )
}
