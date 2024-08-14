'use client'
import React from 'react';
import { Marker, GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
   width: '100%',
   height: '100%'
};

const center = {
   lat: -3.745,
   lng: -38.523
};

function GoogleMapComponent() {
   // TODO: Make Google API Key Private
   const isLoaded = useJsApiLoader({
      id: 'google-map-script',
      googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
   })

   const [map, setMap] = React.useState(null)

   const onLoad = React.useCallback(function callback(map) {

      setMap(map)
   }, [])

   const onUnmount = React.useCallback(function callback(map) {
      setMap(null)
   }, [])

   return isLoaded ? (
      <GoogleMap
         mapContainerStyle={containerStyle}
         center={center}
         zoom={18}
         onLoad={onLoad}
         onUnmount={onUnmount}
      >
         <Marker
            position={center}
         />


      </GoogleMap>
   ) : <></>
}

export default React.memo(GoogleMapComponent)