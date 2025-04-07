export type BucketListPlace = {
   id: string;
   dateAdded: string;
   dateVisited?: string;
   displayName: string;
   formattedAddress: string;
   googleMapsURI?: string;
   location: {
      lat: number;
      lng: number;
   };
   websiteURI?: string;
};

export type BucketList = {
   userId: string;
   places: BucketListPlace[];
};

export enum PinColor {
   Visited = '#00A000',   // ✅ Green for visited spots
   Unvisited = '#808080', // ❌ Gray for unvisited spots
   Result = '#DC2626',    // 🔍 Red for search results
   Hovered = '#000000',   // ⚪ Optional: Black border for hovered spots
}
