export interface FriendEntry {
   friendId: string;
   dateAdded: string;
}

export interface FriendsDocument {
   userId: string;
   friends: FriendEntry[];
}
