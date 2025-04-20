'use client'
// React
import { useState, useEffect } from 'react'
import { Suspense } from 'react'

// Next.js & Routing
import Link from 'next/link'
import { useSession } from 'next-auth/react'

// Components
import GoogleMap from './components/GoogleMap'
import { PlaceResultCard } from './components/PlaceResultCard'
import PlacesSearchbar from './components/PlaceSearchBar'
import { BucketPlaceCard } from './components/BucketPlaceCard'

// UI
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Actions
import { getBucketList, removePlaceFromBucketList, addPlaceToBucketList } from '../actions/bucketList'

// Types
import { BucketListPlace } from '@/types/bucketListTypes'


export default function BucketList() {
  const [places, setPlaces] = useState<google.maps.places.Place[]>([]);
  const [bucketList, setBucketList] = useState<BucketListPlace[]>([]);
  const [hoveredPlace, setHoveredPlace] = useState<string | null>(null);

  const { data: session } = useSession();
  const userId = session?.user?.id;


  useEffect(() => {
    if (!userId) return;

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
  }, [userId]);

  useEffect(() => {
    console.log("Hovered place:", hoveredPlace);
  }, [hoveredPlace]);


  /** Handles removing a place from the bucket list.
    @param placeId - The ID of the place to remove.
    @returns {Promise<void>} - A promise that resolves when the place is removed.
    @throws Will log an error if the removal fails.
   * */
  async function handleRemovePlace(placeId: string) {
    if (!userId) return;
    const prev = bucketList;
    try {
      setBucketList((prev) => prev.filter(place => place.id !== placeId));
      await removePlaceFromBucketList(placeId, userId);
    } catch (err) {
      console.error("Error removing place:", err);
      setBucketList(prev); // Revert state on failure
      // Optionally show toast or alert
    }
  }



  /** Handles adding a place to the bucket list.
    @param place - The place to add, as a google.maps.places.Place object.
    @returns {Promise<boolean>} - A promise that resolves to true if the place was added successfully, false otherwise.
    @throws Will log an error if the addition fails.
   * */
  async function handleAddPlaceToBucketList(place: google.maps.places.Place): Promise<boolean> {
    if (!userId) return false;

    // Check if the place is already in the bucket list
    const isAlreadyAdded = bucketList.some((p) => p.id === place.id);
    if (isAlreadyAdded) return false;


    try {
      // Add the place to the bucket list
      let formattedPlace: BucketListPlace = await addPlaceToBucketList(place);
      setBucketList((prev) => [...prev, formattedPlace]);

      // Remove the place from the search results
      setPlaces((prev) => prev.filter(p => p.id !== place.id));

      return true; // Indicate success
    }
    catch (err) {
      console.error("Error adding place to bucket list:", err);
      return false; // Indicate failure
    }
  }

  function handleSearchbarResults(results: google.maps.places.Place[]) {
    // filter out places that are already in the bucket list
    const filteredPlaceResults = results.filter(place => !bucketList.some(bucketPlace => bucketPlace.id === place.id));
    setPlaces(filteredPlaceResults);
  }



  return (
    <div className="flex flex-grow border-t overflow-hidden">
      {/* Map Section */}
      <GoogleMap searchResultPlaces={places} bucketListPlaces={bucketList} hoveredPlace={hoveredPlace} setHoveredPlace={setHoveredPlace} />

      {/* Sidebar */}
      <div className="w-1/3 bg-neutral-950 flex flex-col border-l border-neutral-800 ">
        <div className="w-full border-b border-neutral-800 flex flex-col justify-between items-center">


          <Tabs defaultValue='bucket-list' className='w-full rounded-none'>
            <TabsList className='w-full'>
              <TabsTrigger value='bucket-list' className='w-1/2 h-full rounded-none'>Bucket List</TabsTrigger>
              <TabsTrigger value='search' className='w-1/2 h-full rounded-none'>Search</TabsTrigger>
            </TabsList>

            {/* Forced mount is used to keep the content mounted even when inactive to prevent card button states from resetting. */}
            <TabsContent value='bucket-list' className='data-[state=inactive]:hidden' forceMount>
              <ScrollArea className="w-full flex flex-col max-h-[calc(100vh-8rem)] ">
                {bucketList.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">Your bucket list is empty.</p>
                ) : (
                  bucketList.map((place) => (
                    <BucketPlaceCard key={place.id} place={place} hoveredPlace={hoveredPlace} setHoveredPlace={setHoveredPlace} onRemove={handleRemovePlace} />
                  ))
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value='search' className='data-[state=inactive]:hidden' forceMount>
              <PlacesSearchbar UpdatePlacesResults={handleSearchbarResults} />

              <ScrollArea className="w-full flex flex-col max-h-[calc(100vh-8rem)] ">
                {places.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">No results found</p>
                ) : (
                  places.map((place, index) => (
                    <PlaceResultCard key={index} place={place} hoveredPlace={hoveredPlace} setHoveredPlace={setHoveredPlace} onAdd={handleAddPlaceToBucketList} />
                  ))
                )}
              </ScrollArea>
            </TabsContent>

          </Tabs>
        </div>
      </div>
    </div>
  );
}