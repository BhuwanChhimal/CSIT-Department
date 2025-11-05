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
  Loader2,
} from "lucide-react";
import AssignmentManagementComp from "@/components/AssignmentManagementComp";
import axios from "axios";
import { format } from "date-fns";
import PlagiarismChecker from "@/components/PlagiarismChecker";
import useAuthStore from "@/store/authStore";

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [submissions, setSubmissions] = useState({});
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);

  const { profile,isLoading: profileLoading,fetchProfile } = useAuthStore();

  useEffect(() => {
    if (!profile && !profileLoading) {
      fetchProfile();
    }
  }, [profile,profileLoading, fetchProfile]);



  const [pendingAssignmentsCount, setPendingAssignmentsCount] = useState(0);
  // Update pending assignments count whenever submissions change
  useEffect(() => {
    let count = 0;
    Object.values(submissions).forEach((subList) => {
      subList.forEach((sub) => {
        if (!sub.grade) count++;
      });
    });
    setPendingAssignmentsCount(count);
  }, [submissions, setPendingAssignmentsCount]);

  // console.log(profile.subjects)
  useEffect(() => {
    fetchAssignments();
  }, []);
  const token = localStorage.getItem("token");
  const fetchAssignments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5002/api/assignments/teacher",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAssignments(response.data);
          // Fetch submissions for all assignments
    const submissionsObj = {};
    await Promise.all(
      response.data.map(async (assignment) => {
        const res = await axios.get(
          `http://localhost:5002/api/assignments/${assignment._id}/submissions`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        submissionsObj[assignment._id] = res.data;
      })
    );
    setSubmissions(submissionsObj);
    } catch (error) {
      console.log("Failed to fetch assignments:", error);
    }
  };

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
    if (profileLoading || !profile) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      );
    }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-68 bg-white/80 py-5 rounded-lg ml-4 mt-60 h-[50%] backdrop-blur-xl border-r border-gray-200 p-6">
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
              {
                id: "ai-features",
                icon: PieChart,
                label: "Plagiarism Checker ",
              },
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
                <h3 className="font-semibold text-gray-800">Subjects</h3>
                <Clock size={20} className="text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {profile?.subjects?.length}
              </p>
              <p className="text-sm text-gray-500 mt-1">Total Subjects</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">
                  Pending Assignments
                </h3>
                <CheckCircle size={20} className="text-orange-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {pendingAssignmentsCount}
              </p>
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
            {activeTab === "overview" && <TeacherOverview profile={profile} />}
            {activeTab === "assignments" && (
              <AssignmentManagement
                assignments={assignments}
                setAssignments={setAssignments}
                fetchAssignments
                fetchSubmissions
                submissions={submissions}
                setSubmissions={setSubmissions}
                pendingAssignmentsCount={pendingAssignmentsCount}
                setPendingAssignmentsCount={setPendingAssignmentsCount}
              />
            )}
            {activeTab === "attendance" && <AttendanceTracking students={students} setStudents={setStudents} profile={profile}/>}
            {activeTab === "students" && <StudentManagement students={students} setStudents={setStudents}/>}
            {activeTab === "ai-features" && <PlagiarismChecker />}
          </div>
        </div>
      </div>
    </div>
  );
};

