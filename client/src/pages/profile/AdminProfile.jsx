import React, { useEffect, useState } from 'react';
import { 
  User, Mail, Phone, MapPin, Users, School, 
  Settings, Activity, Clock, Shield 
} from 'lucide-react';
import useAuthStore from '@/store/authStore';
import axios from 'axios';

const AdminProfile = () => {
  const {profile} = useAuthStore();

  const adminData = {
    name: profile?.name || "Admin User",
    email: profile?.email || "",
    phone: "+977-9876543210",
    address: "Kathmandu, Nepal",
    role: profile?.role || "System Administrator",
    department: "IT Administration",
    joinDate: "2015",
    lastActive: "2 hours ago"
  };

  const recentActivities = [
    { id: 1, action: "Updated system settings", time: "2 hours ago" },
    { id: 2, action: "Added new faculty member", time: "5 hours ago" },
    { id: 3, action: "Generated semester report", time: "1 day ago" },
    { id: 4, action: "System maintenance", time: "2 days ago" }
  ];

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-55 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-blue-100 flex items-center justify-center">
              <Shield size={48} className="text-blue-500" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{adminData.name}</h1>
              <p className="text-lg text-blue-600 font-medium mb-2">{adminData.role}</p>
              <div className="flex flex-wrap gap-4">
                <span className="inline-flex items-center gap-2 text-gray-600">
                  <Mail size={18} />
                  {adminData.email}
                </span>
                <span className="inline-flex items-center gap-2 text-gray-600">
                  <Phone size={18} />
                  {adminData.phone}
                </span>
                <span className="inline-flex items-center gap-2 text-gray-600">
                  <MapPin size={18} />
                  {adminData.address}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* System Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-2xl">
                <Users size={24} className="text-blue-500" />
              </div>
              <div>
                <p className="text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-800">{approvedStudents.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-2xl">
                <School size={24} className="text-blue-500" />
              </div>
              <div>
                <p className="text-gray-600">Total Teachers</p>
                <p className="text-2xl font-bold text-gray-800">{approvedTeachers.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-2xl">
                <Settings size={24} className="text-blue-500" />
              </div>
              <div>
                <p className="text-gray-600">Active Courses</p>
                <p className="text-2xl font-bold text-gray-800">{SUBJECT_LIST.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Recent Activities */}
        <div className="grid grid-cols-1 gap-6">
  
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Activities</h2>
            <div className="space-y-4">
              {recentActivities.map(activity => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Clock size={18} className="text-blue-500" />
                    <p className="font-medium text-gray-800">{activity.action}</p>
                  </div>
                  <span className="text-sm text-gray-600">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">System Health</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-green-50 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-600 font-medium">System Status</span>
                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">
                  Operational
                </span>
              </div>
              <p className="text-sm text-gray-600">All systems running smoothly</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-600 font-medium">Last Backup</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                  6 hours ago
                </span>
              </div>
              <p className="text-sm text-gray-600">Auto backup enabled</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;