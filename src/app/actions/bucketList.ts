'use server';

import { BucketListPlace } from "@/types/bucketList";
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";

export async function addPlaceToBucketList(googlePlace: google.maps.places.Place) {
   const session = await auth();
   const userId = session?.user?.id;

   if (!userId) throw new Error('User not authenticated');

   const place: BucketListPlace = {
      id: googlePlace.id,
      formattedAddress: googlePlace.formattedAddress as string,
      displayName: googlePlace.displayName as string,
      location: {
         lat: googlePlace.location.lat ?? 0,
         lng: googlePlace.location.lng ?? 0,
      },
      dateAdded: new Date().toISOString(),
      dateVisited: undefined,
      googleMapsURI: googlePlace.googleMapsURI || undefined,
      websiteURI: googlePlace.websiteURI || undefined,
   };

   const client = await clientPromise;
   const db = client.db();

   await db.collection('bucketlist').updateOne(
      { userId },
      {
         $addToSet: { places: place },
         $setOnInsert: { userId },
         $currentDate: { updatedAt: true },
      },
      { upsert: true }
   );
}

export async function getBucketList(userId: string): Promise<BucketListPlace[]> {
   console.log('Fetching bucket list for user:', userId);
   const client = await clientPromise;
   const db = client.db();

   const bucketList = await db.collection('bucketlist').findOne({ userId });

   return bucketList?.places || [];
}