// Placeholder components - to be implemented separately
const TeacherOverview = ({ profile }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">My Subjects</h2>
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Subject Name
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {profile?.subjects?.map((subject) => (
            <tr key={subject.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text- font-medium text-gray-900">
                {subject}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const AssignmentManagement = ({
  pendingAssignmentsCount,
  setPendingAssignmentsCount,
  submissions,
  setSubmissions,
  assignments,
  setAssignments,
  fetchAssignments,
}) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">Assignment Management</h2>
    <AssignmentManagementComp
      assignments={assignments}
      setAssignments={setAssignments}
      fetchAssignments
      submissions={submissions}
      setSubmissions={setSubmissions}
      pendingAssignmentsCount={pendingAssignmentsCount}
      setPendingAssignmentsCount={setPendingAssignmentsCount}
    />
  </div>
);

const AttendanceTracking = ({students,setStudents, teacher,profile }) => {
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );


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
        lookup[`${record.studentId}_${record.subject}_${record.date}`] =
          record.status;
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
    // Handle marking all students for a subject
    const handleMarkAllAttendance = async (subject, status) => {
      try {
        await Promise.all(
          students.map((student) =>
            axios.post(
              "http://localhost:5002/api/attendance/mark",
              {
                studentId: student._id,
                subject,
                date: selectedDate,
                status,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            )
          )
        );
        fetchAttendanceRecords(); // Refresh after marking all
      } catch (err) {
        console.error("Error marking all attendance:", err);
      }
    };
  // Subjects assigned to this teacher
  // const subjects = profile?.subjects || ["Java", "System Deisgn"];
  // console.log("Teacher subjects:", subjects);
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
        <table className="w-full  min-w-[800px] table-fixed">
          <thead className="bg-gray-50">
            <tr>
            <th className="w-[20%] px-4 py-3 text-left text-sm font-semibold">Subject</th>
              <th className="w-[20%] px-4 py-3 text-left text-sm font-semibold">Student Name</th>
              <th className="w-[15%] px-4 py-3 text-left text-sm font-semibold">Date</th>
              <th className="w-[15%] px-4 py-3 text-left text-sm font-semibold">Status</th>
              <th className="w-[30%] px-4 py-3 text-left text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {profile?.subjects?.map((subject) => (
              <React.Fragment key={subject}>
                  <tr className="bg-gray-100 border-t border-gray-200">
                  <td className="px-4 py-3 font-semibold">{subject}</td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1.5 text-sm rounded bg-green-500 text-white hover:bg-green-600 transition-colors whitespace-nowrap"
                        onClick={() => handleMarkAllAttendance(subject, "Present")}
                      >
                        Mark All Present
                      </button>
                      <button
                        className="px-3 py-1.5 text-sm rounded bg-red-500 text-white hover:bg-red-600 transition-colors whitespace-nowrap"
                        onClick={() => handleMarkAllAttendance(subject, "Absent")}
                      >
                        Mark All Absent
                      </button>
                    </div>
                  </td>
                </tr>
                {students.map((student) => {
                  const key = `${student._id}_${subject}_${selectedDate}`;
                  return (
                    <tr key={key} className="hover:bg-gray-50 border-t border-gray-100">
                      <td className="px-4 py-3"></td>
                      <td className="px-4 py-3">{student.name}</td>
                      <td className="px-4 py-3 ">{selectedDate}</td>
                      <td className="px-4 py-3 ">
                        {attendance[key] || (
                          <span className="text-gray-400">Not marked</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            className={`px-3 py-1.5 text-sm rounded transition-colors ${
                              attendance[key] === "Present"
                                ? "bg-green-500 text-white"
                                : "bg-gray-200 hover:bg-gray-300"
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
                            className={`px-3 py-1.5 text-sm rounded transition-colors ${
                              attendance[key] === "Absent"
                                ? "bg-red-500 text-white"
                                : "bg-gray-200 hover:bg-gray-300"
                            }`}
                            onClick={() =>
                              handleMarkAttendance(student._id, subject, "Absent")
                            }
                          >
                            Absent
                          </button>
                        </div>
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

const StudentManagement = ({students,setStudents}) => {
  console.log("Students in StudentManagement:", students);
  return(
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">Student Management</h2>
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Students Name
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {students?.map((student) => {
            const key = `${student._id}`;
            return(
            <tr key={key} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text- font-medium text-gray-900">
                {student.name}
              </td>
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
  );
};

const PlagiarismCheckerContent = () => (
  <div className="space-y-6">
    <PlagiarismChecker />
  </div>
);
export default TeacherDashboard;
