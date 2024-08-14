'use client'
import { useState, DragEvent } from "react"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Course = {
   courseName: string;
   prerequisite?: Course;
   corequisite?: Course;
};

type Semester = {
   semesterName?: string;
   courses?: Course[];
};

function CoursePlanner() {
   const [semesters, setSemesters] = useState<Semester[]>([])
   const [semesterCourses, setSemesterCourses] = useState<string[]>([])
   const courseList: Course[] = [
      { courseName: "Math" },
      { courseName: "Science" },
      { courseName: "English" },
      { courseName: "History" },
      { courseName: "Computer Science" },
      { courseName: "Art" },
      { courseName: "Music" },
      { courseName: "Physical Education" },
   ];

   function addSemester() {
      setSemesters([...semesters, {}])
   }

   function checkPrerequisite(course: Course) {
      if (course.prerequisite) {
         return semesterCourses.includes(course.prerequisite.courseName)
      }
      return true
   }

   function checkCorequisite(course: Course) {
      if (course.corequisite) {
         return semesterCourses.includes(course.corequisite.courseName)
      }
      return true
   }

   function handleOnDrag(event: DragEvent, courseName: string) {
      event.dataTransfer.setData("courseName", courseName);
   }





   return (
      <div className="flex gap-x-10 mx-5 ">

         <div className="widgets flex flex-col gap-y-3 bg-zinc-500 p-2 h-fit rounded-lg">
            <h1 className="m-auto">Courses</h1>
            {courseList.map((course, index) => (
               <Course courseName={course.courseName} onDragStart={handleOnDrag} key={index} />
            ))}
         </div>

         {semesters.map((semester, index) => (
            <Semester key={index} />
         ))}

         <Button onClick={addSemester}>Add Semester</Button>

      </div>
   )
}


function Course({ courseName, onDragStart }: { courseName: string, onDragStart: (event: React.DragEvent, widgetType: string) => void; }) {
   return (
      <div
         className="widget px-4 py-1 bg-stone-800 border rounded-lg"
         draggable
         onDragStart={(event) => onDragStart(event, courseName)}
      >
         {courseName}
      </div>
   );
}

function Semester() {
   const [semesterCourses, setSemesterCourses] = useState<Course[]>([])

   function handleOnDrag(event: DragEvent, courseName: string) {
      event.dataTransfer.setData("courseName", courseName);
   }

   function handleOnDrop(event: DragEvent) {
      const courseName = event.dataTransfer.getData("courseName") as string;
      setSemesterCourses([...semesterCourses, courseName]);

   }

   function handleOnDragOver(event: DragEvent) {
      event.preventDefault();
   }


   return (
      <div className="flex flex-col gap-y-3 bg-zinc-500 p-2 h-fit min-w-fit rounded-lg" onDrop={handleOnDrop} onDragOver={handleOnDragOver}>
         <Input className="border-none p-2 text-white"
            placeholder="Enter list name..."
         />
         {semesterCourses.map((course, index) => (
            <div className="dropped-course" key={index} >
               <Course courseName={course} onDragStart={handleOnDrag} />
            </div>
         ))}
      </div>
   )
}

export default CoursePlanner