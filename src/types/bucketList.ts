export type BucketListSpot = {
   id: string;
   name: string;
   formattedAddress: string;
   location: {
      lat: number;
      lng: number;
   };
   visited: boolean;
};

export enum PinColor {
   Visited = '#00A000', // Green for visited spots
   Unvisited = '#808080', // Grey for unvisited spots
   Hovered = '#000000', // White border for hovered spots
   Location = '#4285F4' // Blue for current location
}
