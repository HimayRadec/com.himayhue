import { User } from "@/models/UserModel"
import { connectToMongoDB } from "@/lib/mongodb";

// Only gets the user from the database. No password checking.
export async function getUserFromDb(email: string) {
   await connectToMongoDB();

   try {
      const user = await User.findOne({ email: email });
      return user;
   }
   catch (error) {
      console.error('[Query]: Failed to find user.', error);
      throw new Error('Failed to fetch user.');
   }

}