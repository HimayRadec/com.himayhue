'use client'
import GoogleMap from '@/components/GoogleMap'
import Image from 'next/image'
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

      <div className='w-1/4 bg-neutral-950 flex flex-col'>
        <div className='p-4 border-4'>
          <MapsSearchForm setMapSearchQuery={setMapSearchQuery} />
          <p>Search Query: {mapSearchQuery}</p>
          <p>Data from results {searchResultsData}</p>
        </div>

        <div className='border-2'>
          Search Results
          {<Image
            src="/avatar_placeholder.png"
            alt="User profile picture"
            width={200}
            height={300}
          />}
        </div>

        <div className='border-2'>
          <h2 className=''>Bucket List</h2>
        </div>

      </div>

    </div>
  )
}
