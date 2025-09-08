import React, { useState, useCallback, useEffect } from 'react';
import { 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  FileText, 
  ChevronRight,
  PieChart,
  Clock
} from 'lucide-react';
import StudentAssignmentView from '@/components/StudentAssignmentView';
import useAuthStore from "@/store/authStore";

const StudentDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { profile } = useAuthStore();
  const [selectedSemester, setSelectedSemester] = useState(
    localStorage.getItem(`studentSemester_${profile?._id}`) || null 
  );

  const [showSemesterModal, setShowSemesterModal] = useState(!selectedSemester);
  const [activeTab, setActiveTab] = useState('overview');
  const [pendingAssignmentsCount, setPendingAssignmentsCount] = useState(0);

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  const saveSemesterChoice = (semester) => {
    localStorage.setItem(`studentSemester_${profile?._id}`, semester);
    setSelectedSemester(semester);
    setShowSemesterModal(false);
  };
  useEffect(() => {
    // Load semester choice on component mount
    const storedSemester = localStorage.getItem(`studentSemester_${profile?._id}`);
    if (storedSemester) {
      setSelectedSemester(storedSemester);
    }
  }, [profile]);

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
              { id: 'overview', icon: BookOpen, label: 'Overview' },
              { id: 'assignments', icon: FileText, label: 'Assignments' },
              { id: 'attendance', icon: Calendar, label: 'Attendance' },
              { id: 'academics', icon: GraduationCap, label: 'Academic' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
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
              <p className="text-3xl font-bold text-gray-900">85%</p>
              <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Pending Assignments</h3>
                <FileText size={20} className="text-orange-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{pendingAssignmentsCount}</p>
              <p className="text-sm text-gray-500 mt-1">Due this week</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Next Class</h3>
                <Clock size={20} className="text-green-500" />
              </div>
              <p className="text-xl font-bold text-gray-900">Database Management</p>
              <p className="text-sm text-gray-500 mt-1">Today at 11:00 AM</p>
            </div>
          </div>

          {/* Dynamic Content Area */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 min-h-[500px]">
            {activeTab === 'overview' && <OverviewContent />}
            {activeTab === 'assignments' && <AssignmentsContent updatePendingAssignmentsCount={updatePendingAssignmentsCount}/>}
            {activeTab === 'attendance' && <AttendanceContent />}
            {activeTab === 'academics' && <AcademicsContent />}
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

const AssignmentsContent = ({updatePendingAssignmentsCount}) => (
  <div>
    <h2 className="text-2xl font-bold mb-6">Assignments</h2>
      <StudentAssignmentView updatePendingAssignmentsCount={updatePendingAssignmentsCount}/>
  </div>
);

const AttendanceContent = () => (
  <div>
    <h2 className="text-2xl font-bold mb-6">Attendance Records</h2>
    {/* Add attendance content */}
  </div>
);

const AcademicsContent = () => (
  <div>
    <h2 className="text-2xl font-bold mb-6">Academic Records</h2>
    {/* Add academic records content */}
  </div>
);

export default StudentDashboard;