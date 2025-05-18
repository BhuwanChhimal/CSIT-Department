import React from "react";
import { IoIosLogIn } from "react-icons/io";
import { useNavigate } from "react-router";

const MainNavbar = () => {
  const navigate = useNavigate()
  const handleLoginbtn = () => {
    navigate("/auth");
  };
  return (
    <div className="flex flex-col md:flex-row justify-between select-none items-center backdrop-blur-sm bg-white/30 max-w-6xl rounded-lg mx-4 md:mx-auto mt-4 p-4 shadow-gray-400 shadow-md">
      <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
        <div>
          <img src="/collegelogo.png" className="w-16 h-16 md:w-20 md:h-20 cursor-pointer" alt="clg-logo" />
        </div>
        <div className="flex flex-col text-center md:text-left mt-2 md:mt-0 md:ml-4">
          <h1 className="text-xl md:text-2xl font-bold">Amrit Science Campus</h1>
          <h3 className="text-sm md:text-base text-blue-900">Tribhuvan University</h3>
        </div>
      </div>
      <div className="mt-4 md:mt-0">
        <button onClick={handleLoginbtn} className="cursor-pointer">
          <IoIosLogIn size={28} />
        </button>
      </div>
    </div>
  );
};

export default MainNavbar;
