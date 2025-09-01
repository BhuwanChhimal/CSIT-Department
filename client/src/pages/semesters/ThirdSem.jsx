import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Book } from 'lucide-react';
import axios from 'axios';

const ThirdSem = () => {
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);

    useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      fetchSubjects();
    }, []);

  const fetchSubjects = async () => {
    try {
      const res = await axios.get("http://localhost:5002/api/subjects/semester/3");
      console.log("Fetched notices:", res.data);
      setSubjects(res.data.data || []);
    } catch (error) {
      console.error("Error fetching notices:", error);
    } finally {
      console.log("Fetch attempt finished.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-50 px-6 md:px-12 lg:px-16">
      <div className="max-w-8xl mx-auto">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-8 lg:mb-12">
          Third Semester
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              onClick={() => navigate(`/semester/1/subject/${subject._id}`)}
              className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-gray-200 
                       p-8 lg:p-10 hover:shadow-xl hover:border-blue-300 transition-all 
                       duration-300 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="font-bold text-2xl lg:text-3xl text-gray-800 mb-2 
                               group-hover:text-blue-600">
                    {subject.name}
                  </h3>
                  <p className="text-base lg:text-lg text-blue-600 font-medium">
                    {subject.code}
                  </p>
                </div>
                <Book className="text-blue-500 w-8 h-8 lg:w-10 lg:h-10 
                               group-hover:scale-110 transition-transform" />
              </div>
              
              <p className="text-gray-600 text-base lg:text-lg mb-6">
                {subject.description}
              </p>
              
              <div className="flex items-center justify-between text-base lg:text-lg">
                <span className="text-gray-500 font-medium">
                  {subject.chapters} Chapters
                </span>
                <span className="text-blue-500 font-medium 
                               group-hover:translate-x-2 transition-transform">
                  View Details →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThirdSem;