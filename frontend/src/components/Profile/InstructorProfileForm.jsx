import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SubjectCard from "../Subject/SubjectCard";

export default function InstructorDashboard() {
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();
  const userId = "yourUserId"; // Replace with the actual userId from your authentication system

  // Fetch subjects created by the instructor
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/instructor/subjects/${userId}`);
        setSubjects(response.data);
      } catch (err) {
        console.error("Error fetching subjects:", err);
      }
    };

    fetchSubjects();
  }, [userId]);

  // Handle editing a subject
  const handleEditSubject = (subject) => {
    navigate(`/instructor-dashboard/subject/edit/${subject._id}`);
  };

  // Handle deleting a subject
  const handleDeleteSubject = async (subjectId) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/instructor/subject/${subjectId}`);
      if (res.status === 200) {
        // Re-fetch subjects after deletion
        const updatedSubjects = subjects.filter(subject => subject._id !== subjectId);
        setSubjects(updatedSubjects);
      }
    } catch (err) {
      console.error("Error deleting subject:", err);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {subjects.map(subject => (
        <SubjectCard
          key={subject._id}
          subject={subject}
          onEdit={handleEditSubject}
          onDelete={handleDeleteSubject}
          mode="instructor"
        />
      ))}
    </div>
  );
}
