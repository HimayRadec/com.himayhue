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

// Actions
import { addPlaceToBucketList } from "@/app/actions/bucketList"

interface Props {
   place: google.maps.places.Place;
}

export function PlaceResultCard({ place }: Props) {
   return (
      <Card>
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
               onClick={() => addPlaceToBucketList(place)}
               className="mt-3 w-full px-4 py-2"
            >
               Add to List
            </Button>
         </CardFooter>
      </Card>
   )
}
