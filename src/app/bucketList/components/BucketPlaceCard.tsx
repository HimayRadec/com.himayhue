// Next.js & Routing
import Link from "next/link"

// Components
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { cn } from "@/lib/utils";

// Types
import { BucketListPlace } from "@/types/bucketListTypes"

interface Props {
   place: BucketListPlace;
   hoveredPlace: String | null;
   setHoveredPlace: React.Dispatch<React.SetStateAction<String | null>>;
}

export function BucketPlaceCard({ place, setHoveredPlace, hoveredPlace }: Props) {
   return (
      <Card
         onMouseEnter={() => setHoveredPlace(place.id)}
         onMouseLeave={() => setHoveredPlace(null)}
         className={cn(
            "transition-all duration-200 ease-in-out",
            hoveredPlace === place.id ? "bg-neutral-700" : "hover:bg-neutral-700"
         )}
      >
         <CardHeader>
            <CardTitle>{place.displayName}</CardTitle>
         </CardHeader>
         <CardContent>
            <CardDescription>{place.formattedAddress}</CardDescription>
            {place.websiteURI && (
               <CardDescription>
                  <Link
                     href={place.websiteURI}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="text-blue-500 hover:underline flex items-center gap-1"
                  >
                     Website
                  </Link>
               </CardDescription>
            )}
         </CardContent>
         <CardFooter>
            <Button
               variant={"unvisitedPlace"}
               className="mt-3 w-full px-4 py-2"
            >
               Unvisited
            </Button>
         </CardFooter>
      </Card>
   )
}
