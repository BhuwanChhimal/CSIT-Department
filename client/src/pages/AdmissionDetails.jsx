import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Calendar, Clock, FileText, Users, Award, BookOpen, MapPin, Phone, Mail, ExternalLink } from 'lucide-react';

const AdmissionDetails = () => {

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
  }, []);

  const [expandedCourse, setExpandedCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('requirements');

  const courses = [
    {
      id: 'bsc-math',
      title: 'BSc(Mathematics)',
      fullName: 'Bachelor of Science in Mathematics',
      duration: '4 Years',
      seats: 40,
      fee: 'NPR 2,50,000',
      eligibility: '+2 Science with Mathematics (Min. 60%)',
      subjects: ['Calculus', 'Linear Algebra', 'Statistics', 'Differential Equations', 'Real Analysis'],
      career: ['Data Analyst', 'Actuary', 'Research Scientist', 'Teaching', 'Banking & Finance']
    },
    {
      id: 'msc-chemistry',
      title: 'M.Sc. Chemistry',
      fullName: 'Master of Science in Chemistry',
      duration: '2 Years',
      seats: 30,
      fee: 'NPR 3,00,000',
      eligibility: 'BSc Chemistry or related field (Min. 55%)',
      subjects: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Analytical Chemistry', 'Spectroscopy'],
      career: ['Research Scientist', 'Quality Control Analyst', 'Pharmaceutical Industry', 'Environmental Consultant', 'Academia']
    },
    {
      id: 'msc-botany',
      title: 'M.Sc. Botany',
      fullName: 'Master of Science in Botany',
      duration: '2 Years',
      seats: 25,
      fee: 'NPR 2,80,000',
      eligibility: 'BSc Biology/Botany (Min. 55%)',
      subjects: ['Plant Taxonomy', 'Plant Physiology', 'Ecology', 'Genetics', 'Biotechnology'],
      career: ['Botanist', 'Environmental Consultant', 'Research Officer', 'Conservation Biologist', 'Agricultural Scientist']
    },
    {
      id: 'msc-physics',
      title: 'M.Sc. Physics',
      fullName: 'Master of Science in Physics',
      duration: '2 Years',
      seats: 35,
      fee: 'NPR 3,20,000',
      eligibility: 'BSc Physics or related field (Min. 55%)',
      subjects: ['Quantum Mechanics', 'Thermodynamics', 'Electromagnetism', 'Nuclear Physics', 'Solid State Physics'],
      career: ['Research Scientist', 'Physics Teacher', 'Data Scientist', 'Technology Consultant', 'Aerospace Engineer']
    },
    {
      id: 'msc-zoology',
      title: 'M.Sc. Zoology',
      fullName: 'Master of Science in Zoology',
      duration: '2 Years',
      seats: 25,
      fee: 'NPR 2,75,000',
      eligibility: 'BSc Biology/Zoology (Min. 55%)',
      subjects: ['Animal Physiology', 'Ecology & Evolution', 'Genetics', 'Molecular Biology', 'Biodiversity Conservation'],
      career: ['Zoologist', 'Wildlife Biologist', 'Conservation Officer', 'Research Scientist', 'Veterinary Sciences']
    },
    {
      id: 'mit',
      title: 'MIT',
      fullName: 'Master in Information Technology',
      duration: '2 Years',
      seats: 50,
      fee: 'NPR 4,50,000',
      eligibility: 'Bachelor\'s degree in IT/Computer Science (Min. 55%)',
      subjects: ['Advanced Programming', 'Database Systems', 'Network Security', 'AI & Machine Learning', 'Software Engineering'],
      career: ['Software Developer', 'IT Consultant', 'System Administrator', 'Data Scientist', 'Cybersecurity Specialist']
    },
    {
      id: 'bsc-csit',
      title: 'B.Sc.CSIT',
      fullName: 'Bachelor of Science in Computer Science and Information Technology',
      duration: '4 Years',
      seats: 80,
      fee: 'NPR 4,00,000',
      eligibility: '+2 Science with Mathematics (Min. 60%)',
      subjects: ['Programming', 'Data Structures', 'Computer Networks', 'Database Management', 'Software Engineering'],
      career: ['Software Engineer', 'Web Developer', 'System Analyst', 'IT Support', 'Mobile App Developer']
    },
    {
      id: 'bsc-chemistry',
      title: 'BSC(Chemistry)',
      fullName: 'Bachelor of Science in Chemistry',
      duration: '4 Years',
      seats: 45,
      fee: 'NPR 2,80,000',
      eligibility: '+2 Science with Chemistry (Min. 60%)',
      subjects: ['General Chemistry', 'Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Analytical Chemistry'],
      career: ['Chemical Analyst', 'Quality Control Officer', 'Research Assistant', 'Lab Technician', 'Pharmaceutical Industry']
    }
  ];

  const importantDates = [
    { date: 'June 15, 2025', event: 'Application Opens' },
    { date: 'July 20, 2025', event: 'Application Deadline' },
    { date: 'August 5, 2025', event: 'Entrance Exam' },
    { date: 'August 15, 2025', event: 'Results Published' },
    { date: 'August 25, 2025', event: 'Admission Confirmation' },
    { date: 'September 5, 2025', event: 'Classes Begin' }
  ];

  const toggleCourse = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  return (
    <div className="min-h-screen pt-60">
      {/* Header */}
      <div className="bg-white shadow-sm border-b bg-gradient-to-r from-blue-900  to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6 ">
          <div className="flex items-center space-x-4 ">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Amrit Science Campus</h1>
              <p className="">Tribhuvan University</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Admission Details 2025</h2>
          <p className="text-gray-600">Complete information about admissions for all our programs</p>
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
                    { id: 'courses', label: 'Course Details', icon: BookOpen },
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
                          <h4 className="font-medium text-blue-900 mb-2">For Bachelor's Programs</h4>
                          <ul className=" text-blue-800 space-y-1">
                            <li>• Completed +2 or equivalent</li>
                            <li>• Minimum 60% aggregate marks</li>
                            <li>• Relevant subject requirements</li>
                            <li>• Entrance examination</li>
                          </ul>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-medium text-green-900 mb-2">For Master's Programs</h4>
                          <ul className=" text-green-800 space-y-1">
                            <li>• Bachelor's degree in relevant field</li>
                            <li>• Minimum 55% aggregate marks</li>
                            <li>• No back papers</li>
                            <li>• Entrance examination</li>
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

                {activeTab === 'courses' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Courses</h3>
                    {courses.map((course) => (
                      <div key={course.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleCourse(course.id)}
                          className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 flex items-center justify-between"
                        >
                          <div>
                            <h4 className="font-semibold text-gray-900">{course.title}</h4>
                            <p className="text-sm text-gray-600">{course.fullName}</p>
                          </div>
                          {expandedCourse === course.id ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                        
                        {expandedCourse === course.id && (
                          <div className="px-6 pb-6 bg-gray-50">
                            <div className="grid md:grid-cols-2 gap-6 pt-4">
                              <div>
                                <h5 className="font-medium text-gray-900 mb-2">Course Information</h5>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Duration:</span>
                                    <span className="font-medium">{course.duration}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Available Seats:</span>
                                    <span className="font-medium">{course.seats}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Total Fee:</span>
                                    <span className="font-medium">{course.fee}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Eligibility:</span>
                                    <span className="font-medium text-right">{course.eligibility}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <h5 className="font-medium text-gray-900 mb-2">Key Subjects</h5>
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {course.subjects.map((subject, index) => (
                                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                      {subject}
                                    </span>
                                  ))}
                                </div>
                                
                                <h5 className="font-medium text-gray-900 mb-2">Career Opportunities</h5>
                                <div className="flex flex-wrap gap-2">
                                  {course.career.map((career, index) => (
                                    <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                      {career}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
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
                  <div className="text-2xl font-bold text-blue-600">8</div>
                  <div className="text-sm text-blue-800">Programs</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">330</div>
                  <div className="text-sm text-green-800">Total Seats</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">95%</div>
                  <div className="text-sm text-purple-800">Placement Rate</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">25+</div>
                  <div className="text-sm text-orange-800">Years Experience</div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Lainchaur, Kathmandu, Nepal</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">+977-1-4411764</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">info@amritcampus.edu.np</span>
                </div>
              </div>
              
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors mt-4 flex items-center justify-center space-x-2">
                <ExternalLink className="w-4 h-4" />
                <span>Apply Online</span>
              </button>
            </div>

            {/* Scholarship Info */}
            <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-6 text-white">
              <div className="flex items-center mb-3">
                <Award className="w-5 h-5 mr-2" />
                <h3 className="font-semibold">Scholarships Available</h3>
              </div>
              <p className="text-sm opacity-90 mb-3">Merit-based scholarships up to 50% fee waiver for deserving students.</p>
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