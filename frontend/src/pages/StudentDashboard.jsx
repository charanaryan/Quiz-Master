import { useEffect, useState } from "react";
import axios from "axios";
import SubjectCard from "../components/Subject/SubjectCard"; // Reuse same SubjectCard
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  const fetchSubjects = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/subjects");
      setSubjects(res.data);
    } catch (err) {
      console.error("Failed to fetch subjects for student", err);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <SubjectCard key={subject._id} subject={subject} mode="student" />
        ))}
      </div>
    </div>
  );
}