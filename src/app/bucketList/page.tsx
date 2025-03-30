'use client'
import { useState } from 'react'

import GoogleMap from '@/components/GoogleMap'
import GoogleMapComponent from './GoogleMapComponent'
import MapsSearchForm from './MapsSearchForm'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function BucketList() {
  const [mapSearchQuery, setMapSearchQuery] = useState<string>('');
  const [searchResultsDetails, setSearchResultsDetails] = useState<string>('');
  const [places, setPlaces] = useState<google.maps.places.Place[]>([]);

  return (
    <div className="flex flex-grow border-t">
      {/* Map Section */}
      <GoogleMap searchQuery={mapSearchQuery} setSearchResultsDetails={setSearchResultsDetails} setPlaces={setPlaces} />

      {/* Sidebar */}
      <div className="w-1/3 bg-neutral-950 flex flex-col border-l border-neutral-800">
        {/* Search Bar */}
        <div className="w-full p-4 border-b border-neutral-800">
          <MapsSearchForm setMapSearchQuery={setMapSearchQuery} />
        </div>

        {/* Search Results */}
        <ScrollArea className="w-full p-4 flex flex-col space-y-4 max-h-[calc(100vh-8rem)]">
          {places.length === 0 ?
            (<p className="text-gray-400 text-center">No results found</p>) :
            (places.map((place, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{place.displayName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{place.formattedAddress}</CardDescription>
                </CardContent>
                <CardFooter>
                  <Button
                    // onClick={() => addToBucketList(place)}
                    className="mt-3 w-full px-4 py-2"
                  >
                    Add to List
                  </Button>
                </CardFooter>
              </Card>
            ))
            )}
        </ScrollArea>
      </div>
    </div>
  );
}
