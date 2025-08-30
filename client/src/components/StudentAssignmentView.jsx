import React, { useState, useEffect } from "react";
import axios from "axios";
import { File, Download, Calendar } from "lucide-react";

const StudentAssignmentView = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5002/api/assignments/student",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAssignments(response.data);
    } catch (error) {
      setError("Failed to fetch assignments:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleAssignmentSubmit = async (assignmentId, file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(
        `http://localhost:5002/api/assignments/${assignmentId}/submit`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Assignment submitted successfully");
      setSubmitted(true);
      fetchAssignments(); // Refresh the assignments list
    } catch (error) {
      console.error(error);
      alert("Failed to submit assignment");
    }
  };
  if (loading) return <div>Loading assignments...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {assignments.map((assignment) => (
          <div
            key={assignment._id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-lg text-gray-900">
                {assignment.title}
              </h3>
              <span className="text-sm text-gray-500">
                {assignment.subject}
              </span>
            </div>

            <p className="text-gray-600 text-sm mb-4">
              {assignment.description}
            </p>

            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Calendar size={16} />
              <span>
                Due: {new Date(assignment.dueDate).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                By: {assignment.teacher.name}
              </span>

              {/* Upload Input */}

              <input
                type="file"
                id={`file-${assignment._id}`}
                className="hidden"
                onChange={(e) =>
                  handleAssignmentSubmit(assignment._id, e.target.files[0])
                }
              />

              <label
                htmlFor={`file-${assignment._id}`}
                className="bg-gray-700 text-white rounded-lg px-3 py-1.5 cursor-pointer hover:bg-gray-600 transition-colors"
              >
                {submitted ? "Submitted" : "Submit"}
              </label>

              <a
                href={`http://localhost:5002/${assignment.fileUrl}`}
                download
                className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Download size={16} />
                <span className="text-sm font-medium">Download</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentAssignmentView;
