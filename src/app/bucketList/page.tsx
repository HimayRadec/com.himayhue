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
        <div className="p-4 w-3/5">
          <MapsSearchForm setMapSearchQuery={setMapSearchQuery} />

          <div>
            {places.map((place, index) => (
              <div key={index} className="border p-4 bg-white">
                <h3 className="text-xl font-semibold text-gray-900">{place.displayName}</h3>

                <p className="text-gray-600">
                  {place.addressComponents
                    ? place.addressComponents
                      .map((component) => component.longText)
                      .join(", ")
                    : 'No address available'}
                </p>

              </div>
            ))}
          </div>
        </div>

        <div className="border-l-2 p-4 w-2/5 flex-col items-center">
          <h2 className="text-center text-3xl font-">Bucket List</h2>
        </div>
      </div>

    </div>
  )
}
