import React, { useState } from 'react';
import { ChevronRight, GraduationCap } from 'lucide-react';
import { Link } from 'react-router';

const CourseSection = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const semesters = [
    {
      id: 1,
      title: "First Semester",
      subjects: "C Programming, Digital Logic, Mathematics I, Physics, English",
      color: "border-blue-500",
      credits: "21 Credit Hours",
      image: "/sem1.jpg",
    },
    {
      id: 2,
      title: "Second Semester",
      subjects: "OOP in C++, Discrete Mathematics, Mathematics II, Statistics",
      color: "border-green-500",
      credits: "20 Credit Hours",
      image: "/sem2.jpg",
    },
    {
      id: 3,
      title: "Third Semester",
      subjects: "Data Structures & Algorithms, Numerical Methods, Computer Architecture",
      color: "border-yellow-500",
      credits: "19 Credit Hours",
      image: "/sem3.jpg",
    },
    {
      id: 4,
      title: "Fourth Semester",
      subjects: "Database Management System, Operating Systems, AI",
      color: "border-red-500",
      credits: "21 Credit Hours",
      image: "/sem4.jpg",
    },
    {
      id: 5,
      title: "Fifth Semester",
      subjects: "Computer Networks, Web Technology, Computer Graphics",
      color: "border-purple-500",
      credits: "18 Credit Hours",
      image: "/sem5.jpg",
    },
    {
      id: 6,
      title: "Sixth Semester",
      subjects: "Software Engineering, Compiler Design, Web API",
      color: "border-indigo-500",
      credits: "20 Credit Hours",
      image: "/sem6.jpg",
    },
    {
      id: 7,
      title: "Seventh Semester",
      subjects: "Advanced Java, Project Work, Cloud Computing",
      color: "border-pink-500",
      credits: "19 Credit Hours",
      image: "/sem7.jpg",
    },
    {
      id: 8,
      title: "Eighth Semester",
      subjects: "Final Project, Internship, Elective II",
      color: "border-orange-500",
      credits: "17 Credit Hours",
      image: "/sem8.jpg",
    },
  ];

  return (
    <div className="py-12 mt-10">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">B.Sc. CSIT Program Structure</h2>
          <p className="text-gray-600 mb-4">Eight Semester Course Structure</p>
          <div className="h-1 w-20 bg-blue-600 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
  {semesters.map((semester) => (
    <Link
      to={`/semester/${semester.id}`}
      key={semester.id}
      className="block"
    >
      <div
        className={`bg-white rounded-lg transition-all duration-500 transform shadow-gray-600 shadow-md hover:shadow-lg hover:scale-105 overflow-hidden relative h-80 cursor-pointer`}
        onMouseEnter={() => setHoveredCard(semester.id)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/30 z-10"></div>
          <img
            src={semester.image}
            alt={semester.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        <div className="relative z-20 p-6 text-center h-full flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {semester.title}
            </h3>
            <p className="text-sm text-gray-200 mb-2">{semester.subjects}</p>
            <p className="text-xs text-blue-200">{semester.credits}</p>
            <div className={`mt-4 h-0.5 w-12 mx-auto bg-white`}></div>
          </div>

          <div className={`transition-all duration-300 ${
            hoveredCard === semester.id ? "opacity-100" : "opacity-70"
          }`}>
            <span className="inline-flex items-center text-white text-sm font-medium">
              View Details <ChevronRight size={16} className="ml-1" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  ))}
</div>

        <div className="mt-12 text-center">
          <Link 
            to="/admission-details"
            className="inline-flex items-center px-6 py-3 rounded-md bg-blue-600 text-white font-medium shadow-md hover:shadow-lg hover:scale-105 hover:bg-blue-700 transition-all duration-300"
          >
            <GraduationCap className="mr-2" size={24} />
            <span className="text-lg">View Admission Details</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CourseSection;