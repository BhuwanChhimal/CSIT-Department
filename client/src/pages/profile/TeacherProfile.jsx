import React, { useEffect } from 'react';
import { User, Mail, Phone, MapPin, BookOpen, Clock, GraduationCap, Book, Calendar } from 'lucide-react';
import useAuthStore from '@/store/authStore';

const TeacherProfile = () => {
  const { profile, isLoading, error, fetchProfile } = useAuthStore();
  const currentCourses = [
    { id: 1, name: "Data Structures", code: "CS201", semester: 4 },
    { id: 2, name: "Operating Systems", code: "CS301", semester: 6 },
    { id: 3, name: "Database Management", code: "CS302", semester: 6 },
  ];
  
  useEffect(() => {
    console.log('Fetching profile...'); // Debug log
    fetchProfile();
  }, []);

  useEffect(() => {
    console.log('Current profile:',profile); // Debug log
  }, [profile]);
  const teacherData = {
    ...profile,
    phone: "+977-9876543210",
    address: "Kathmandu, Nepal",
    faculty: "Computer Science",
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
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{teacherData.name}</h1>
              <p className="text-lg text-blue-600 font-medium mb-2">{teacherData.designation}</p>
              <p className="text-gray-600 mb-4">{teacherData.department}</p>
              <div className="flex flex-wrap gap-4">
                <span className="inline-flex items-center gap-2 text-gray-600">
                  <Mail size={18} />
                  {teacherData.email}
                </span>
                <span className="inline-flex items-center gap-2 text-gray-600">
                  <Phone size={18} />
                  {teacherData.phone}
                </span>
                <span className="inline-flex items-center gap-2 text-gray-600">
                  <MapPin size={18} />
                  {teacherData.address}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-2xl">
                <BookOpen size={24} className="text-blue-500" />
              </div>
              <div>
                <p className="text-gray-600">Current Courses</p>
                <p className="text-2xl font-bold text-gray-800">{currentCourses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-2xl">
                <Book size={24} className="text-blue-500" />
              </div>
              <div>
                <p className="text-gray-600">Publications</p>
                <p className="text-2xl font-bold text-gray-800">{teacherData.publications}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-2xl">
                <Clock size={24} className="text-blue-500" />
              </div>
              <div>
                <p className="text-gray-600">Office Hours</p>
                <p className="text-lg font-medium text-gray-800">{teacherData.officeHours}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Courses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Current Courses</h2>
            <div className="space-y-4">
              {currentCourses.map(course => (
                <div key={course.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl">
                  <div>
                    <p className="font-medium text-gray-800">{course.name}</p>
                    <p className="text-sm text-gray-600">{course.code}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                    {course.semester}th Semester
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Details */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Academic Details</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Department</span>
                <span className="font-medium">{teacherData.department}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Expertise</span>
                <span className="font-medium">{teacherData.expertise}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Joining Date</span>
                <span className="font-medium">{teacherData.joiningDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Teaching Schedule</h2>
          <div className="flex items-center justify-center h-48">
            <Calendar size={24} className="text-gray-400 mr-2" />
            <span className="text-gray-500">Schedule will be updated soon</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;