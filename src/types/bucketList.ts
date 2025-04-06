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
   Visited = '#00A000', // Green for visited spots
   Unvisited = '#808080', // Grey for unvisited spots
   Hovered = '#000000', // White border for hovered spots
   Location = '#4285F4' // Blue for current location
}
