import React from "react";
import MainNavbar from "./components/MainNavbar";
import { Routes, Route } from "react-router";
import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";
import SecondNavbar from "./components/SecondNavbar";
import AboutUs from "./pages/AboutUs";
import Notices from "./pages/Notices";
import AdmissionDetails from "./pages/AdmissionDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import FirstSem from "./pages/semesters/FirstSem";
import SecondSem from "./pages/semesters/SecondSem";
import ThirdSem from "./pages/semesters/ThirdSem";
import FourthSem from "./pages/semesters/FourthSem";
import FifthSem from "./pages/semesters/FifthSem";
import SixthSem from "./pages/semesters/SixthSem";
import SeventhSem from "./pages/semesters/SeventhSem";
import EighthSem from "./pages/semesters/EighthSem";
import StudentProfile from "./pages/profile/StudentProfile";
import TeacherProfile from "./pages/profile/TeacherProfile";
import AdminProfile from "./pages/profile/AdminProfile";
const App = () => {
  return (
    <div className="relative">
      <div className="fixed top-0 w-full z-50">
        <MainNavbar />

        <SecondNavbar />
      </div>
      <div className="relative">
        {" "}
        {/* Adjust padding-top based on combined navbar height */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/admission-details" element={<AdmissionDetails />} />
          <Route path="/semester/1" element={<FirstSem />} />
          <Route path="/semester/2" element={<SecondSem />} />
          <Route path="/semester/3" element={<ThirdSem />} />
          <Route path="/semester/4" element={<FourthSem />} />
          <Route path="/semester/5" element={<FifthSem />} />
          <Route path="/semester/6" element={<SixthSem />} />
          <Route path="/semester/7" element={<SeventhSem />} />
          <Route path="/semester/8" element={<EighthSem />} />
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <ProtectedRoute role="student">
                <StudentProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/dashboard"
            element={
              <ProtectedRoute role="teacher">
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/profile"
            element={
              <ProtectedRoute role="teacher">
                <TeacherProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute role="admin">
                <AdminProfile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
