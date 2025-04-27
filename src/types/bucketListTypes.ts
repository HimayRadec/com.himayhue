import { ObjectId } from 'mongodb';


export interface BucketListPlace {
   id: string;
   formattedAddress: string;
   displayName: string;
   location: google.maps.LatLngLiteral;
   dateAdded: string;
   dateVisited?: string;
   googleMapsURI?: string;
   websiteURI?: string;
};

export interface BucketList {
   userId: string;
   places: BucketListPlace[];
};

export interface BucketListDocument {
   _id: ObjectId;
   userId: string;
   places: BucketListPlace[];
   updatedAt: Date; // or `Date` if you convert it on fetch
}

export enum PinColor {
   Visited = '#00A000',   // ✅ Green for visited spots
   Unvisited = '#808080', // ❌ Gray for unvisited spots
   Result = '#DC2626',    // 🔍 Red for search results
   Hovered = '#000000',   // ⚪ Optional: Black border for hovered spots
}

