import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Calendar,
  Pin,
  Download,
  Eye,
  Users,
  BookOpen,
  GraduationCap,
  AlertCircle,
  Bell
} from "lucide-react";

export default function Notices() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await axios.get("http://localhost:5002/api/notices"); // 🔥 fetch from backend
      setNotices(res.data || []);
    } catch (error) {
      console.error("Error fetching notices:", error);
    } finally {
      setLoading(false);
    }
  };
  console.log(notices);
  const categories = [
    { id: "All", name: "All Notices", icon: BookOpen },
    { id: "Examinations", name: "Examinations", icon: GraduationCap },
    { id: "Academic", name: "Academic", icon: BookOpen },
    { id: "Research", name: "Research", icon: Users },
    { id: "Events", name: "Events", icon: Calendar },
    { id: "General", name: "General", icon: AlertCircle },
  ];

  const filteredNotices =
    selectedCategory === "All"
      ? notices
      : notices.filter((notice) => notice.category === selectedCategory);

  const pinnedNotices = filteredNotices.filter((notice) => notice.pinned);
  const regularNotices = filteredNotices.filter((notice) => !notice.pinned);

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
  const handleDownload = (fileUrl, fileName) => {
    // Create a temporary link element and trigger download
    const link = document.createElement("a");
    link.href = `http://localhost:5002/${fileUrl}`;
    link.download = fileName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const NoticeCard = ({ notice }) => (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {notice.pinned && <Pin className="w-4 h-4 text-red-500" />}
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(
                notice.type
              )}`}
            >
              {notice.category}
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
        {/* File attachment section */}
        {notice.fileName && notice.fileUrl && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {notice.fileName}
                  </p>
                  {notice.fileSize && (
                    <p className="text-xs text-gray-500">
                      {(notice.fileSize / 1024).toFixed(1)} KB
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDownload(notice.fileUrl, notice.fileName)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Download size={14} />
                Download
              </button>
            </div>
          </div>
        )}
            <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {notice.readMoreLink && (
              <a
                href={notice.readMoreLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
              >
                Read More →
              </a>
            )}
          </div>
          <div className="text-xs text-gray-400">
            ID: {notice._id}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Loading notices...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-55">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">
                Notices & Announcements
              </h1>
              <p className="text-xl text-blue-100">
                Stay updated with the latest news and important announcements
              </p>
              <div className="mt-4 flex items-center gap-4 text-blue-200">
                <span className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  {notices.length} Total Notices
                </span>
                <span className="flex items-center gap-2">
                  <Pin className="w-5 h-5" />
                  {pinnedNotices.length} Pinned
                </span>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-6">
                <Bell className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  const count = category.id === "All" ? notices.length : notices.filter(n => n.category === category.id).length;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                        selectedCategory === category.id
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{category.name}</span>
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {count}
                      </span>
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
                  <div className="flex justify-between">
                    <span>With Files:</span>
                    <span className="font-medium">
                      {notices.filter(n => n.fileName).length}
                    </span>
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
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                    {pinnedNotices.length}
                  </span>
                </div>
                <div className="space-y-4">
                  {pinnedNotices.map((notice) => (
                    <NoticeCard key={notice._id} notice={notice} />
                  ))}
                </div>
              </div>
            )}

            {/* Regular Notices */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {selectedCategory === "All"
                  ? "All Notices"
                  : categories.find((c) => c.id === selectedCategory)?.name}
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({regularNotices.length} notices)
                </span>
              </h2>
              <div className="space-y-4">
                {regularNotices.map((notice) => (
                  <NoticeCard key={notice._id} notice={notice} />
                ))}
              </div>

              {filteredNotices.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
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
                <button
                  onClick={fetchNotices}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Refresh Notices
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
