import React, { useState } from "react";
import {
  BookOpen,
  Users,
  Calendar,
  FileText,
  PieChart,
  Clock,
  CheckCircle,
  Bell,
} from "lucide-react";
import AssignmentManagementComp from "@/components/AssignmentManagementComp";

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex ">
        {/* Sidebar */}
        <div className="w-64 pt-50 min-h-screen bg-white/80 backdrop-blur-xl border-r border-gray-200 p-6">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800">Faculty Portal</h2>
            <p className="text-sm text-gray-500">Teacher Dashboard</p>
          </div>
          <nav className="space-y-2">
            {[
              { id: "overview", icon: BookOpen, label: "Overview" },
              { id: "assignments", icon: FileText, label: "Assignments" },
              { id: "attendance", icon: Calendar, label: "Attendance" },
              { id: "students", icon: Users, label: "Students" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 pt-60">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Today's Classes</h3>
                <Clock size={20} className="text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">4</p>
              <p className="text-sm text-gray-500 mt-1">3 Remaining</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">
                  Pending Assignments
                </h3>
                <CheckCircle size={20} className="text-orange-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">12</p>
              <p className="text-sm text-gray-500 mt-1">To be reviewed</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">
                  Student Requests
                </h3>
                <Bell size={20} className="text-green-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">5</p>
              <p className="text-sm text-gray-500 mt-1">New requests</p>
            </div>
          </div>

          {/* Dynamic Content Area */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 min-h-[500px]">
            {activeTab === "overview" && <TeacherOverview />}
            {activeTab === "assignments" && <AssignmentManagement />}
            {activeTab === "attendance" && <AttendanceTracking />}
            {activeTab === "students" && <StudentManagement />}
          </div>
        </div>
      </div>
    </div>
  );
};

// Placeholder components - to be implemented separately
const TeacherOverview = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">Today's Schedule</h2>
    {/* Add schedule content */}
  </div>
);

const AssignmentManagement = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">Assignment Management</h2>
    <AssignmentManagementComp/>
  </div>
);

const AttendanceTracking = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">Attendance Tracking</h2>
    {/* Add attendance tracking tools */}
  </div>
);

const StudentManagement = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">Student Management</h2>
    {/* Add student management tools */}
  </div>
);

export default TeacherDashboard;
