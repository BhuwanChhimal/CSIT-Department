import React from "react";
import MainNavbar from "./components/MainNavbar";
import { Routes, Route } from "react-router";
import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";
import SecondNavbar from "./components/SecondNavbar";
import AboutUs from "./pages/AboutUs";
import Notices from "./pages/Notices";

const App = () => {
  return (
    <div className="relative">
      <div className="fixed top-0 w-full z-50">
        <MainNavbar/>
        <SecondNavbar />
      </div>
      <div className="relative"> {/* Adjust padding-top based on combined navbar height */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/notices" element={<Notices/>} />
        </Routes>
      </div>
    </div>
  );
};

export default App;