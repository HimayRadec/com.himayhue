import { ObjectId } from "mongodb";

export interface UserProfile {
   _id: ObjectId;

   username: string;
   name: string;
   bio?: string;
   avatar?: string; // optional override for Auth.js image
   link?: string;

   followers: UserProfile[];
   following: UserProfile[];

   settings?: {
      darkMode: boolean;
      language: string;
   };

   createdAt: Date;
   updatedAt: Date;
}