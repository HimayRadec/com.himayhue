'use client'
// React
import { useState, useEffect } from 'react'

// Next.js & Routing
import Link from 'next/link'
import { useSession } from 'next-auth/react'

// Components
import GoogleMap from './components/GoogleMap'
import { PlaceResultCard } from './components/PlaceResultCard'
import PlacesSearchbar from './components/PlaceSearchbar'
import { BucketPlaceCard } from './components/BucketPlaceCard'

// UI
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

// Actions
import { addPlaceToBucketList, getBucketList } from '../actions/bucketList'

// Types
import { BucketListPlace } from '@/types/bucketListTypes'


export default function BucketList() {
  const [viewMode, setViewMode] = useState<'search' | 'myList'>('search');
  const [mapSearchQuery, setMapSearchQuery] = useState<string>('');
  const [searchResultsDetails, setSearchResultsDetails] = useState<string>('');
  const [places, setPlaces] = useState<google.maps.places.Place[]>([]);
  const [bucketList, setBucketList] = useState<BucketListPlace[]>([]);

  const { data: session } = useSession();
  const userId = session?.user?.id;


  useEffect(() => {
    if (!userId || viewMode !== 'myList') return;

    const fetchBucketList = async () => {
      try {
        const data = await getBucketList(userId);
        setBucketList(data);
      }
      catch (error) {
        console.error('Error fetching bucket list:', error);
      }
    };

    fetchBucketList();
  }, [viewMode, userId]);

  useEffect(() => {
    if (!userId) return;

    const fetchBucketList = async () => {
      try {
        const data = await getBucketList(userId);
        setBucketList(data);
      } catch (error) {
        console.error('Error fetching bucket list:', error);
      }
    };

    fetchBucketList();
  }, [userId]);


  return (
    <div className="flex flex-grow border-t overflow-hidden">
      {/* Map Section */}
      <GoogleMap searchResultPlaces={places} bucketListPlaces={bucketList} />

      {/* Sidebar */}
      <div className="w-1/3 bg-neutral-950 flex flex-col border-l border-neutral-800 ">
        <div className="w-full p-4 border-b border-neutral-800 flex flex-col justify-between items-center">
          <PlacesSearchbar UpdatePlacesResults={setPlaces} />
          <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'search' ? 'myList' : 'search')}>
            {viewMode === 'search' ? 'Search' : 'Bucket List'}
          </Button>
        </div>

        {/* Search Results */}
        <ScrollArea className="w-full p-4 flex flex-col space-y-4 max-h-[calc(100vh-8rem)] ">
          {viewMode === 'search' ? (
            places.length === 0 ? (
              <p className="text-gray-400 text-center">No results found</p>
            ) : (
              places.map((place, index) => (
                <PlaceResultCard key={index} place={place} />
              ))
            )
          ) : (
            bucketList.length === 0 ? (
              <p className="text-gray-400 text-center">Your bucket list is empty.</p>
            ) : (
              bucketList.map((place, index) => (
                <BucketPlaceCard key={index} place={place} />
              ))
            )
          )}
        </ScrollArea>
      </div>
    </div>
  );
}