// components/SyllabusPage.jsx
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

const SyllabusPage = () => {
  const { semester,subjectId } = useParams();
  const [allSubjects, setAllSubjects] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjectDetails = async () => {
      try {
        const res = await axios.get("http://localhost:5002/api/subjects/all");
        console.log('Full API response:', res.data.data);
        console.log('Type of response:', typeof res.data.data);
        console.log('Keys in response:', Object.keys(res.data.data));
        setAllSubjects(res.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching subject:', error);
        setLoading(false);
      }
    };

    fetchSubjectDetails();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  console.log('=== DEBUG INFO ===');
  console.log('Semester prop:', semester, 'Type:', typeof semester);
  console.log('Subject ID:', subjectId);
  console.log('All subjects keys:', Object.keys(allSubjects));
  console.log('Semester subjects:', allSubjects[semester]);
  
  // Get subjects for the current semester
  const semesterSubjects = allSubjects[semester] || [];
  console.log('Semester subjects array:', semesterSubjects);
  console.log('Is array?', Array.isArray(semesterSubjects));
  
  // Filter to find the specific subject by ID
  const subject = semesterSubjects.find(
    subj => {
      console.log('Checking subject:', subj._id, 'against', subjectId);
      return subj._id === subjectId || subj.code === subjectId;
    }
  );

  console.log('Found subject:', subject);

  return (
    <div className="syllabus-page pt-60">
      <header className="syllabus-header">
        <h1>Semester {semester} Syllabus</h1>
        {subjectId && <p className="subject-id">Subject ID: {subjectId}</p>}
      </header>

      <div className="syllabus-content">
        {subject ? (
          <>
            <section className="subject-info">
              <h2>{subject.name}</h2>
              <p><strong>Code:</strong> {subject.code}</p>
              <p><strong>Description:</strong> {subject.description}</p>
              <p><strong>Chapters:</strong> {subject.chapters}</p>
            </section>
            
            <section className="chapters-list">
              <h3>Course Content</h3>
              {/* Add your chapter details here */}
            </section>

            <section className="semester-specific">
              {/* {getSemesterSpecificContent(semester)} */}
            </section>
          </>
        ) : (
          <div>
            <p>Subject not found for semester {semester}</p>
            <p>Debug: Looking for ID {subjectId} in semester {semester}</p>
            <p>Available subjects in this semester: {semesterSubjects.length}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function for semester-specific content
const getSemesterSpecificContent = (semester) => {
  switch(semester) {
    case '1':
      return (
        <div>
          <h4>First Semester Resources</h4>
          <p>Foundation courses and introductory materials</p>
        </div>
      );
    case '2':
      return (
        <div>
          <h4>Second Semester Resources</h4>
          <p>Building on first semester concepts</p>
        </div>
      );
    case '3':
      return (
        <div>
          <h4>Third Semester Resources</h4>
          <p>Intermediate level courses</p>
        </div>
      );
    case '4':
      return (
        <div>
          <h4>Fourth Semester Resources</h4>
          <p>Advanced foundation courses</p>
        </div>
      );
    case '5':
      return (
        <div>
          <h4>Fifth Semester Resources</h4>
          <p>Specialized courses begin</p>
        </div>
      );
    case '6':
      return (
        <div>
          <h4>Sixth Semester Resources</h4>
          <p>Advanced specialization courses</p>
        </div>
      );
    case '7':
      return (
        <div>
          <h4>Seventh Semester Resources</h4>
          <p>Project and elective courses</p>
        </div>
      );
    case '8':
      return (
        <div>
          <h4>Eighth Semester Resources</h4>
          <p>Final project and capstone courses</p>
        </div>
      );
    default:
      return null;
  }
};

export default SyllabusPage;