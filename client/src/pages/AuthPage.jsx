import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import useAuthStore from "../store/authStore";
import {
  Eye,
  EyeOff,
  Loader2,
  GraduationCap,
  Users,
  Shield,
} from "lucide-react";
import { toast } from "react-hot-toast";
const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateForm = () => {
    const newErrors = {};

    // Name validation (only for registration)
    if (!isLogin) {
      if (!formData.name.trim()) {
        newErrors.name = "Name is required";
      } else if (formData.name.trim().length < 2) {
        newErrors.name = "Name must be at least 2 characters";
      }
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsLoading(true);
    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    try {
      const res = await axios.post(
        `http://localhost:5002${endpoint}`,
        formData
      );

      const { token, user } = res.data;

      // Wait for login to complete (it's async and fetches profile)
      await login(token, user.role);

      // Wait for Zustand to finish fetching profile before navigating
      const checkProfile = async () => {
        const maxRetries = 10;
        let tries = 0;
        while (!useAuthStore.getState().profile && tries < maxRetries) {
          await new Promise((res) => setTimeout(res, 200));
          tries++;
        }
      };

      await checkProfile();

      // Redirect based on role
      const role = res.data.user.role;
      toast.success("Logged in successfully");
      if (role === "student") {
        navigate("/student/dashboard", { replace: true });
      } else if (role === "teacher") {
        navigate("/teacher/dashboard", { replace: true });
      } else if (role === "admin") {
        navigate("/admin", { replace: true });
      }
      setIsLoading(false);
    } catch (err) {
      toast.error("Invalid credentials");
      setErrors(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  const getRoleIcon = (role) => {
    switch (role) {
      case "student":
        return <GraduationCap className="w-4 h-4" />;
      case "teacher":
        return <Users className="w-4 h-4" />;
      case "admin":
        return <Shield className="w-4 h-4" />;
      default:
        return <GraduationCap className="w-4 h-4" />;
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-8 -left-8 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10 pt-50">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Amrit Science Campus
          </h1>
          <p className="text-gray-600 font-medium">Student & Faculty Portal</p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/50 relative">
          {/* Glass effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-3xl"></div>

          <div className="relative z-10">
            {/* Form Toggle */}
            <div className="flex bg-gray-100/80 rounded-2xl p-1 mb-8">
              <button
                type="button"
                onClick={() => isLogin || toggleForm()}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                  isLogin
                    ? "bg-white text-gray-800 shadow-lg"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => !isLogin || toggleForm()}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                  !isLogin
                    ? "bg-white text-gray-800 shadow-lg"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Register
              </button>
            </div>

            {/* Error Message */}
            {typeof errors === 'string' && (
              <div className="bg-red-50 border border-red-200 p-4 mb-6 rounded-xl">
                <p className="text-red-700 text-sm font-medium">{errors}</p>
              </div>
            )}

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white/70 backdrop-blur-sm placeholder-gray-400"
                    placeholder="Enter your full name"
                  />
                  {errors?.name && (
                    <p className="text-red-600 text-xs mt-1 font-medium">
                      {errors.name}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white/70 backdrop-blur-sm placeholder-gray-400"
                  placeholder="you@example.com"
                />
                {errors?.email && (
                  <p className="text-red-600 text-xs mt-1 font-medium">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-4 pr-12 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white/70 backdrop-blur-sm placeholder-gray-400"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors?.password && (
                  <p className="text-red-600 text-xs mt-1 font-medium">
                    {errors.password}
                  </p>
                )}
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Role
                  </label>
                  <div className="relative">
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white/70 backdrop-blur-sm appearance-none cursor-pointer"
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="admin">Administrator</option>
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      {getRoleIcon(formData.role)}
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  <>
                    <span>{isLogin ? "Sign In" : "Create Account"}</span>
                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform duration-200">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 text-sm">
                {isLogin ? "New to the portal?" : "Already have an account?"}{" "}
                <button
                  onClick={toggleForm}
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200 underline-offset-4 hover:underline"
                >
                  {isLogin ? "Create Account" : "Sign In"}
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Secure access to your academic portal
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
