'use client'
import { useEffect, useState } from 'react'

import GoogleMap from '@/components/GoogleMap'
import MapsSearchForm from './MapsSearchForm'
import GoogleMapComponent from './GoogleMapComponent';


export default function BucketList() {

  const [mapSearchQuery, setMapSearchQuery] = useState<string>("");
  const [searchResultsDetails, setSearchResultsDetails] = useState<string>("Default Search Results");


  return (
    <div className='flex flex-grow border-t'>
      <GoogleMap searchQuery={mapSearchQuery} setSearchResultsDetails={setSearchResultsDetails} />

      <div className="w-1/3 bg-neutral-950 flex">
        <div className="p-4 w-3/5">
          <MapsSearchForm setMapSearchQuery={setMapSearchQuery} />
          <h2>{searchResultsDetails}</h2>
        </div>

        <div className="border-l-2 p-4 w-2/5 flex-col items-center">
          <h2 className="text-center text-3xl font-">Bucket List</h2>
        </div>
      </div>

    </div>
  )
}
