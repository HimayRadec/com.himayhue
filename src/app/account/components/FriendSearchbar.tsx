import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function FriendSearchbar() {
   return (
      <Form>
         <Input
            type="text"
            placeholder="Search for friends..."
            className="w-full max-w-md"
         // onChange={(e) => setSearchQuery(e.target.value)}
         />
         {/* Add a button to submit the search */}
         <button type="submit" className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">
            Search
         </button>
      </Form>
   );
};
