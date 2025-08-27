import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Upload, File, AlertCircle } from 'lucide-react';

const AssignmentManagementComp = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    semester: '',
    subject: '',
    dueDate: '',
    file: null
  });

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/assignments/teacher');
      setAssignments(response.data);
    } catch (error) {
      setError('Failed to fetch assignments:',error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

    try {
      await axios.post('http://localhost:5002/api/assignments/upload', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setFormData({
        title: '',
        description: '',
        semester: '',
        subject: '',
        dueDate: '',
        file: null
      });
      fetchAssignments();
    } catch (error) {
      setError(error.response?.data?.message || 'Error uploading assignment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Assignment Management</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="Assignment Title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="input"
            required
          />
          <input
            type="text"
            placeholder="Subject"
            value={formData.subject}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
            className="input"
            required
          />
          <input
            type="number"
            placeholder="Semester"
            value={formData.semester}
            onChange={(e) => setFormData({...formData, semester: e.target.value})}
            className="input"
            required
          />
          <input
            type="datetime-local"
            value={formData.dueDate}
            onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
            className="input"
            required
          />
        </div>
        
        <textarea
          placeholder="Assignment Description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="input min-h-[100px]"
          required
        />
        
        <div className="flex items-center gap-4">
          <input
            type="file"
            onChange={(e) => setFormData({...formData, file: e.target.files[0]})}
            className="hidden"
            id="file-upload"
            required
          />
          <label
            htmlFor="file-upload"
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-100"
          >
            <Upload size={20} />
            <span>Choose File</span>
          </label>
          {formData.file && (
            <span className="text-sm text-gray-600">
              {formData.file.name}
            </span>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-500">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Uploading...' : 'Upload Assignment'}
        </button>
      </form>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Uploaded Assignments</h3>
        {assignments.map((assignment) => (
          <div
            key={assignment._id}
            className="p-4 bg-white rounded-lg shadow space-y-2"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{assignment.title}</h4>
              <span className="text-sm text-gray-500">
                {new Date(assignment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-gray-600">{assignment.description}</p>
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <File size={16} />
              <a href={assignment.fileUrl} target="_blank" rel="noopener noreferrer">
                {assignment.fileName}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignmentManagementComp;