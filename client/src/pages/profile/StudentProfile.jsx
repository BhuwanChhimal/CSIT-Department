import React, {useEffect} from 'react';
import { User, Mail, Phone, MapPin, BookOpen, GraduationCap } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const StudentProfile = () => {
  const { profile, isLoading, error, fetchProfile } = useAuthStore();

  useEffect(() => {
    console.log('Fetching profile...'); // Debug log
    fetchProfile();
  }, []);

  useEffect(() => {
    console.log('Current profile:', profile); // Debug log
  }, [profile]);

  const studentData = {
    ...profile,
    phone: "+977-9876543210",
    address: "Kathmandu, Nepal",
    rollNo: "THA077BCT020",
    semester: 4,
    faculty: "Computer Science",
    batch: "2077",
    gpa: 3.8,
    attendance: "85%"
  };
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl">Loading profile...</div>
    </div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl text-red-500">{error}</div>
    </div>;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-55 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-blue-100 flex items-center justify-center">
              <User size={48} className="text-blue-500" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{studentData.name}</h1>
              <p className="text-lg text-blue-600 font-medium mb-2">{studentData.rollNo}</p>
              <div className="flex flex-wrap gap-4">
                <span className="inline-flex items-center gap-2 text-gray-600">
                  <Mail size={18} />
                  {studentData.email}
                </span>
                <span className="inline-flex items-center gap-2 text-gray-600">
                  <Phone size={18} />
                  {studentData.phone}
                </span>
                <span className="inline-flex items-center gap-2 text-gray-600">
                  <MapPin size={18} />
                  {studentData.address}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Academic Information</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Faculty</span>
                <span className="font-medium">{studentData.faculty}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Semester</span>
                <span className="font-medium">{studentData.semester}th Semester</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Batch</span>
                <span className="font-medium">{studentData.batch}</span>
              </div>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Performance Overview</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-2xl">
                <GraduationCap size={24} className="text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">Current GPA</p>
                <p className="text-2xl font-bold text-gray-800">{studentData.gpa}</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-2xl">
                <BookOpen size={24} className="text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">Attendance</p>
                <p className="text-2xl font-bold text-gray-800">{studentData.attendance}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {/* Add recent activities here */}
            <p className="text-gray-600">No recent activities to show.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;