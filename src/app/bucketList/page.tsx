import GoogleMap from '@/components/GoogleMap'
import MapsSearchForm from './MapsSearchForm'
import { useState } from 'react'


export default function BucketList() {

  const [mapSearchQuery, setMapSearchQuery] = useState("");


  return (
    <div className='flex flex-grow border-t'>
      <GoogleMap searchQuery={mapSearchQuery} />
      <div className='w-1/4 bg-neutral-950'>
        <div className='p-4'>
          <MapsSearchForm setMapSearchQuery={setMapSearchQuery} />
        </div>
      </div>
    </div>
  )
}
