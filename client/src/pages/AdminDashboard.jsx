import React, { useState,useEffect } from "react";
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
  Download
} from "lucide-react";
import axios from "axios";
// import { s } from "framer-motion/dist/types.d-CQt5spQA";
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Total Students</h3>
                <Users size={20} className="text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">1,247</p>
              <p className="text-sm text-gray-500 mt-1">+23 this month</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Active Teachers</h3>
                <GraduationCap size={20} className="text-green-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">84</p>
              <p className="text-sm text-gray-500 mt-1">Full-time faculty</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Active Courses</h3>
                <BookOpen size={20} className="text-purple-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">156</p>
              <p className="text-sm text-gray-500 mt-1">This semester</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">System Alerts</h3>
                <AlertCircle size={20} className="text-red-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">3</p>
              <p className="text-sm text-gray-500 mt-1">Require attention</p>
            </div>
          </div>

          {/* Dynamic Content Area */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 min-h-[500px]">
            {activeTab === "overview" && <AdminOverview />}
            {activeTab === "notices" && <NoticeManagement />}
            {activeTab === "students" && <StudentManagement />}
            {activeTab === "teachers" && <TeacherManagement />}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminOverview = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-800">System Overview</h2>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Recent Activities</h3>
        <div className="space-y-3">
          {[
            { action: "New student registration", time: "2 minutes ago", type: "info" },
            { action: "Teacher submitted grades", time: "15 minutes ago", type: "success" },
            { action: "System backup completed", time: "1 hour ago", type: "info" },
            { action: "Payment reminder sent", time: "2 hours ago", type: "warning" },
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'success' ? 'bg-green-500' :
                activity.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
              }`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <button className="p-4 rounded-xl border-2 border-dashed border-blue-300 text-blue-600 hover:bg-blue-50 transition-all flex flex-col items-center gap-2">
            <Users size={24} />
            <span className="text-sm font-medium">Add Student</span>
          </button>
          <button className="p-4 rounded-xl border-2 border-dashed border-green-300 text-green-600 hover:bg-green-50 transition-all flex flex-col items-center gap-2">
            <Bell size={24} />
            <span className="text-sm font-medium">New Notice</span>
          </button>
          <button className="p-4 rounded-xl border-2 border-dashed border-purple-300 text-purple-600 hover:bg-purple-50 transition-all flex flex-col items-center gap-2">
            <TrendingUp size={24} />
            <span className="text-sm font-medium">Generate Report</span>
          </button>
          <button className="p-4 rounded-xl border-2 border-dashed border-gray-300 text-gray-600 hover:bg-gray-50 transition-all flex flex-col items-center gap-2">
            <Settings size={24} />
            <span className="text-sm font-medium">System Settings</span>
          </button>
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
      if(selectedFile){
        formData.append("file", selectedFile); // This is the key part!
      }

      const res = await axios.post("http://localhost:5002/api/notices", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      });

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
              <label htmlFor="pinned" className="text-gray-700">Pin this notice</label>
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
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
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
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      notice.type === "Important" ? "bg-red-100 text-red-700" : "bg-purple-100 text-purple-700"
                    }`}>
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
                      {notice.fileSize && ` (${(notice.fileSize / 1024).toFixed(1)} KB)`}
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
                <span>Published: {new Date(notice.date).toLocaleDateString()}</span>
                <span>{notice.views || 0} views</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const StudentManagement = () => {
  const [students] = useState([
    { id: 1, name: "John Smith", email: "john.smith@college.edu", course: "Computer Science", year: "3rd", status: "Active" },
    { id: 2, name: "Emily Johnson", email: "emily.j@college.edu", course: "Business Admin", year: "2nd", status: "Active" },
    { id: 3, name: "Michael Brown", email: "m.brown@college.edu", course: "Engineering", year: "4th", status: "Inactive" },
    { id: 4, name: "Sarah Davis", email: "sarah.d@college.edu", course: "Psychology", year: "1st", status: "Active" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Student Management</h2>
        <div className="flex gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors">
            <Plus size={16} />
            Add Student
          </button>
        </div>
      </div>

      <div className="bg-white/60 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Student</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Course</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Year</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-800">{student.name}</p>
                    <p className="text-sm text-gray-500">{student.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-700">{student.course}</td>
                <td className="px-6 py-4 text-gray-700">{student.year}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    student.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {student.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="p-1 text-gray-500 hover:text-blue-500">
                      <Eye size={16} />
                    </button>
                    <button className="p-1 text-gray-500 hover:text-green-500">
                      <Edit size={16} />
                    </button>
                    <button className="p-1 text-gray-500 hover:text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TeacherManagement = () => {
  const [teachers] = useState([
    { id: 1, name: "Dr. Robert Wilson", email: "r.wilson@college.edu", department: "Computer Science", courses: 3, status: "Active" },
    { id: 2, name: "Prof. Lisa Anderson", email: "l.anderson@college.edu", department: "Mathematics", courses: 4, status: "Active" },
    { id: 3, name: "Dr. James Miller", email: "j.miller@college.edu", department: "Physics", courses: 2, status: "On Leave" },
    { id: 4, name: "Prof. Maria Garcia", email: "m.garcia@college.edu", department: "Chemistry", courses: 3, status: "Active" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Teacher Management</h2>
        <div className="flex gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search teachers..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors">
            <Plus size={16} />
            Add Teacher
          </button>
        </div>
      </div>

      <div className="bg-white/60 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Teacher</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Department</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Courses</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {teachers.map((teacher) => (
              <tr key={teacher.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-800">{teacher.name}</p>
                    <p className="text-sm text-gray-500">{teacher.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-700">{teacher.department}</td>
                <td className="px-6 py-4 text-gray-700">{teacher.courses} courses</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    teacher.status === 'Active' ? 'bg-green-100 text-green-700' : 
                    teacher.status === 'On Leave' ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {teacher.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="p-1 text-gray-500 hover:text-blue-500">
                      <Eye size={16} />
                    </button>
                    <button className="p-1 text-gray-500 hover:text-green-500">
                      <Edit size={16} />
                    </button>
                    <button className="p-1 text-gray-500 hover:text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/60 p-6 rounded-xl">
          <h3 className="font-semibold text-gray-800 mb-3">Department Distribution</h3>
          <div className="space-y-2">
            {[
              { dept: "Computer Science", count: 12 },
              { dept: "Mathematics", count: 8 },
              { dept: "Physics", count: 6 },
              { dept: "Chemistry", count: 7 },
            ].map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{item.dept}</span>
                <span className="font-semibold text-gray-800">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/60 p-6 rounded-xl">
          <h3 className="font-semibold text-gray-800 mb-3">Performance Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg. Student Rating</span>
              <span className="font-semibold text-green-600">4.7/5</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Course Completion</span>
              <span className="font-semibold text-blue-600">94%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Attendance Rate</span>
              <span className="font-semibold text-purple-600">91%</span>
            </div>
          </div>
        </div>

        <div className="bg-white/60 p-6 rounded-xl">
          <h3 className="font-semibold text-gray-800 mb-3">Recent Activities</h3>
          <div className="space-y-2">
            {[
              "Dr. Wilson uploaded new course material",
              "Prof. Anderson submitted final grades",
              "Dr. Miller requested leave approval",
            ].map((activity, index) => (
              <p key={index} className="text-sm text-gray-600">{activity}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;