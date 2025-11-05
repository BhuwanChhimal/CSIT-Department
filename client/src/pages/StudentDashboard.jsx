import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  BookOpen,
  GraduationCap,
  Calendar,
  FileText,
  ChevronRight,
  PieChart,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import StudentAssignmentView from "@/components/StudentAssignmentView";
import useAuthStore from "@/store/authStore";
import MarksPredictor from "@/components/MarksPredictor";
import axios from "axios";
const StudentDashboard = () => {
  // const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { profile } = useAuthStore();
  const [selectedSemester, setSelectedSemester] = useState(
    localStorage.getItem(`studentSemester_${profile?._id}`) || null
  );
  const [showSemesterModal, setShowSemesterModal] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const [activeTab, setActiveTab] = useState("overview");
  const [pendingAssignmentsCount, setPendingAssignmentsCount] = useState(0);

  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendancePercentage, setAttendancePercentage] = useState(0);

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  const saveSemesterChoice = (semester) => {
    localStorage.setItem(`studentSemester_${profile?._id}`, semester);
    setSelectedSemester(semester);
    setShowSemesterModal(false);
  };
  useEffect(() => {
    if (profile?._id && !isInitialized) {
      const storedSemester = localStorage.getItem(
        `studentSemester_${profile._id}`
      );

      if (storedSemester) {
        setSelectedSemester(storedSemester);
        setShowSemesterModal(false);
      } else {
        setShowSemesterModal(true);
      }

      setIsInitialized(true);
    }
  }, [profile?._id, isInitialized]);

  useEffect(() => {
    const fetchAttendance = async () => {
      const res = await axios.get(
        `http://localhost:5002/api/attendance/status?studentId=${profile?._id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setAttendanceRecords(res.data);
      console.log(attendanceRecords);
      // Calculate percentage
      const total = res.data.length;
      const present = res.data.filter((r) => r.status === "Present").length;
      const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
      setAttendancePercentage(percentage);
    };
    fetchAttendance();
  }, [profile?._id]);
  // Callback function to update pending assignments count
  const updatePendingAssignmentsCount = (count) => {
    setPendingAssignmentsCount(count);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Semester Selection Modal */}
      {showSemesterModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-96 shadow-xl">
            <h2 className="text-2xl font-bold mb-6">Select Your Semester</h2>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <button
                  key={sem}
                  onClick={() => saveSemesterChoice(sem)}
                  className="p-4 text-left hover:bg-blue-50 rounded-xl transition-all border border-gray-100 hover:border-blue-200"
                >
                  <span className="font-semibold text-lg">{sem}st</span>
                  <span className="block text-sm text-gray-500">Semester</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Layout */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 py-5 rounded-lg ml-4 mt-60 h-[50%] bg-white/80 backdrop-blur-xl border-r border-gray-200 p-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Student Portal</h2>
            <p className="text-md text-gray-500">Semester {selectedSemester}</p>
          </div>

          <nav className="space-y-4 text-lg">
            {[
              { id: "overview", icon: BookOpen, label: "Overview" },
              { id: "assignments", icon: FileText, label: "Assignments" },
              { id: "attendance", icon: Calendar, label: "Attendance" },
              // { id: "academics", icon: GraduationCap, label: "Academic" },
              {
                id: "ai-feature",
                icon: ChevronRight,
                label: "Marks Predictor",
              },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
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
                <h3 className="font-semibold text-gray-800">Attendance Rate</h3>
                <PieChart size={20} className="text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {attendancePercentage}%
              </p>
              <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">
                  Pending Assignments
                </h3>
                <FileText size={20} className="text-orange-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {pendingAssignmentsCount}
              </p>
              <p className="text-sm text-gray-500 mt-1">Due this week</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Next Class</h3>
                <Clock size={20} className="text-green-500" />
              </div>
              <p className="text-xl font-bold text-gray-900">
                Database Management
              </p>
              <p className="text-sm text-gray-500 mt-1">Today at 11:00 AM</p>
            </div>
          </div>

          {/* Dynamic Content Area */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 min-h-[500px]">
            {activeTab === "overview" && <OverviewContent />}
            {activeTab === "assignments" && (
              <AssignmentsContent
                updatePendingAssignmentsCount={updatePendingAssignmentsCount}
              />
            )}
            {activeTab === "attendance" && <AttendanceContent attendanceRecords={attendanceRecords}/>}
            {/* {activeTab === "academics" && <AcademicsContent />} */}
            {activeTab === "ai-feature" && <MarksPredictorContent />}
          </div>
        </div>
      </div>
    </div>
  );
};

// Content Components
const OverviewContent = () => (
  <div>
    <h2 className="text-2xl font-bold mb-6">Overview</h2>
    {/* Add overview content */}
  </div>
);

const AssignmentsContent = ({ updatePendingAssignmentsCount }) => (
  <div>
    <h2 className="text-2xl font-bold mb-6">Assignments</h2>
    <StudentAssignmentView
      updatePendingAssignmentsCount={updatePendingAssignmentsCount}
    />
  </div>
);

const AttendanceContent = ({attendanceRecords}) => {
  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const [selectedDate, setSelectedDate] = useState(getTodayDate());

  // Filter attendance records for selected date
  const filteredRecords = useMemo(() => {
    return attendanceRecords.filter((record) => record.date === selectedDate);
  }, [selectedDate]);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  // Calculate attendance statistics
  const stats = useMemo(() => {
    const present = filteredRecords.filter(
      (r) => r.status === "Present"
    ).length;
    const absent = filteredRecords.filter((r) => r.status === "Absent").length;
    const total = filteredRecords.length;
    return { present, absent, total };
  }, [filteredRecords]);
  return (
    <div className="bg-gradient-to-br  p-6">
    <div className="max-w-8xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Attendance Dashboard</h1>
        <p className="text-gray-600">View your attendance records by date</p>
      </div>

      {/* Date Selector */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Calendar className="inline w-5 h-5 mr-2" />
          Select Date
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
        <p className="mt-3 text-sm text-gray-600">{formatDate(selectedDate)}</p>
      </div>

      {/* Statistics */}
      {filteredRecords.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-gray-600 text-sm mb-1">Total Classes</p>
            <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-green-50 rounded-lg shadow p-4 text-center">
            <p className="text-green-700 text-sm mb-1">Present</p>
            <p className="text-3xl font-bold text-green-600">{stats.present}</p>
          </div>
          <div className="bg-red-50 rounded-lg shadow p-4 text-center">
            <p className="text-red-700 text-sm mb-1">Absent</p>
            <p className="text-3xl font-bold text-red-600">{stats.absent}</p>
          </div>
        </div>
      )}

      {/* Attendance Records */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Attendance Records
        </h2>
        
        {filteredRecords.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-3">
              <Calendar className="w-16 h-16 mx-auto" />
            </div>
            <p className="text-gray-600 text-lg">No attendance records found for this date</p>
            <p className="text-gray-500 text-sm mt-2">Try selecting a different date</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRecords.map((record) => (
              <div
                key={record._id}
                className={`flex items-center justify-between p-4 rounded-lg border-2 transition ${
                  record.status === "Present"
                    ? "bg-green-50 border-green-200 hover:bg-green-100"
                    : "bg-red-50 border-red-200 hover:bg-red-100"
                }`}
              >
                <div className="flex items-center space-x-4">
                  {record.status === "Present" ? (
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-600" />
                  )}
                  <div>
                    <p>Subject:</p>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {record.subject}
                    </h3>
                 
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-4 py-2 rounded-full font-semibold text-sm ${
                      record.status === "Present"
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {record.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
  );
};

// const AcademicsContent = () => (
//   <div>
//     <h2 className="text-2xl font-bold mb-6">Academic Records</h2>
//     {/* Add academic records content */}
//   </div>
// );

const MarksPredictorContent = () => (
  <div>
    {/* Add marks predictor content */}
    <MarksPredictor />
  </div>
);

export default StudentDashboard;
