import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { BookOpen, Users, Bell, Library } from "lucide-react";

const SecondNavbar = () => {
  const [showSemesterDropdown, setShowSemesterDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSemesterDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="fixed top-38 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-gray-900/70 backdrop-blur-md rounded-full px-6 py-2 shadow-lg border border-white/10">
        <div className="flex items-center justify-center gap-8">
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setShowSemesterDropdown(!showSemesterDropdown)}
              className="flex items-center gap-2 px-4 py-2 text-gray-100 hover:bg-white/20 rounded-full transition-all duration-300"
            >
              <Library size={20} className="text-blue-400" />
              <span className="text-sm font-medium">Semesters</span>
            </button>

            {showSemesterDropdown && (
              <div className="absolute top-full mt-2 w-56 bg-gray-900/90 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 shadow-xl">
                <div className="py-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <Link
                      key={sem}
                      to={`/semester/${sem}`}
                      onClick={() => setShowSemesterDropdown(false)}
                      className="flex items-center justify-between px-4 py-3 text-sm text-gray-100 hover:bg-white/20 transition-all duration-200"
                    >
                      <span className="flex items-center gap-2">
                        <BookOpen size={16} className="text-blue-400" />
                        {`${sem}${["st", "nd", "rd"][sem - 1] || "th"} Semester`}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link 
            to="/notices" 
            className="flex items-center gap-2 px-4 py-2 text-gray-100 hover:bg-white/20 rounded-full transition-all duration-300"
          >
            <Bell size={20} className="text-blue-400" />
            <span className="text-sm font-medium">Notices</span>
          </Link>

          <Link 
            to="/about-us" 
            className="flex items-center gap-2 px-4 py-2 text-gray-100 hover:bg-white/20 rounded-full transition-all duration-300"
          >
            <Users size={20} className="text-blue-400" />
            <span className="text-sm font-medium">About</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SecondNavbar;