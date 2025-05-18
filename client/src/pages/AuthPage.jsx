import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    try {
      const res = await axios.post(`http://localhost:5002${endpoint}`, formData);
      localStorage.setItem("token", res.data.token);

      // Redirect based on role
      const role = res.data.user.role;
      if (role === "student") navigate("/student/dashboard");
      else if (role === "teacher") navigate("/teacher/dashboard");
      else navigate("/admin");

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b to-blue-100 from-white flex flex-col items-center pt-50">
      {/* College Branding Section */}
      <div className="text-center mb-8 mt-8">
        <img 
          src="/collegelogo.png" 
          alt="College Logo" 
          className="w-24 h-24 mx-auto mb-4"
        />
        <h1 className="text-3xl font-bold text-gray-800">Amrit Science Campus</h1>
        <p className="text-lg text-blue-900">Student & Faculty Portal</p>
      </div>
  
      {/* Auth Card */}
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md border-t-4 border-blue-600">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {isLogin ? "Welcome Back" : "Create New Account"}
        </h2>
  
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}
  
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>
          )}
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>
  
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>
  
          {!isLogin && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option value="student">Student</option>
                <option value="teacher">Faculty Member</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          )}
  
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold shadow-md hover:shadow-lg"
          >
            {isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>
  
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {isLogin ? "New to the portal?" : "Already have an account?"}{" "}
            <button
              onClick={toggleForm}
              className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200"
            >
              {isLogin ? "Create Account" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
  
      {/* Footer */}
      <div className="mt-8 text-center text-gray-600 text-sm">
        <p>© {new Date().getFullYear()} Amrit Science Campus. All rights reserved.</p>
        <p>Tribhuvan University</p>
      </div>
    </div>
  );
};

export default AuthPage;
