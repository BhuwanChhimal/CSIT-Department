import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Upload,
  File,
  AlertCircle,
  BookOpen,
  Hash,
  Calendar,
  Trash2,
} from "lucide-react";
import { toast } from "react-hot-toast";
const AssignmentManagementComp = ({submissions,setSubmissions,setPendingAssignmentsCount,assignments,setAssignments,fetchAssignments}) => {
  // const [submissions, setSubmissions] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    semester: "",
    subject: "",
    dueDate: "",
    file: null,
  });
  const token = localStorage.getItem("token");



  // Update pending assignments count whenever submissions change
  useEffect(() => {
    let count = 0;
    Object.values(submissions).forEach((subList) => {
      subList.forEach((sub) => {
        if (!sub.grade) count++;
      });
    });
    setPendingAssignmentsCount(count);
  }, [submissions]);


  const fetchSubmissions = async (assignmentId) => {
    try {
      const res = await axios.get(
        `http://localhost:5002/api/assignments/${assignmentId}/submissions`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(res.data);
      console.log(res.data.submissions); // list of all submissions
      setSubmissions((prev) => ({
        ...prev,
        [assignmentId]: res.data, // store by assignment
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      await axios.post("http://localhost:5002/api/assignments/upload", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setFormData({
        title: "",
        description: "",
        semester: "",
        subject: "",
        dueDate: "",
        file: null,
      });
      fetchAssignments();
      toast.success("Assignment uploaded successfully");
      // alert("Assignment uploaded successfully");
    } catch (error) {
      alert("error uploading assignment");
      setError(error.response?.data?.message || "Error uploading assignment");
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteAssignment = async (id) => {
    if (!confirm("Are you sure you want to delete this notice?")) return;

    try {
      await axios.delete(`http://localhost:5002/api/assignments/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setAssignments(assignments.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Error deleting assignment:", err);
      alert("Error deleting assignment. Please try again.");
    }
  };

  const GRADE_OPTIONS = ["A+", "A", "B+", "B", "C+", "C", "D", "E"];

  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState("");

  const handleOpenGrade = (submission) => {
    setGradingSubmission(submission);
    setSelectedGrade(submission.grade || "");
  };

  const handleGradeSubmit = async (assignmentId, studentId) => {
    await axios.put(
      `http://localhost:5002/api/assignments/${assignmentId}/grade/${studentId}`,
      { grade: selectedGrade },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    setGradingSubmission(null);
    setSelectedGrade("");
    // Optionally refresh submissions
    fetchSubmissions(assignmentId);
  };
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className=" mx-auto">
        <div className="mb-10">
          <h2 className="text-3xl font-light text-gray-900 mb-2">
            Assignment Management
          </h2>
          <p className="text-gray-600">
            Upload and manage your academic assignments
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <BookOpen size={16} className="text-gray-400" />
                  Assignment Title
                </label>
                <input
                  type="text"
                  placeholder="Enter assignment title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <BookOpen size={16} className="text-gray-400" />
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="Enter subject name"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Hash size={16} className="text-gray-400" />
                  Semester
                </label>
                <input
                  type="number"
                  placeholder="Enter semester number"
                  value={formData.semester}
                  onChange={(e) =>
                    setFormData({ ...formData, semester: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  Due Date
                </label>
                <input
                  type="datetime-local"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Assignment Description
              </label>
              <textarea
                placeholder="Provide a detailed description of the assignment"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white min-h-[120px] resize-none outline-none"
                required
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Assignment File
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  onChange={(e) =>
                    setFormData({ ...formData, file: e.target.files[0] })
                  }
                  className="hidden"
                  id="file-upload"
                  required
                />
                <label
                  htmlFor="file-upload"
                  className="flex items-center gap-3 px-6 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl cursor-pointer transition-all duration-200 text-gray-700 font-medium"
                >
                  <Upload size={20} className="text-gray-400" />
                  <span>Choose File</span>
                </label>
                {formData.file && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                    <File size={16} className="text-blue-500" />
                    <span className="text-sm text-blue-700 font-medium">
                      {formData.file.name}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle size={20} className="text-red-500" />
                <span className="text-red-700">{error}</span>
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </div>
                ) : (
                  "Upload Assignment"
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Uploaded Assignments
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              View and manage your submitted assignments
            </p>
          </div>

          <div className="space-y-4">
            {assignments.map((assignment) => (
              <div
                key={assignment._id}
                className="p-6 border border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">
                    {assignment.title}
                  </h4>
                  <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                    {new Date(assignment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {assignment.description}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                    <File size={16} className="text-blue-500" />
                    <a
                      href={`http://localhost:5002/${assignment.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      {assignment.fileName}
                    </a>
                  </div>
                  <button
                    onClick={() => fetchSubmissions(assignment._id)}
                    className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                  >
                    View Submissions
                  </button>
                  <button
                    onClick={() => handleDeleteAssignment(assignment._id)}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={28} />
                  </button>
                </div>

                {submissions[assignment._id] && (
                  <div className="mt-4 border-t pt-3">
                    <h5 className="font-medium text-gray-800 mb-2">
                      Submissions
                    </h5>
                    {submissions[assignment._id].length === 0 ? (
                      <p className="text-gray-500 text-sm">
                        No submissions yet
                      </p>
                    ) : (
                      <ul className="space-y-2">
                        {submissions[assignment._id].map((sub, idx) => (
                          <li
                            key={idx}
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <p className="text-gray-800 font-medium capitalize">
                                {sub.student?.name || "Unknown Student"}
                              </p>
                              <p className="text-gray-500 text-sm">
                                Submitted:{" "}
                                {new Date(sub.submittedAt).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex gap-4">
                              <a
                                href={`http://localhost:5002/${sub.fileUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-3 rounded-lg  bg-blue-600 text-white text-sm  hover:bg-blue-700"
                              >
                                Download
                              </a>
                              {!sub.grade && (
                                <button
                                  className="bg-green-600 p-3 rounded-lg text-white"
                                  onClick={() => handleOpenGrade(sub)}
                                >
                                  Grade
                                </button>
                              )}
                              {sub.grade && (
                                <span
                                  onClick={() => handleOpenGrade(sub)}
                                  className="ml-2 cursor-pointer bg-gray-400 flex items-center p-3 rounded-lg text-white"
                                >
                                  Graded: {sub.grade}
                                </span>
                              )}

                              {gradingSubmission && (
                                <div
                                  className="fixed inset-[60%] w-64 h-64 flex items-center justify-center z-50"
                                  onClick={() => setGradingSubmission(null)}
                                >
                                  <div
                                    className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xs relative"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <button
                                      className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
                                      onClick={() => setGradingSubmission(null)}
                                    >
                                      <svg
                                        width="24"
                                        height="24"
                                        fill="none"
                                        stroke="currentColor"
                                      >
                                        <path d="M6 6l12 12M6 18L18 6" />
                                      </svg>
                                    </button>
                                    <h3 className="text-xl font-semibold mb-6 text-gray-800 text-center">
                                      Assign Grade
                                    </h3>
                                    <div className="mb-6">
                                      <select
                                        value={selectedGrade}
                                        onChange={(e) =>
                                          setSelectedGrade(e.target.value)
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-700"
                                      >
                                        <option value="">Select Grade</option>
                                        {GRADE_OPTIONS.map((g) => (
                                          <option key={g} value={g}>
                                            {g}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                    <button
                                      className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                      onClick={() =>
                                        handleGradeSubmit(
                                          assignment._id,
                                          gradingSubmission.student?._id
                                        )
                                      }
                                    >
                                      Save Grade
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentManagementComp;
