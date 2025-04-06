'use client'
import { useState, useEffect } from 'react'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import GoogleMap from '@/components/GoogleMap'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

import MapsSearchForm from './MapsSearchForm'
import { addPlaceToBucketList, getBucketList } from '../actions/bucketList'
import { useSession } from 'next-auth/react'

export default function BucketList() {
  const [viewMode, setViewMode] = useState<'search' | 'myList'>('search');
  const [mapSearchQuery, setMapSearchQuery] = useState<string>('');
  const [searchResultsDetails, setSearchResultsDetails] = useState<string>('');
  const [places, setPlaces] = useState<google.maps.places.Place[]>([]);
  const [bucketList, setBucketList] = useState<any[]>([]);

  const { data: session } = useSession();
  const userId = session?.user?.id;


  // TEMP: Mock data for saved list — replace with Mongo fetch later
  useEffect(() => {
    console.log('viewMode changed:', viewMode);
    try {
      if (userId) {
        const fetchBucketList = async () => {
          const data = await getBucketList(userId);
          setBucketList(data);
        };
        fetchBucketList();
      }
    }
    catch (error) {
      console.error('Error fetching bucket list:', error);
    }
  }, [viewMode]);

  return (
    <div className="flex flex-grow border-t">
      {/* Map Section */}
      <GoogleMap searchQuery={mapSearchQuery} setSearchResultsDetails={setSearchResultsDetails} setPlaces={setPlaces} />

      {/* Sidebar */}
      <div className="w-1/3 bg-neutral-950 flex flex-col border-l border-neutral-800">
        {/* Header: Search + Toggle */}
        <div className="w-full p-4 border-b border-neutral-800 flex justify-between items-center">
          <MapsSearchForm setMapSearchQuery={setMapSearchQuery} />
          <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'search' ? 'myList' : 'search')}>
            {viewMode === 'search' ? 'Search' : 'Bucket List'}
          </Button>
        </div>

        {/* Search Results */}
        <ScrollArea className="w-full p-4 flex flex-col space-y-4 max-h-[calc(100vh-8rem)]">
          {viewMode === 'search' ? (
            places.length === 0 ? (
              <p className="text-gray-400 text-center">No results found</p>
            ) : (
              places.map((place, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{place.displayName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{place.formattedAddress}</CardDescription>
                    {place.websiteURI && (
                      <CardDescription><Link href={place.websiteURI}>Website</Link></CardDescription>
                    )}
                    <CardDescription>{place.types?.join(', ')}</CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={() => addPlaceToBucketList(place)}
                      className="mt-3 w-full px-4 py-2"
                    >
                      Add to List
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )
          ) : (
            bucketList.length === 0 ? (
              <p className="text-gray-400 text-center">Your bucket list is empty.</p>
            ) : (
              bucketList.map((place, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{place.displayName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{place.formattedAddress}</CardDescription>
                    <CardDescription>
                      {place.dateVisited ? `Visited: ${place.dateVisited}` : 'Not visited yet'}
                    </CardDescription>
                    {place.websiteURI && (
                      <CardDescription>
                        <Link href={place.websiteURI} target="_blank" className="text-blue-500 underline">
                          Website
                        </Link>
                      </CardDescription>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">Mark as Visited</Button>
                  </CardFooter>
                </Card>
              ))
            )
          )}
        </ScrollArea>
      </div>
    </div>
  );
}