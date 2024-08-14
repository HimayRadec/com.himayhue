import GoogleMap from '@/components/GoogleMap'
import React from 'react'

function Map() {
   return (
      <div className="h-[1280px] bg-white flex items-center justify-center">
         <GoogleMap />
      </div>
   )
}

export default Map