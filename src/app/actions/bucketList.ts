'use server';

import { BucketListPlace, BucketListDocument } from "@/types/bucketListTypes";
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";
import BucketList from "../bucketList/page";

export async function addPlaceToBucketList(googlePlace: google.maps.places.Place): Promise<BucketListPlace> {
   const session = await auth();
   const userId = session?.user?.id;
   if (!userId) throw new Error('User not authenticated');

   try {
      const place: BucketListPlace = {
         id: googlePlace.id,
         formattedAddress: googlePlace.formattedAddress as string,
         displayName: googlePlace.displayName as string,
         location: {
            lat: googlePlace.location!.lat, // Unsure why these are red but they work correctly
            lng: googlePlace.location!.lng, // Unsure why these are red but they work correctly
         },
         dateAdded: new Date().toISOString(),
         dateVisited: undefined,
         googleMapsURI: googlePlace.googleMapsURI || undefined,
         websiteURI: googlePlace.websiteURI || undefined,
      };

      const client = await clientPromise;
      const db = client.db();

      await db.collection('bucketlist').updateOne(
         { userId, "places.id": { $ne: place.id } }, // only update if the place isn't already there
         {
            $addToSet: { places: place },
            $setOnInsert: { userId },
            $currentDate: { updatedAt: true },
         },
         { upsert: true }
      );

      return place;
   }
   catch (error) {
      console.error("Error in addPlaceToBucketList:", error);
      throw new Error("Failed to add place to bucket list");
   }
}

export async function getBucketList(userId: string): Promise<BucketListPlace[]> {
   console.log('Fetching bucket list for user:', userId);
   const client = await clientPromise;
   const db = client.db();

   const bucketList = await db.collection('bucketlist').findOne({ userId });

   return bucketList?.places || [];
}

/* * Removes a place from the user's bucket list.
   * @param placeId - The ID of the place to remove.
   * @param userId - The ID of the user whose bucket list is being modified.
   * @throws Will throw an error if the user is not authenticated.
   */
export async function removePlaceFromBucketList(placeId: string, userId: string) {

   if (!userId) throw new Error("User not authenticated");

   const client = await clientPromise;
   const db = client.db();

   const collection = db.collection<BucketListDocument>("bucketlist");

   await collection.updateOne(
      { userId },
      {
         $pull: { places: { id: placeId } },
         $currentDate: { updatedAt: true },
      }
   );
}