import React, { useState, useEffect } from "react";
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
import axios from "axios";
import { format } from "date-fns";
const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white/80 py-5 rounded-lg ml-4 mt-60 h-[50%] backdrop-blur-xl border-r border-gray-200 p-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Faculty Portal</h2>
            <p className="text-md text-gray-500">Teacher Dashboard</p>
          </div>
          <nav className="space-y-4 text-lg">
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
    <AssignmentManagementComp />
  </div>
);

const AttendanceTracking = ({ teacher }) => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );

  // Fetch approved students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5002/api/admin/students",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setStudents(res.data.filter((s) => s.isApproved));
        console.log("Fetched students:", res.data);
        console.log(
          "Approved students:",
          res.data.filter((s) => s.isApproved)
        );
      } catch (err) {
        console.error("Error fetching students:", err);
      }
    };
    fetchStudents();
  }, []);
  useEffect(() => {
    fetchAttendanceRecords();
  }, [selectedDate]);

  const fetchAttendanceRecords = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5002/api/attendance/teacher?date=${selectedDate}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // Build a lookup for quick access
      const lookup = {};
      res.data.forEach((record) => {
        lookup[`${record.studentId}_${record.subject}_${record.date}`] = record.status;
      });
      setAttendance(lookup);
    } catch (err) {
      console.error("Error fetching attendance records:", err);
    }
  };
  // Handle attendance marking
  const handleMarkAttendance = async (studentId, subject, status) => {
    try {
      await axios.post(
        "http://localhost:5002/api/attendance/mark",
        {
          studentId,
          subject,
          date: selectedDate,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchAttendanceRecords(); // <-- Refresh after marking
    } catch (err) {
      console.error("Error marking attendance:", err);
    }
  };
 
  // Subjects assigned to this teacher
  const subjects = teacher?.subjects || ["Java", "System Deisgn"];
  console.log("Teacher subjects:", subjects);
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Attendance</h2>
      <div className="mb-4">
        <label className="font-medium mr-2">Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border rounded px-2 py-1"
        />
      </div>
      <div className="bg-white rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Subject</th>
              <th className="px-4 py-2 text-left">Student Name</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject) => (
              <React.Fragment key={subject}>
                <tr className="bg-gray-100">
                  <td className="px-4 py-2 font-semibold" colSpan={5}>
                    {subject}
                  </td>
                </tr>
                {students.map((student) => {
                  const key = `${student._id}_${subject}_${selectedDate}`;
                  return (
                    <tr key={key} className="hover:bg-gray-50">
                      <td className="px-4 py-2"></td>
                      <td className="px-4 py-2">{student.name}</td>
                      <td className="px-4 py-2">{selectedDate}</td>
                      <td className="px-4 py-2">
                        {attendance[key] || (
                          <span className="text-gray-400">Not marked</span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <button
                          className={`px-3 py-1 mr-2 rounded ${
                            attendance[key] === "Present"
                              ? "bg-green-500 text-white"
                              : "bg-gray-200"
                          }`}
                          onClick={() =>
                            handleMarkAttendance(
                              student._id,
                              subject,
                              "Present"
                            )
                          }
                        >
                          Present
                        </button>
                        <button
                          className={`px-3 py-1 rounded ${
                            attendance[key] === "Absent"
                              ? "bg-red-500 text-white"
                              : "bg-gray-200"
                          }`}
                          onClick={() =>
                            handleMarkAttendance(student._id, subject, "Absent")
                          }
                        >
                          Absent
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StudentManagement = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">Student Management</h2>
    {/* Add student management tools */}
  </div>
);

export default TeacherDashboard;
