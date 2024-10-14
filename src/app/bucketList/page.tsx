'use client'
import GoogleMap from '@/components/GoogleMap'
import MapsSearchForm from './MapsSearchForm'
import { useEffect, useState } from 'react'


export default function BucketList() {

  const [mapSearchQuery, setMapSearchQuery] = useState("");
  const [searchResultsData, setSearchResultsData] = useState([]);

  const updateSearchResults = (searchResults: any) => {
    setSearchResultsData(searchResults);
  }

  return (
    <div className='flex flex-grow border-t'>
      <GoogleMap searchQuery={mapSearchQuery} />

      <div className="w-1/3 bg-neutral-950 flex">
        <div className="p-4 w-3/5">
          <MapsSearchForm setMapSearchQuery={setMapSearchQuery} />
        </div>

        <div className="border-l-2 p-4 w-2/5 flex-col items-center">
          <h2 className="text-center text-3xl text-bold">Bucket List</h2>
        </div>
      </div>

    </div>
  )
}
