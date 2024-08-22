'use client'
import { useState, DragEvent } from "react"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Course = {
   courseName: string;
   prerequisite?: Course[];
   corequisite?: Course[];
};

type Semester = {
   semesterName?: string;
   courses?: Course[];
};


function handleOnDrag(event: DragEvent, courseName: string) {
   event.dataTransfer.setData("courseName", courseName);
}


// Contains a single course that can be dragged and dropped into a semester
function CourseItem({ course }: { course: Course }) {
   return (
      <div
         className="widget px-4 py-1 bg-stone-800 border rounded-lg"
         draggable
         onDragStart={(event) => handleOnDrag(event, course.courseName)}
      >
         {course.courseName}
      </div>
   );
}


// A drop zone for courses that can be dragged and dropped into it
function SemesterCourseList({ courseList }: { courseList: Course[] }) {
   const [semesterCourses, setSemesterCourses] = useState<Course[]>([]);

   function handleOnDrop(event: DragEvent) {
      const courseName = event.dataTransfer.getData("courseName");
      const course = courseList.find(c => c.courseName === courseName);

      if (course && !semesterCourses.includes(course)) {
         setSemesterCourses([...semesterCourses, course]);
      }

      // remove the course from the course list

   }

   function handleOnDragOver(event: DragEvent) {
      event.preventDefault();
   }

   function checkPrerequisites(course: Course) {
   }
   function checkCorequisites(course: Course) {
   }
   return (
      <div className="flex flex-col gap-y-3 bg-zinc-500 p-2 h-fit min-w-fit rounded-lg" onDrop={handleOnDrop} onDragOver={handleOnDragOver}>
         <Input className="border-none p-2 text-white" placeholder="Enter list name..." />
         {semesterCourses.map((course, index) => (
            <div className="dropped-course" key={index}>
               <CourseItem course={course} />
            </div>
         ))}
      </div>
   );
}


// The main course schedule planner component
function CourseSchedulePlanner() {
   const ser334: Course = { courseName: "SER 334" };
   const ser322: Course = { courseName: "SER 322" };

   const ser216: Course = { courseName: "SER 216" };
   const ser315: Course = { courseName: "SER 315", corequisite: [ser216] };
   const ser316: Course = { courseName: "SER 316", prerequisite: [ser216] };
   const ser321: Course = { courseName: "SER 321", prerequisite: [ser334] };
   const ser335: Course = { courseName: "SER 335", corequisite: [ser334, ser316, ser321] };
   const ser415: Course = { courseName: "SER 415", prerequisite: [ser315] };
   const ser416: Course = { courseName: "SER 416", prerequisite: [ser316] };

   const ser401: Course = { courseName: "SER 401", prerequisite: [ser315, ser316, ser321, ser334] };
   const ser402: Course = { courseName: "SER 402", prerequisite: [ser401] };


   const [semesters, setSemesters] = useState<Semester[]>([])
   const courseList: Course[] = [
      ser334,
      ser216,
      ser315,
      ser316,
      ser321,
      ser322,
      ser335,
      ser415,
      ser416,
      ser401,
      ser402
   ];


   function addSemester() {
      setSemesters([...semesters, {}])
   }



   return (
      <div className="flex gap-x-10 mx-5 ">

         {/* Display the list of courses */}
         <div className="courses flex flex-col gap-y-3 bg-zinc-500 p-2 h-fit rounded-lg min-w-fit">
            <h1 className="m-auto">Courses</h1>
            {courseList.map((course, index) => (
               <CourseItem course={course} key={index} />
            ))}
         </div>

         {/* Display the list of semesters */}
         {semesters.map((semester, index) => (
            <SemesterCourseList courseList={courseList} key={index} />
         ))}


         <Button onClick={addSemester}>Add Semester</Button>

      </div>
   )
}
export default CourseSchedulePlanner