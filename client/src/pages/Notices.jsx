import React, { useState } from "react";
import {
  Calendar,
  Pin,
  Download,
  Eye,
  Users,
  BookOpen,
  GraduationCap,
  AlertCircle,
} from "lucide-react";

export default function Notices() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const notices = [
    {
      id: 1,
      title: "Mid-Semester Examination Schedule - Spring 2025",
      category: "exam",
      date: "2025-05-20",
      isPinned: true,
      type: "Important",
      description:
        "Mid-semester examinations for all undergraduate programs will commence from June 2, 2025. Please check the detailed schedule attached.",
      attachment: "mid_sem_schedule.pdf",
      views: 245,
    },
    {
      id: 2,
      title: "Research Symposium 2025 - Call for Papers",
      category: "research",
      date: "2025-05-18",
      isPinned: true,
      type: "Event",
      description:
        "Annual Research Symposium will be held on July 15-16, 2025. Faculty and students are invited to submit their research papers by June 10, 2025.",
      attachment: "symposium_guidelines.pdf",
      views: 189,
    },
    {
      id: 3,
      title: "Library Hours Extension During Exam Period",
      category: "general",
      date: "2025-05-19",
      isPinned: false,
      type: "Notice",
      description:
        "The central library will remain open from 6:00 AM to 11:00 PM during the examination period (June 1-30, 2025).",
      views: 156,
    },
    {
      id: 4,
      title: "Fee Payment Reminder - Summer Semester 2025",
      category: "academic",
      date: "2025-05-17",
      isPinned: false,
      type: "Reminder",
      description:
        "Students are reminded to pay their summer semester fees by May 31, 2025. Late payment will incur additional charges.",
      views: 312,
    },
    {
      id: 5,
      title: "Guest Lecture Series: Advances in Quantum Computing",
      category: "event",
      date: "2025-05-16",
      isPinned: false,
      type: "Event",
      description:
        "Distinguished Prof. Dr. Sarah Johnson from MIT will deliver a lecture on 'Quantum Computing Applications' on May 28, 2025, at 2:00 PM in the Main Auditorium.",
      views: 98,
    },
    {
      id: 6,
      title: "Chemistry Lab Safety Training - Mandatory",
      category: "academic",
      date: "2025-05-15",
      isPinned: false,
      type: "Important",
      description:
        "All first-year chemistry students must attend the mandatory lab safety training session on May 25, 2025, at 10:00 AM.",
      views: 203,
    },
    {
      id: 7,
      title: "Career Counseling Workshop",
      category: "general",
      date: "2025-05-14",
      isPinned: false,
      type: "Event",
      description:
        "A career counseling workshop will be conducted for final year students on May 30, 2025. Registration is open until May 27, 2025.",
      views: 134,
    },
    {
      id: 8,
      title: "Hostel Accommodation Applications Open",
      category: "general",
      date: "2025-05-13",
      isPinned: false,
      type: "Notice",
      description:
        "Applications for hostel accommodation for the academic year 2025-26 are now open. Deadline for submission: June 15, 2025.",
      views: 267,
    },
  ];

  const categories = [
    { id: "all", name: "All Notices", icon: BookOpen },
    { id: "exam", name: "Examinations", icon: GraduationCap },
    { id: "academic", name: "Academic", icon: BookOpen },
    { id: "research", name: "Research", icon: Users },
    { id: "event", name: "Events", icon: Calendar },
    { id: "general", name: "General", icon: AlertCircle },
  ];

  const filteredNotices =
    selectedCategory === "all"
      ? notices
      : notices.filter((notice) => notice.category === selectedCategory);

  const pinnedNotices = filteredNotices.filter((notice) => notice.isPinned);
  const regularNotices = filteredNotices.filter((notice) => !notice.isPinned);

  const getTypeColor = (type) => {
    switch (type) {
      case "Important":
        return "bg-red-100 text-red-800 border-red-200";
      case "Event":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Reminder":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const NoticeCard = ({ notice }) => (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {notice.isPinned && <Pin className="w-4 h-4 text-red-500" />}
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(
                notice.type
              )}`}
            >
              {notice.type}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{notice.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(notice.date)}</span>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
          {notice.title}
        </h3>

        <p className="text-gray-600 mb-4 leading-relaxed">
          {notice.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {notice.attachment && (
              <button className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-sm">
                <Download className="w-4 h-4" />
                Download
              </button>
            )}
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Read More
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-4 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">
                Notices & Announcements
              </h1>
              <p className="text-xl text-blue-100">
                Stay updated with the latest news and important announcements
              </p>
            </div>
            <div className="bg-white rounded-full p-4 shadow-lg">
              <img src="/collegelogo.png" alt="college-logo" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Filter by Category
              </h3>
              <div className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        selectedCategory === category.id
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{category.name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 pt-6 border-t">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Quick Stats
                </h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Total Notices:</span>
                    <span className="font-medium">{notices.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pinned:</span>
                    <span className="font-medium">{pinnedNotices.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:w-3/4">
            {/* Pinned Notices */}
            {pinnedNotices.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Pin className="w-5 h-5 text-red-500" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Pinned Notices
                  </h2>
                </div>
                <div className="space-y-4">
                  {pinnedNotices.map((notice) => (
                    <NoticeCard key={notice.id} notice={notice} />
                  ))}
                </div>
              </div>
            )}

            {/* Regular Notices */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {selectedCategory === "all"
                  ? "All Notices"
                  : categories.find((c) => c.id === selectedCategory)?.name}
              </h2>
              <div className="space-y-4">
                {regularNotices.map((notice) => (
                  <NoticeCard key={notice.id} notice={notice} />
                ))}
              </div>

              {filteredNotices.length === 0 && (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No notices found
                  </h3>
                  <p className="text-gray-600">
                    There are no notices in this category at the moment.
                  </p>
                </div>
              )}
            </div>

            {/* Load More */}
            {regularNotices.length > 0 && (
              <div className="text-center mt-8">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Load More Notices
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
