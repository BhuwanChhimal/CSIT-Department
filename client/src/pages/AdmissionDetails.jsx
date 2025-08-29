import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Calendar, Clock, FileText, Users, Award, BookOpen, MapPin, Phone, Mail, ExternalLink, Monitor } from 'lucide-react';

const AdmissionDetails = () => {

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
  }, []);

  const [expandedCourse, setExpandedCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('requirements');

  const courseInfo = {
    id: 'bsc-csit',
    title: 'B.Sc.CSIT',
    fullName: 'Bachelor of Science in Computer Science and Information Technology',
    duration: '4 Years (8 Semesters)',
    seats: 80,
    fee: 'NPR 4,00,000',
    eligibility: '+2 Science with Mathematics (Min. 60%)',
    subjects: ['Programming Fundamentals', 'Data Structures & Algorithms', 'Database Management', 'Computer Networks', 'Software Engineering', 'Web Technology', 'Object Oriented Programming', 'Operating Systems'],
    career: ['Software Engineer', 'Web Developer', 'System Analyst', 'Database Administrator', 'Mobile App Developer', 'IT Consultant', 'Network Administrator', 'Quality Assurance Engineer'],
    specializations: ['Software Development', 'Web Technologies', 'Database Systems', 'Network Administration']
  };

  const importantDates = [
    { date: 'June 15, 2025', event: 'Application Opens' },
    { date: 'July 20, 2025', event: 'Application Deadline' },
    { date: 'August 5, 2025', event: 'CSIT Entrance Exam' },
    { date: 'August 15, 2025', event: 'Results Published' },
    { date: 'August 25, 2025', event: 'Counseling & Admission' },
    { date: 'September 5, 2025', event: 'Classes Begin' }
  ];

  const toggleCourse = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  return (
    <div className="min-h-screen pt-55">
      {/* Header */}
      <div className="bg-white shadow-sm border-b bg-gradient-to-r from-blue-900  to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6 ">
          <div className="flex items-center space-x-4 ">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Monitor className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">CSIT Department</h1>
              <p className="">Amrit Science Campus - Tribhuvan University</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">B.Sc. CSIT Admission 2025</h2>
          <p className="text-gray-600">Complete information about admission for Bachelor of Science in Computer Science and Information Technology</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'requirements', label: 'Requirements', icon: FileText },
                    { id: 'course', label: 'Course Details', icon: BookOpen },
                    { id: 'process', label: 'Application Process', icon: Users }
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                        activeTab === id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'requirements' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">General Requirements</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-2">B.Sc. CSIT Program</h4>
                          <ul className=" text-blue-800 space-y-1">
                            <li>• Completed +2 Science with Mathematics</li>
                            <li>• Minimum 60% aggregate marks</li>
                            <li>• Physics, Chemistry, and Mathematics mandatory</li>
                            <li>• CSIT entrance examination</li>
                          </ul>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-medium text-green-900 mb-2">Additional Requirements</h4>
                          <ul className=" text-green-800 space-y-1">
                            <li>• No back papers in +2</li>
                            <li>• Valid citizenship certificate</li>
                            <li>• Character certificate from previous institution</li>
                            <li>• Medical fitness certificate</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Documents</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid md:grid-cols-2 gap-4">
                          <ul className=" text-gray-700 space-y-2">
                            <li>• Academic transcripts (original + copies)</li>
                            <li>• Character certificate</li>
                            <li>• Citizenship certificate</li>
                            <li>• Passport size photographs (6 copies)</li>
                          </ul>
                          <ul className=" text-gray-700 space-y-2">
                            <li>• Migration certificate (if applicable)</li>
                            <li>• Entrance exam admit card</li>
                            <li>• Medical certificate</li>
                            <li>• Fee payment receipt</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'course' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">B.Sc. CSIT Program Details</h3>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">{courseInfo.title}</h4>
                          <p className="text-gray-600 mt-1">{courseInfo.fullName}</p>
                        </div>
                        <div className="text-right">
                          <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {courseInfo.seats} Seats Available
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium text-gray-900 mb-3">Program Information</h5>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Duration:</span>
                              <span className="font-medium">{courseInfo.duration}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Total Fee:</span>
                              <span className="font-medium text-green-600">{courseInfo.fee}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Eligibility:</span>
                              <span className="font-medium text-right">{courseInfo.eligibility}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-gray-900 mb-3">Core Subjects</h5>
                          <div className="flex flex-wrap gap-2">
                            {courseInfo.subjects.map((subject, index) => (
                              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                {subject}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                          <Award className="w-4 h-4 mr-2 text-green-600" />
                          Career Opportunities
                        </h5>
                        <div className="space-y-2">
                          {courseInfo.career.map((career, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-gray-700">{career}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                          <BookOpen className="w-4 h-4 mr-2 text-purple-600" />
                          Specialization Areas
                        </h5>
                        <div className="space-y-2">
                          {courseInfo.specializations.map((spec, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              <span className="text-sm text-gray-700">{spec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                      <h5 className="font-medium text-yellow-800 mb-3">Why Choose B.Sc. CSIT?</h5>
                      <div className="grid md:grid-cols-2 gap-4">
                        <ul className="text-sm text-yellow-700 space-y-2">
                          <li>• Industry-relevant curriculum</li>
                          <li>• Hands-on practical experience</li>
                          <li>• Strong programming foundation</li>
                          <li>• Project-based learning</li>
                        </ul>
                        <ul className="text-sm text-yellow-700 space-y-2">
                          <li>• Industry partnerships</li>
                          <li>• Internship opportunities</li>
                          <li>• High placement rates</li>
                          <li>• Research opportunities</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'process' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Process</h3>
                    
                    <div className="space-y-4">
                      {[
                        { step: 1, title: 'Online Registration', desc: 'Create account and fill application form online' },
                        { step: 2, title: 'Document Upload', desc: 'Upload all required documents in PDF format' },
                        { step: 3, title: 'Fee Payment', desc: 'Pay application fee through online banking or bank deposit' },
                        { step: 4, title: 'Entrance Exam', desc: 'Appear for entrance examination on scheduled date' },
                        { step: 5, title: 'Merit List', desc: 'Check merit list and counseling schedule' },
                        { step: 6, title: 'Admission Confirmation', desc: 'Complete admission by paying fees and submitting documents' }
                      ].map((item) => (
                        <div key={item.step} className="flex items-start space-x-4 p-4 bg-white border border-gray-200 rounded-lg">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                            {item.step}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{item.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-medium text-yellow-800 mb-2">Important Notes</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Application fee is non-refundable</li>
                        <li>• All documents must be attested by relevant authorities</li>
                        <li>• Incomplete applications will be rejected</li>
                        <li>• Admission is subject to verification of documents</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Important Dates */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Important Dates
              </h3>
              <div className="space-y-3">
                {importantDates.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-sm text-gray-600">{item.event}</span>
                    <span className="text-sm font-medium text-gray-900">{item.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">4</div>
                  <div className="text-sm text-blue-800">Years Program</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">80</div>
                  <div className="text-sm text-green-800">Total Seats</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">95%</div>
                  <div className="text-sm text-purple-800">Placement Rate</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">8</div>
                  <div className="text-sm text-orange-800">Semesters</div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">CSIT Department Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Lainchaur, Kathmandu, Nepal</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">+977-1-4411764 (Ext: 205)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">csit@amritcampus.edu.np</span>
                </div>
              </div>
              
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors mt-4 flex items-center justify-center space-x-2">
                <ExternalLink className="w-4 h-4" />
                <span>Apply for B.Sc. CSIT</span>
              </button>
            </div>

            {/* Scholarship Info */}
            <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-6 text-white">
              <div className="flex items-center mb-3">
                <Award className="w-5 h-5 mr-2" />
                <h3 className="font-semibold">CSIT Scholarships</h3>
              </div>
              <p className="text-sm opacity-90 mb-3">Merit-based scholarships up to 50% fee waiver for outstanding CSIT students with excellent programming skills.</p>
              <button className="bg-white text-blue-600 px-4 py-2 rounded text-sm font-medium hover:bg-gray-100 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdmissionDetails;