import React from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

function Map() {
  const position = { lat: -25.344, lng: 131.031 };

  return (
    <LoadScript googleMapsApiKey={process.env.GOOGLE_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>)
}

export default Map