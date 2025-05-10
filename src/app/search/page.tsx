'use client';
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const SearchPage = () => {
   return (
      <div className='min-h-screen'>
         <div className='border flex flex-col w-3/5 min-h-screen'>
            <div className='px-6 py-4'><Input placeholder='Search'></Input></div>
         </div>
      </div>
   );
};

export default SearchPage;
