import { auth } from "@/auth"
import clientPromise from "@/lib/mongodb"

// UI components
import FriendSearchbar from "../components/FriendSearchbar";

export default async function Friends() {

   const session = await auth()
   const userId = session?.user?.id;

   // If the user is not authenticated, display a message
   if (!userId) {
      return (
         <div className="flex items-center justify-center">
            Not authenticated
         </div>
      )
   }

   // Connect to the database and fetch the user's friends
   const client = await clientPromise;
   const db = client.db();
   const friendsDoc = await db.collection("friends").findOne({ userId });


   // If no friends document is found or the friends array is empty, display a message
   if (!friendsDoc || !friendsDoc.friends.length) {
      return (
         <div className="flex flex-col justify-center items-center ">
            <FriendSearchbar />
            <div >No friends yet</div>
         </div>
      );
   }

   // Render the list of friends
   return (
      <div className="flex flex-col items-center">
         <h1 className="text-2xl font-bold my-4">Your Friends</h1>
         <ul className="space-y-4">
            {friendsDoc.friends.map((friend: any) => (
               <li key={friend.friendId} className="flex flex-col items-center">
                  <span className="text-lg font-semibold">Friend ID: {friend.friendId}</span>
                  <span className="text-gray-500 text-sm">
                     Added on: {new Date(friend.dateAdded).toLocaleDateString()}
                  </span>
               </li>
            ))}
         </ul>
      </div>
   );
}