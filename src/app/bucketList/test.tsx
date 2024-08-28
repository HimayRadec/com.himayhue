import React, { useState } from 'react';

interface ParentComponentProps { }

export default function ParentComponent() {
   const [variable, setVariable] = useState('');

   return (
      <div>
         <h1>Parent Component</h1>
         <DisplayVariable variable={variable} />
         <MapSearchQuery setVariable={setVariable} />
      </div>
   );
};

export function DisplayVariable({ variable }: { variable: string }) {
   return (
      <div>
         <h2>Display Variable</h2>
         <p>Variable: {variable}</p>
      </div>
   );
};


export function MapSearchQuery({ setVariable }: { setVariable: React.Dispatch<React.SetStateAction<string>> }) {
   const [inputValue, setInputValue] = useState('');

   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
   };

   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setVariable(inputValue); // Update the shared state
      setInputValue(''); // Reset the input field after submission
   };

   return (
      <div>
         <h2>Change Variable</h2>
         <form onSubmit={handleSubmit}>
            <input type="text" value={inputValue} onChange={handleChange} />
            <button type="submit">Submit</button>
         </form>
      </div>
   );
};
