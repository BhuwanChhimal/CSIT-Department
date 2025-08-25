import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import useAuthStore from '../store/authStore';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

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
      
      // Use Zustand store action instead of localStorage
      login(res.data.token, res.data.user.role);

      // Redirect based on role
      const role = res.data.user.role;
      if (role === "student") {
        navigate("/student/dashboard");
      } else if (role === "teacher") {
        navigate("/teacher/dashboard");
      } else if (role === "admin") {
        navigate("/admin");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src="/collegelogo.png" 
            alt="College Logo" 
            className="w-24 h-24 mx-auto mb-4 drop-shadow-xl"
          />
          <h1 className="text-3xl font-bold  mb-2">Amrit Science Campus</h1>
          <p className="text-lg ">Student & Faculty Portal</p>
        </div>

        <div className="backdrop-blur-xl bg-white/10 p-8 rounded-2xl shadow-2xl border border-white/20">
          <h2 className="text-2xl font-bold mb-6 text-center ">
            {isLogin ? "Welcome Back" : "Create New Account"}
          </h2>

          {error && (
            <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/20 p-4 mb-6 rounded-lg">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label className="block text-sm font-medium ">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg b focus:outline-none transition-all"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium ">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg transition-all"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lgtransition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/90">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg transition-all border"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Faculty Member</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-200 hover:bg-blue-300  py-3 rounded-lg transition-all duration-200 font-semibold backdrop-blur-sm  hover:shadow-lg disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                isLogin ? "Sign In" : "Create Account"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="">
              {isLogin ? "New to the portal?" : "Already have an account?"}{" "}
              <button
                onClick={toggleForm}
                className="font-semibold transition-colors duration-200"
              >
                {isLogin ? "Create Account" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;