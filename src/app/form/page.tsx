import React from 'react'
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function CollectInfo() {
   const [formData, setFormData] = useState({
      phoneNumber: '',
      gender: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
   });
   const router = useRouter();

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Check if the form is valid and all fields are filled

      try {
         // Send the form data to the server
         const response = await fetch(`api/collectInfo`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
         });

         // if statement to check if the response is ok

         // if response is ok then redirect to the page you want to go to

      }
      catch (error) {
         console.error(error);
      }
   }

   return (
      <form onSubmit={handleSubmit}>
         <label>
            First Name:
            <input
               type="text"
               name="firstName"
               value={formData.firstName}
               onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
               required
            />
         </label>

         <label>
            Last Name:
            <input
               type="text"
               name="lastName"
               value={formData.lastName}
               onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
               required
            />
         </label>

         <label>
            Phone Number:
            <input
               type="text"
               name="phoneNumber"
               value={formData.phoneNumber}
               onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
               required
            />
         </label>

         <label>
            Gender:
            <select
               name="gender"
               value={formData.gender}
               onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
               required
            >
               <option value="">Select</option>
               <option value="male">Male</option>
               <option value="female">Female</option>
               <option value="other">Other</option>
            </select>
         </label>

         <label>
            Date of Birth:
            <input
               type="date"
               name="dateOfBirth"
               value={formData.dateOfBirth}
               onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
               required
            />
         </label>

         <button type="submit">Submit</button>
      </form>
   );
}
