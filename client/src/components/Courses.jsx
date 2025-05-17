import { useState } from "react";
import { GraduationCap, ChevronRight } from "lucide-react";

export default function CourseSection() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const courses = [
    {
      id: 1,
      title: "BSc(Mathematics)",
      fullTitle: "Bachelor of Science in Mathematics",
      level: "Bachelor's Degree",
      color: "border-blue-500",
      image: "/maths.avif",
    },
    {
      id: 2,
      title: "M.Sc. Chemistry",
      fullTitle: "M.Sc. in Chemistry",
      level: "Master's Degree",
      color: "border-red-500",
      image:'/chemistry.webp',
    },
    {
      id: 3,
      title: "M.Sc. Botany",
      fullTitle: "M.Sc. in Botany",
      level: "Master's Degree",
      color: "border-green-500",
      image: "/botany.png",
    },
    {
      id: 4,
      title: "M.Sc. Physics",
      fullTitle: "M.Sc. in Physics",
      level: "Master's Degree",
      color: "border-purple-500",
      image: "/physics.jpeg",
    },
    {
      id: 5,
      title: "M.Sc. Zoology",
      fullTitle: "M.Sc. in Zoology",
      level: "Master's Degree",
      color: "border-yellow-500",
      image: "/zoology.png",
    },
    {
      id: 6,
      title: "MIT",
      fullTitle: "Master in Information Technology",
      level: "Master's Degree",
      color: "border-cyan-500",
      image: "/mit.jpeg",
    },
    {
      id: 7,
      title: "B.Sc.CSIT",
      fullTitle:
        "Bachelor of Science in Computer Science and Information Technology",
      level: "Bachelor's Degree",
      color: "border-indigo-500",
      image: "/csit.jpg",
    },
    {
      id: 8,
      title: "BSC(Chemistry)",
      fullTitle: "Bachelor of Science in Chemistry",
      level: "Bachelor's Degree",
      color: "border-orange-500",
      image:'/chemistry.webp',
    },
  ];

  return (
    <div className="py-12 mt-10">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Courses</h2>
          <div className="h-1 w-20 bg-blue-600 mx-auto"></div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className={`bg-white rounded-lg transition-all duration-500 transform shadow-gray-600 shadow-md hover:shadow-lg hover:scale-105 overflow-hidden relative h-72`}
              onMouseEnter={() => setHoveredCard(course.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Background Image with Overlay */}
              <div className="absolute inset-0 w-full h-full">
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/30 z-10"></div>
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* Content Overlay */}
              <div className="relative z-20 p-6 text-center h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-1">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-200">{course.fullTitle}</p>
                  <div className={`mt-4 h-0.5 w-12 mx-auto bg-white`}></div>
                </div>

                <div
                  className={`transition-all duration-300 ${
                    hoveredCard === course.id ? "opacity-100" : "opacity-70"
                  }`}
                >
                  <a
                    href="#"
                    className="inline-flex items-center text-white text-sm font-medium hover:text-blue-200"
                  >
                    Learn More <ChevronRight size={16} className="ml-1" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <a
            href="#"
            className="inline-flex items-center px-5 py-3 rounded-md bg-gray-600 text-white font-medium shadow-md hover:shadow-lg hover:scale-102  hover:bg-gray-700 transition-all duration-300"
          >
            <GraduationCap className="mr-2" size={32} />
            <span className="text-xl">View Admission Details</span>
          </a>
        </div>
      </div>
    </div>
  );
}
