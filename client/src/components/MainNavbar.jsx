import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FaRegUser } from "react-icons/fa";
import { AiOutlineLogin, AiOutlineLogout } from "react-icons/ai";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import useAuthStore from "../store/authStore";

const MainNavbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout,profile, fetchProfile } = useAuthStore();

  useEffect(() => {
    console.log("Fetching profile..."); // Debug log
    fetchProfile();
  },[fetchProfile]);

  const role = localStorage.getItem("userRole");
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleProfilebtn = () => {
    if (role === "student") {
      navigate("/student/profile");
    } else if (role === "teacher") {
      navigate("/teacher/profile");
    } else if (role === "admin") {
      navigate("/admin/profile");
    }
  };

  return (
    <div className="fixed top-10 left-0 right-0 z-50 px-4 py-2">
      <div className="flex  md:flex-row justify-between select-none items-center bg-gray-200/90 backdrop-blur-sm max-w-6xl rounded-full mx-auto p-3 px-5 shadow-gray-400 shadow-md">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="shrink-0">
            <img
              src="/collegelogo.png"
              className="w-12 h-12 md:w-16 md:h-16 cursor-pointer"
              alt="clg-logo"
            />
          </div>
          <div className="flex flex-col ml-3">
            <h1 className="text-lg md:text-xl font-bold">CSIT</h1>
            <h3 className="text-xs md:text-sm text-blue-900">
              Amrit Science Campus
            </h3>
          </div>
        </div>

        <div className="mt-2 md:mt-0">
          <DropdownMenu >
            <DropdownMenuTrigger className="rounded-full bg-blue-300 p-2 hover:bg-blue-400 transition-colors">
              <FaRegUser size={24} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-2 mt-7 backdrop-blur-sm bg-gray-100/90 shadow-md shadow-gray-200 min-w-[160px] rounded-xl">
              <DropdownMenuLabel className="text-xl capitalize">
              {isAuthenticated ? (profile?.name || "User") : "Guest"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {isAuthenticated ? (
                <>
                  <DropdownMenuItem
                    className="text-md"
                    onClick={handleProfilebtn}
                  >
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-md"
                    onClick={() => {
                      if (role === "student") {
                        navigate("/student/dashboard");
                      } else if (role === "teacher") {
                        navigate("/teacher/dashboard");
                      } else if (role === "admin") {
                        navigate("/admin");
                      }
                    }}
                  >
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-md text-red-600"
                    onClick={handleLogout}
                  >
                    Logout <AiOutlineLogout className="ml-2" />
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem
                  onClick={() => navigate("/auth")}
                  className="text-md"
                >
                  Login <AiOutlineLogin className="ml-2" />
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default MainNavbar;
