import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ContactRound,
  Download,
  Images,
  LibraryBig,
  SquarePen,
  University,
  User,
} from "lucide-react";
import {Link} from 'react-router'
const SecondNavbar = () => {
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [showCsitDropdown, setShowCsitDropdown] = useState(false);
  const [showScienceDropdown, setShowSciencetDropdown] = useState(false);

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleDeptDropdown = () => {
    setShowDeptDropdown(!showDeptDropdown);
    setShowCsitDropdown(false);
    setShowSciencetDropdown(false);
  };
  const handleCsitDropdown = () => {
    setShowCsitDropdown(!showCsitDropdown);
  };
  const handleScienceDropdown = () => {
    setShowSciencetDropdown(!showScienceDropdown);
  };

  useEffect(() => {
    if (showCsitDropdown) {
      setShowSciencetDropdown(false);
    }
  },[showDeptDropdown]);
  useEffect(() => {
    // Close other dropdowns when CSIT dropdown opens
    if (showCsitDropdown) {
      setShowSciencetDropdown(false);
    }
  }, [showCsitDropdown]);

  useEffect(() => {
    // Close other dropdowns when Science dropdown opens
    if (showScienceDropdown) {
    
      setShowCsitDropdown(false);
    }
  }, [showScienceDropdown]);

  return (
    <div
    className={`hidden md:block transition-opacity duration-300 ${
      isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}
    >
    <div className="bg-blue-950 select-none items-center max-w-7xl mx-auto mt-4 p-4 text-white rounded-md shadow-md">
      <div className="flex items-center justify-evenly">
        <div className="flex gap-2 cursor-pointer hover:bg-blue-500 transition-all duraation-300 p-1.5 rounded-md">
          <University />
          <Link to="/about-us" className="text-lg">About Us</Link>
        </div>

        <div>
          <div
            onClick={handleDeptDropdown}
            className="flex gap-2 cursor-pointer hover:bg-blue-500 transition-all duraation-300 p-1.5 rounded-md"
          >
            <LibraryBig />
            <p className="text-lg">Departments</p>
          </div>
          {showDeptDropdown && (
            <section className="bg-gray-200 p-2 text-black z-10 absolute rounded-md shadow-md mt-2 text-lg">
              <ul className="flex flex-col gap-2">
                <div>
                  <div
                    onClick={handleCsitDropdown}
                    className="flex gap-2 items-center cursor-pointer hover:bg-blue-500 p-1.5 rounded-md transition-all duration-300"
                  >
                    <li>Computer Science & IT</li>
                    {showCsitDropdown ? (
                      <ChevronDown strokeWidth={3} />
                    ) : (
                      <ChevronRight strokeWidth={3} />
                    )}
                  </div>
                  {showCsitDropdown && (
                    <div className="bg-gray-300 p-2 rounded-md mt-2 z-10 absolute -right-79 shadow-md">
                      <ul className="flex flex-col gap-2">
                        <li className="cursor-pointer hover:bg-blue-500 p-1.5 rounded-md transition-all duration-300">
                          Bsc Computer Science & IT
                        </li>
                        <li className="cursor-pointer hover:bg-blue-500 p-1.5 rounded-md transition-all duration-300">
                          Bachelors in Information Technlogy
                        </li>
                        <li className="cursor-pointer hover:bg-blue-500 p-1.5 rounded-md transition-all duration-300">
                          Masters in Information Technology
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                <div>
                  <div
                    onClick={handleScienceDropdown}
                    className="flex gap-2 items-center cursor-pointer hover:bg-blue-500 p-1.5 rounded-md transition-all duration-300 w-fit"
                  >
                    <li>Pure Science</li>
                    {showScienceDropdown ? (
                      <ChevronDown strokeWidth={3} />
                    ) : (
                      <ChevronRight strokeWidth={3} />
                    )}
                  </div>
                  {showScienceDropdown && (
                    <div className="bg-gray-300 p-2 rounded-md mt-2 z-10 absolute -right-43 top-15 shadow-md">
                      <ul className="flex flex-col gap-2">
                        <li className="cursor-pointer hover:bg-blue-500 p-1.5 rounded-md transition-all duration-300">
                          Bsc Physics
                        </li>
                        <li className="cursor-pointer hover:bg-blue-500 p-1.5 rounded-md transition-all duration-300">
                          Bsc Chemistry
                        </li>
                        <li className="cursor-pointer hover:bg-blue-500 p-1.5 rounded-md transition-all duration-300">
                          Bsc Mathematics
                        </li>
                        <li className="cursor-pointer hover:bg-blue-500 p-1.5 rounded-md transition-all duration-300">
                          Bsc Botany
                        </li>
                        <li className="cursor-pointer hover:bg-blue-500 p-1.5 rounded-md transition-all duration-300">
                          Bsc Zoology
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </ul>
            </section>
          )}
        </div>
        <Link to="/notices" className="flex gap-2 cursor-pointer hover:bg-blue-500 transition-all duraation-300 p-1.5 rounded-md">
          <SquarePen />
          <p className="text-lg">Notices</p>
        </Link>

        <div className="flex gap-2 cursor-pointer hover:bg-blue-500 transition-all duraation-300 p-1.5 rounded-md">
          <Download />
          <p className="text-lg">Downloads</p>
        </div>

        <div className="flex gap-2 cursor-pointer hover:bg-blue-500 transition-all duraation-300 p-1.5 rounded-md">
          <User />
          <p className="text-lg">Profiles</p>
        </div>

        <div className="flex gap-2 cursor-pointer hover:bg-blue-500 transition-all duraation-300 p-1.5 rounded-md">
          <Images />
          <p className="text-lg">Gallery</p>
        </div>

        <div className="flex gap-2 cursor-pointer hover:bg-blue-500 transition-all duraation-300 p-1.5 rounded-md">
          <ContactRound />
          <p className="text-lg">Contacts</p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default SecondNavbar;
