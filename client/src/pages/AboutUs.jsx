import React, { useState } from 'react';
import { Clock, MapPin, Trophy, GraduationCap, Users, BookOpen } from 'lucide-react';

export default function AboutUs() {
  const [activeTab, setActiveTab] = useState('history');
  
  return (
    <div className="bg-gray-50 min-h-screen pt-50">
      {/* Hero Section */}
      <div className="relative bg-blue-900 h-64 md:h-80">
        <div className="absolute inset-0 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-900/90 to-blue-800/80 absolute inset-0 z-10"></div>
          <div className="bg-[url('/api/placeholder/1920/600')] bg-cover bg-center absolute inset-0"></div>
        </div>
        <div className="container mx-auto px-4 h-full flex justify-between items-center relative z-20">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">About Amrit Science Campus</h1>
            <p className="text-blue-100 text-lg md:text-xl">Fostering excellence in scientific education and research since 1992</p>
          </div>
          <div className='bg-white rounded-full p-4 shadow-lg'>
            <img src="/collegelogo.png" alt="college-logo" />
          </div>
        </div>
      </div>
      
      {/* Quick Facts */}
      <div className="bg-white shadow-md py-6 -mt-8 relative z-30 rounded-t-lg">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Clock className="text-blue-600 w-8 h-8" />
              </div>
              <p className="text-sm text-gray-600">Established</p>
              <p className="font-semibold">1957</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Users className="text-blue-600 w-8 h-8" />
              </div>
              <p className="text-sm text-gray-600">Students</p>
              <p className="font-semibold">2,000+</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <GraduationCap className="text-blue-600 w-8 h-8" />
              </div>
              <p className="text-sm text-gray-600">Faculty</p>
              <p className="font-semibold">120+</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <BookOpen className="text-blue-600 w-8 h-8" />
              </div>
              <p className="text-sm text-gray-600">Programs</p>
              <p className="font-semibold">15+</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column */}
          <div className="md:w-2/3">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-8">
              <div className="flex space-x-8">
                <button 
                  className={`py-4 text-sm font-medium border-b-2 ${activeTab === 'history' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('history')}
                >
                  Our History
                </button>
                <button 
                  className={`py-4 text-sm font-medium border-b-2 ${activeTab === 'mission' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('mission')}
                >
                  Mission & Vision
                </button>
                <button 
                  className={`py-4 text-sm font-medium border-b-2 ${activeTab === 'achievements' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('achievements')}
                >
                  Achievements
                </button>
              </div>
            </div>
            
            {/* Tab Content */}
            <div className="prose max-w-none">
              {activeTab === 'history' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Journey Through the Years</h2>
                  <p className="mb-4">
                    Amrit Science Campus (ASCOL) was established in 1957 as a premier institution dedicated to scientific education and research. Located in the heart of Kathmandu, Nepal, ASCOL has grown from humble beginnings to become one of the country's leading science colleges.
                  </p>
                  <div className="my-6 bg-gray-100 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3">Key Milestones</h3>
                    <ul className="space-y-3">
                      <li className="flex">
                        <span className="font-bold text-blue-600 mr-2">19572:</span>
                        <span>Establishment of Amrit Science Campus</span>
                      </li>
                      <li className="flex">
                        <span className="font-bold text-blue-600 mr-2">1995:</span>
                        <span>Introduction of Bachelor's programs in Physics, Chemistry, and Biology</span>
                      </li>
                      <li className="flex">
                        <span className="font-bold text-blue-600 mr-2">2000:</span>
                        <span>Expansion of campus facilities and research laboratories</span>
                      </li>
                      <li className="flex">
                        <span className="font-bold text-blue-600 mr-2">2005:</span>
                        <span>Launch of Master's degree programs</span>
                      </li>
                      <li className="flex">
                        <span className="font-bold text-blue-600 mr-2">2010:</span>
                        <span>Establishment of research centers for environmental and biotechnology studies</span>
                      </li>
                      <li className="flex">
                        <span className="font-bold text-blue-600 mr-2">2015:</span>
                        <span>Introduction of computer science and information technology programs</span>
                      </li>
                      <li className="flex">
                        <span className="font-bold text-blue-600 mr-2">2020:</span>
                        <span>Development of state-of-the-art digital learning facilities</span>
                      </li>
                    </ul>
                  </div>
                  <p>
                    Over the years, ASCOL has maintained its commitment to academic excellence, fostering critical thinking, and promoting scientific research. Today, we continue to build on our rich legacy while embracing innovation and modern educational approaches.
                  </p>
                </div>
              )}
              
              {activeTab === 'mission' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission & Vision</h2>
                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Mission Statement</h3>
                    <p className="italic">
                      "To foster scientific inquiry, promote academic excellence, and develop future leaders who will contribute to scientific advancement and sustainable development through quality education and research."
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Vision</h3>
                    <p className="italic">
                      "To be a nationally recognized center of excellence in science education and research, empowering students to address global challenges through scientific innovation and ethical practice."
                    </p>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3">Core Values</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
                      <h4 className="font-medium text-blue-700 mb-2">Academic Excellence</h4>
                      <p className="text-sm">We strive for the highest standards in teaching, learning, and research.</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
                      <h4 className="font-medium text-blue-700 mb-2">Scientific Inquiry</h4>
                      <p className="text-sm">We foster curiosity, critical thinking, and evidence-based approaches.</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
                      <h4 className="font-medium text-blue-700 mb-2">Innovation</h4>
                      <p className="text-sm">We embrace creative solutions and emerging technologies.</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
                      <h4 className="font-medium text-blue-700 mb-2">Inclusivity</h4>
                      <p className="text-sm">We value diversity and ensure equal opportunities for all.</p>
                    </div>
                  </div>
                  
                  <p>
                    At Amrit Science Campus, we are committed to creating an environment where scientific knowledge flourishes and students develop the skills needed to address complex challenges. Our educational approach balances theoretical understanding with practical application, preparing graduates who are ready to make meaningful contributions to society.
                  </p>
                </div>
              )}
              
              {activeTab === 'achievements' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Achievements</h2>
                  
                  <p className="mb-6">
                    Amrit Science Campus has established itself as a leading institution in science education with numerous accolades and achievements that reflect our commitment to excellence.
                  </p>
                  
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <Trophy className="text-yellow-500 w-5 h-5 mr-2" />
                      Academic Excellence
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1">
                          <div className="bg-blue-600 w-2 h-2 rounded-full"></div>
                        </div>
                        <span>Consistently ranked among top 5 science colleges in Nepal</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1">
                          <div className="bg-blue-600 w-2 h-2 rounded-full"></div>
                        </div>
                        <span>Over 90% of our graduates receive placements in prestigious institutions</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1">
                          <div className="bg-blue-600 w-2 h-2 rounded-full"></div>
                        </div>
                        <span>Numerous gold medals and top ranks in university examinations</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <Trophy className="text-yellow-500 w-5 h-5 mr-2" />
                      Research & Innovation
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1">
                          <div className="bg-blue-600 w-2 h-2 rounded-full"></div>
                        </div>
                        <span>Published over 200 research papers in international journals in the last 5 years</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1">
                          <div className="bg-blue-600 w-2 h-2 rounded-full"></div>
                        </div>
                        <span>Secured multiple research grants from national and international funding agencies</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1">
                          <div className="bg-blue-600 w-2 h-2 rounded-full"></div>
                        </div>
                        <span>Developed innovative solutions for local environmental and agricultural challenges</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <Trophy className="text-yellow-500 w-5 h-5 mr-2" />
                      Recognition & Partnerships
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="mb-3">We have established collaborations with:</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-white p-3 rounded shadow-sm text-center">
                          <p className="font-medium">Tribhuvan University</p>
                        </div>
                        <div className="bg-white p-3 rounded shadow-sm text-center">
                          <p className="font-medium">Nepal Academy of Science</p>
                        </div>
                        <div className="bg-white p-3 rounded shadow-sm text-center">
                          <p className="font-medium">Ministry of Education</p>
                        </div>
                        <div className="bg-white p-3 rounded shadow-sm text-center">
                          <p className="font-medium">International Universities</p>
                        </div>
                        <div className="bg-white p-3 rounded shadow-sm text-center">
                          <p className="font-medium">Research Institutions</p>
                        </div>
                        <div className="bg-white p-3 rounded shadow-sm text-center">
                          <p className="font-medium">Industry Partners</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Sidebar */}
          <div className="md:w-1/3">
            <div className="sticky top-6">
              {/* Campus Image */}
              <div className="mb-6 rounded-lg overflow-hidden shadow-md">
                <img src="/clg-img.webp" alt="Amrit Science Campus Building" className="w-full h-auto" />
              </div>
              
              {/* Location */}
              <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <MapPin className="text-red-500 w-5 h-5 mr-2" />
                  Our Location
                </h3>
                <p className="text-gray-600 mb-3">Lainchaur, Kathmandu, Nepal</p>
                <div className="bg-gray-200 h-40 rounded flex items-center justify-center">
                  <img src="/clg-map.png" alt="campus location" />
                </div>
                <a href="#" className="inline-block mt-3 text-blue-600 text-sm hover:underline">Get Directions</a>
              </div>
              
              {/* Contact Info */}
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                <div className="space-y-3 text-gray-600">
                  <p><span className="font-medium">Phone:</span> +977-01-4411637</p>
                  <p><span className="font-medium">Email:</span> info@ac.tu.edu.np</p>
                  <p><span className="font-medium">Office Hours:</span> 8:00 AM - 4:00 PM (Sun-Fri)</p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <a href="#" className="inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-150 ease-in-out">
                    Contact Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Leadership Section */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Our Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-56 bg-gray-200 flex items-center justify-center">
                <img src="https://portal.tu.edu.np/medias/Dr.HomBahadurBaniya_2024_06_17_22_20_28.png" alt="Campus Chief" className="w-32 h-32 object-cover rounded-full border-4 border-white" />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-bold text-lg">Dr. Hom Bahadur Baniya</h3>
                <p className="text-blue-600 mb-2">Campus Chief</p>
                <p className="text-sm text-gray-600">Ph.D. in Physics with over 20 years of academic experience in leading scientific institutions.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-56 bg-gray-200 flex items-center justify-center">
                <img src="https://portal.tu.edu.np/medias/Gopal-Neupane_2024_06_17_22_14_46.jpg" alt="Assistant Campus Chief" className="w-32 h-32 object-cover rounded-full border-4 border-white" />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-bold text-lg">Prof. Gopal Neupane</h3>
                <p className="text-blue-600 mb-2">Assistant Campus Chief</p>
                <p className="text-sm text-gray-600">M.Sc Mathematics</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-56 bg-gray-200 flex items-center justify-center">
                <img src="https://portal.tu.edu.np/medias/Dhirendra-Kumar-Yadav-150x150_2024_06_19_13_24_21.jpg" alt="IT coordinator" className="w-32 h-32 object-cover rounded-full border-4 border-white" />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-bold text-lg">Mr. Dhirendra Kumar Yadav</h3>
                <p className="text-blue-600 mb-2">IT Program Co-ordinator</p>
                <p className="text-sm text-gray-600">Lorem ipsum dolor sit amet consectetur adipisicingne, natus quas ipsum dolores perspiciatis dolori</p>
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <a href="#" className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <span>View all faculty members</span>
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}