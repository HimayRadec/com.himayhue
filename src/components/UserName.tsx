import { auth } from "../auth"

export default async function UserAvatar() {
   const session = await auth()

   if (!session.user) return null

   return (
      <div>
         {session.user.name ? session.user.name : "not logged in"}
      </div>
   )
}