import Image from 'next/image';
import { Button } from '@/components/ui/button'; // Adjust the import path based on your project structure

const profileImage = '/path/to/sample-profile-image.jpg'; // Replace with a valid image path
const username = 'JohnDoe';
const displayName = 'John Doe';
const bio = 'Just a developer sharing my journey.';
const location = 'San Francisco, CA';
const website = 'https://johndoe.dev';
const joinedDate = 'Joined January 2020';
const followersCount = 1200;
const followingCount = 300;

export default function UserProfile() {
   return (
      <div>
         {/* User Profile Section */}
         <header className="relative mb-5">
            {/* Cover Photo */}
            <div className="h-48 bg-gray-300"></div>

            {/* Profile Info */}
            <div className="p-5">
               <div className="relative flex items-center">
                  <div className="absolute -top-16 left-5">
                     <div className="bg-gray-200 rounded-full w-32 h-32 flex items-center justify-center overflow-hidden border-4 border-white">
                        <Image
                           src={profileImage}
                           alt="Profile"
                           width={128}
                           height={128}
                           className="rounded-full"
                        />
                     </div>
                  </div>
                  <div className="ml-40 flex-1">
                     <div className="flex justify-between items-center">
                        <div>
                           <h2 className="text-2xl font-bold">{displayName}</h2>
                           <p className="text-gray-500">@{username}</p>
                        </div>
                        <Button variant="default">Edit Profile</Button>
                     </div>
                  </div>
               </div>
               <div className="mt-5">
                  <p>{bio}</p>
                  <div className="flex gap-5 text-gray-500 text-sm mt-2">
                     <span>{location}</span>
                     <a href={website} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                        {website}
                     </a>
                     <span>{joinedDate}</span>
                  </div>
                  <div className="flex gap-5 mt-3">
                     <span>
                        <strong>{followingCount}</strong> Following
                     </span>
                     <span>
                        <strong>{followersCount}</strong> Followers
                     </span>
                  </div>
               </div>
            </div>
         </header>
      </div>
   );
}
