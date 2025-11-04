import React, { useState, useEffect } from "react";
import {
  Shield,
  Users,
  GraduationCap,
  Bell,
  TrendingUp,
  UserCheck,
  BookOpen,
  AlertCircle,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Settings,
  Download,
  X,
} from "lucide-react";
import axios from "axios";
// import toast from "react-hot-toast";
// import { s } from "framer-motion/dist/types.d-CQt5spQA";
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [approvedStudents, setApprovedStudents] = useState([]);
  const [approvedTeachers, setApprovedTeachers] = useState([]);
  const [subjects, setSubjects] = useState("");
  const SUBJECT_LIST = Object.values(subjects).flat().map(subject => subject.name);
  console.log(SUBJECT_LIST);
  const fetchApprovedTeachers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5002/api/admin/teachers",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setApprovedTeachers(response.data.filter((t) => t.isApproved));
    } catch (error) {
      console.error("Error fetching approved teachers:", error);
    }
  };

  const fetchApprovedStudents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5002/api/admin/students",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // Only approved students
      setApprovedStudents(response.data.filter((s) => s.isApproved));
    } catch (error) {
      console.error("Error fetching approved students:", error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5002/api/subjects/all",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSubjects(response.data.data);
      // console.log(response.data.data)
      // Assuming response.data is an array of subject names
      // setSubjectList(response.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  }
  useEffect(() => {
    fetchApprovedTeachers();
    fetchApprovedStudents();
    fetchSubjects();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white/80 py-5 rounded-lg ml-4 mt-60 h-[50%] backdrop-blur-xl border-r border-gray-200 p-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Admin Portal</h2>
            <p className="text-md text-gray-500">Management Dashboard</p>
          </div>
          <nav className="space-y-4 text-lg">
            {[
              { id: "overview", icon: Shield, label: "Overview" },
              { id: "notices", icon: Bell, label: "Notices" },
              { id: "students", icon: Users, label: "Students" },
              { id: "teachers", icon: GraduationCap, label: "Teachers" },
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
                <h3 className="font-semibold text-gray-800">Total Students</h3>
                <Users size={20} className="text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{approvedStudents.length}</p>
              <p className="text-sm text-gray-500 mt-1">Total Students</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Active Teachers</h3>
                <GraduationCap size={20} className="text-green-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{approvedTeachers.length}</p>
              <p className="text-sm text-gray-500 mt-1">Full-time faculty</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Active Courses</h3>
                <BookOpen size={20} className="text-purple-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{SUBJECT_LIST.length}</p>
              <p className="text-sm text-gray-500 mt-1">Total Subjects</p>
            </div>

            {/* <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">System Alerts</h3>
                <AlertCircle size={20} className="text-red-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">3</p>
              <p className="text-sm text-gray-500 mt-1">Require attention</p>
            </div> */}
          </div>

          {/* Dynamic Content Area */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 min-h-[500px]">
            {activeTab === "overview" && <AdminOverview setActiveTab={setActiveTab}/>}
            {activeTab === "notices" && <NoticeManagement />}
            {activeTab === "students" && <StudentManagement approvedStudents={approvedStudents}  setApprovedStudents={setApprovedStudents} fetchApprovedStudents/>}
            {activeTab === "teachers" && <TeacherManagement SUBJECT_LIST={SUBJECT_LIST} approvedTeachers={approvedTeachers} setApprovedTeachers={setApprovedTeachers} subjects={subjects} setSubjects={setSubjects} fetchSubjects fetchApprovedTeachers/>}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminOverview = ({setActiveTab}) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-800">System Overview</h2>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">
          Recent Activities
        </h3>
        <div className="space-y-3">
          {[
            {
              action: "New student registration",
              time: "2 minutes ago",
              type: "info",
            },
            {
              action: "Teacher submitted grades",
              time: "15 minutes ago",
              type: "success",
            },
            {
              action: "System backup completed",
              time: "1 hour ago",
              type: "info",
            },
            {
              action: "Payment reminder sent",
              time: "2 hours ago",
              type: "warning",
            },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  activity.type === "success"
                    ? "bg-green-500"
                    : activity.type === "warning"
                    ? "bg-orange-500"
                    : "bg-blue-500"
                }`}
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  {activity.action}
                </p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Quick Actions</h3>
        <div className="flex flex-wrap gap-4 flex-col">
          <button 
          onClick={() => setActiveTab("students")}
          className="p-4 rounded-xl border-2 border-dashed border-blue-300 text-blue-600 hover:bg-blue-50 transition-all flex flex-col items-center gap-2">
            <Users size={24} />
            <span 
            className="text-sm font-medium">Add Student</span>
          </button>
          <button onClick={() => setActiveTab("notices")} className="p-4 rounded-xl border-2 border-dashed border-green-300 text-green-600 hover:bg-green-50 transition-all flex flex-col items-center gap-2">
            <Bell size={24} />
            <span className="text-sm font-medium">New Notice</span>
          </button>
          <button onClick={()=> setActiveTab("teachers")} className="p-4 rounded-xl border-2 border-dashed border-purple-300 text-purple-600 hover:bg-purple-50 transition-all flex flex-col items-center gap-2">
            <TrendingUp size={24} />
            <span className="text-sm font-medium">Manage Teachers</span>
          </button>
          {/* <button className="p-4 rounded-xl border-2 border-dashed border-gray-300 text-gray-600 hover:bg-gray-50 transition-all flex flex-col items-center gap-2">
            <Settings size={24} />
            <span className="text-sm font-medium">System Settings</span>
          </button> */}
        </div>
      </div>
    </div>
  </div>
);

const NoticeManagement = () => {
  const [notices, setNotices] = useState([]);
  const [showAddNotice, setShowAddNotice] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newNotice, setNewNotice] = useState({
    title: "",
    description: "",
    category: "General",
    type: "Notice",
    pinned: false,
    readMoreLink: "",
  });

  // ✅ Fetch all notices on mount
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await axios.get("http://localhost:5002/api/notices");
        setNotices(res.data || []);
      } catch (err) {
        console.error("Error fetching notices:", err);
      }
    };
    fetchNotices();
  }, []);

  // ✅ Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  // ✅ Add notice with proper FormData handling
  const handleAddNotice = async () => {
    if (!newNotice.title || !newNotice.description) {
      alert("Title and description are required!");
      return;
    }

    // if (!selectedFile) {
    //   alert("Please select a file to upload!");
    //   return;
    // }

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("title", newNotice.title);
      formData.append("description", newNotice.description);
      formData.append("category", newNotice.category);
      formData.append("type", newNotice.type);
      formData.append("pinned", newNotice.pinned);
      formData.append("readMoreLink", newNotice.readMoreLink);
      if (selectedFile) {
        formData.append("file", selectedFile); // This is the key part!
      }

      const res = await axios.post(
        "http://localhost:5002/api/notices",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data", // Important for file uploads
          },
        }
      );

      setNotices([res.data.notice, ...notices]);
      setNewNotice({
        title: "",
        description: "",
        category: "General",
        type: "Notice",
        pinned: false,
        readMoreLink: "",
      });
      setSelectedFile(null);
      setShowAddNotice(false);
    } catch (err) {
      console.error("Error adding notice:", err.response?.data || err.message);
      alert("Error creating notice. Please try again.");
    }
  };

  // ✅ Delete notice
  const handleDeleteNotice = async (id) => {
    if (!confirm("Are you sure you want to delete this notice?")) return;

    try {
      await axios.delete(`http://localhost:5002/api/notices/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setNotices(notices.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Error deleting notice:", err);
      alert("Error deleting notice. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Notice Management</h2>
        <button
          onClick={() => setShowAddNotice(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors"
        >
          <Plus size={16} />
          Add Notice
        </button>
      </div>

      {/* Add Notice Form */}
      {showAddNotice && (
        <div className="bg-gray-50 p-6 rounded-xl border-2 border-dashed border-gray-300">
          <h3 className="text-lg font-semibold mb-4">Create New Notice</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Notice Title"
              value={newNotice.title}
              onChange={(e) =>
                setNewNotice({ ...newNotice, title: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <textarea
              placeholder="Notice Description"
              value={newNotice.description}
              onChange={(e) =>
                setNewNotice({ ...newNotice, description: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="pinned"
                checked={newNotice.pinned}
                onChange={(e) =>
                  setNewNotice({ ...newNotice, pinned: e.target.checked })
                }
                className="w-4 h-4"
              />
              <label htmlFor="pinned" className="text-gray-700">
                Pin this notice
              </label>
            </div>

            {/* Fixed file input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload File
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
              />
              {selectedFile && (
                <p className="text-sm text-gray-600 mt-1">
                  Selected: {selectedFile.name} (
                  {(selectedFile.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>

            <input
              type="url"
              placeholder="Read More Link (optional)"
              value={newNotice.readMoreLink}
              onChange={(e) =>
                setNewNotice({ ...newNotice, readMoreLink: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <select
              value={newNotice.category}
              onChange={(e) =>
                setNewNotice({ ...newNotice, category: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="General">General</option>
              <option value="Examinations">Examinations</option>
              <option value="Academic">Academic</option>
              <option value="Research">Research</option>
              <option value="Events">Events</option>
            </select>

            <select
              value={newNotice.type}
              onChange={(e) =>
                setNewNotice({ ...newNotice, type: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Notice">Notice</option>
              <option value="Important">Important</option>
              <option value="Event">Event</option>
            </select>

            <div className="flex gap-3">
              <button
                onClick={handleAddNotice}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Create Notice
              </button>
              <button
                onClick={() => {
                  setShowAddNotice(false);
                  setSelectedFile(null);
                  setNewNotice({
                    title: "",
                    description: "",
                    category: "General",
                    type: "Notice",
                    pinned: false,
                    readMoreLink: "",
                  });
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notice List */}
      <div className="space-y-4">
        {notices.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No notices found.</p>
        ) : (
          notices.map((notice) => (
            <div
              key={notice._id}
              className="border border-gray-200 rounded-xl p-6 bg-white/60"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {notice.title}
                  </h3>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {notice.category}
                  </span>
                  {notice.type && notice.type !== "Notice" && (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        notice.type === "Important"
                          ? "bg-red-100 text-red-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {notice.type}
                    </span>
                  )}
                  {notice.pinned && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      PINNED
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg">
                    <Eye size={16} />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-green-500 hover:bg-green-50 rounded-lg">
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteNotice(notice._id)}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mb-3">{notice.description}</p>

              {/* File info with download button */}
              {notice.fileName && notice.fileUrl && (
                <div className="mb-3 p-3 bg-gray-100 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      📎 Attachment: {notice.fileName}
                      {notice.fileSize &&
                        ` (${(notice.fileSize / 1024).toFixed(1)} KB)`}
                    </p>
                  </div>
                  <a
                    href={`http://localhost:5002/${notice.fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                  >
                    <Download size={14} />
                    Download
                  </a>
                </div>
              )}

              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>
                  Published: {new Date(notice.date).toLocaleDateString()}
                </span>
                <span>{notice.views || 0} views</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const StudentManagement = ({approvedStudents,fetchApprovedStudents}) => {
  const [pendingStudents, setPendingStudents] = useState([]);

  useEffect(() => {
    fetchPendingStudents();
  }, []);

  const fetchPendingStudents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5002/api/admin/pending-users?role=student",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPendingStudents(response.data);
    } catch (error) {
      console.error("Error fetching pending students:", error);
    }
  };



  const handleApproveStudent = async (userId) => {
    try {
      await axios.put(
        `http://localhost:5002/api/admin/approve-user/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchPendingStudents();
      fetchApprovedStudents();
    } catch (error) {
      console.error("Error approving student:", error);
    }
  };

  return (
    <div className="space-y-10">
      {/* Pending Students */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Pending Students
        </h2>
        <div className="bg-white/60 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pendingStudents.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{student.name}</td>
                  <td className="px-6 py-4">{student.email}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleApproveStudent(student._id)}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
              {pendingStudents.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-gray-500">
                    No pending students
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approved Students */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Approved Students
        </h2>
        <div className="bg-white/60 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Semester
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {approvedStudents.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{student.name}</td>
                  <td className="px-6 py-4">{student.email}</td>
                  <td className="px-6 py-4">
                    {localStorage.getItem(`studentSemester_${student._id}`)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Approved
                    </span>
                  </td>
                </tr>
              ))}
              {approvedStudents.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-gray-500">
                    No approved students
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const TeacherManagement = ({approvedTeachers,fetchApprovedTeachers,SUBJECT_LIST}) => {
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [editSubjectsId, setEditSubjectsId] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [showSubjectsModal, setShowSubjectsModal] = useState(false);

 
  useEffect(() => {
    fetchPendingTeachers();
  }, []);

  const fetchPendingTeachers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5002/api/admin/pending-users?role=teacher",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPendingTeachers(response.data);
    } catch (error) {
      console.error("Error fetching pending teachers:", error);
    }
  };



  const handleApproveTeacher = async (userId) => {
    try {
      await axios.put(
        `http://localhost:5002/api/admin/approve-user/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchPendingTeachers();
      fetchApprovedTeachers();
    } catch (error) {
      console.error("Error approving teacher:", error);
    }
  };

  const handleEditSubjects = (teacher) => {
    setEditSubjectsId(teacher._id);
    setSelectedSubjects(teacher.subjects || []);
    setShowSubjectsModal(true);
  };
  const handleCloseSubjectsModal = () => {
    setEditSubjectsId(null);
    setSelectedSubjects([]);
    setShowSubjectsModal(false);
  };
  const handleSubjectToggle = (subject) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };
  // Modal component
  const SubjectsModal = ({ teacher, onClose, onSave }) => {
    // Prevent click propagation inside modal
    const handleModalClick = (e) => e.stopPropagation();

    return (
      <div
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl p-8 w-300 shadow-xl relative"
          onClick={handleModalClick}
        >
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <X size={24} />
          </button>
          <h2 className="text-xl font-bold mb-4">Assign Subjects</h2>
          <div className="grid grid-cols-6 gap-4 mb-6">
            {SUBJECT_LIST.map((subject) => (
              <label key={subject} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedSubjects.includes(subject)}
                  onChange={() => handleSubjectToggle(subject)}
                />
                <span>{subject}</span>
              </label>
            ))}
          </div>
          <button
            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={() => {
              onSave(teacher._id);
              onClose();
            }}
          >
            Save Subjects
          </button>
        </div>
      </div>
    );
  };
  const handleSaveSubjects = async (teacherId) => {
    try {
      await axios.put(
        `http://localhost:5002/api/admin/assign-subjects/${teacherId}`,
        { subjects: selectedSubjects },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setEditSubjectsId(null);
      setSelectedSubjects([]);
      fetchApprovedTeachers();
    } catch (error) {
      console.error("Error assigning subjects:", error);
    }
  };

  return (
    <div className="space-y-10">
      {/* Pending Teachers */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Pending Teachers
        </h2>
        <div className="bg-white/60 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pendingTeachers.map((teacher) => (
                <tr key={teacher._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{teacher.name}</td>
                  <td className="px-6 py-4">{teacher.email}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleApproveTeacher(teacher._id)}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
              {pendingTeachers.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-gray-500">
                    No pending teachers
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approved Teachers */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Approved Teachers
        </h2>
        <div className="bg-white/60 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Subjects
                </th>
                {/* <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Action
                </th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {approvedTeachers.map((teacher) => (
                <tr key={teacher._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{teacher.name}</td>
                  <td className="px-6 py-4">{teacher.email}</td>
                  <td className="px-6 py-4">
                    {editSubjectsId === teacher._id ? (
                      <div className="flex flex-wrap gap-2">
                        {SUBJECT_LIST.map((subject) => (
                          <label
                            key={subject}
                            className="flex items-center gap-1"
                          >
                            <input
                              type="checkbox"
                              checked={selectedSubjects.includes(subject)}
                              onChange={() => handleSubjectToggle(subject)}
                            />
                            <span>{subject}</span>
                          </label>
                        ))}
                      </div>
                    ) : teacher.subjects && teacher.subjects.length > 0 ? (
                      <span>
                        {teacher.subjects.length >3 
                        ? `${teacher.subjects.slice(0,3).join(", ")}...`
                        : teacher.subjects.join(", ")
                        }
                      </span>
                    ) : (
                      <span className="text-gray-400">
                        No subjects assigned
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEditSubjects(teacher)}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                      Assign Subjects
                    </button>
                  </td>
                </tr>
              ))}
              {showSubjectsModal && (
                <SubjectsModal
                  teacher={approvedTeachers.find(
                    (t) => t._id === editSubjectsId
                  )}
                  onClose={handleCloseSubjectsModal}
                  onSave={handleSaveSubjects}
                />
              )}
              {approvedTeachers.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    No approved teachers
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
