import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InstructorProfileForm from "../components/Profile/InstructorProfileForm";
import SubjectForm from "../components/Subject/SubjectForm";
import SubjectCard from "../components/Subject/SubjectCard";

export default function InstructorDashboard() {
  const [subjects, setSubjects] = useState([]);
  const [instructorProfile, setInstructorProfile] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInstructorProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/instructor/profile/${userId}`);
        setInstructorProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch instructor profile", err);
        setInstructorProfile(null);
      }
    };

    fetchInstructorProfile();
  }, [userId]);

  useEffect(() => {
    if (!instructorProfile) return;

    const fetchSubjects = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/instructor/subjects/${userId}`);
        setSubjects(res.data);
      } catch (err) {
        console.error("Failed to fetch subjects", err);
      }
    };

    fetchSubjects();
  }, [instructorProfile, userId]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">
      {/* Top Nav */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Instructor Dashboard</h1>
        {instructorProfile && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-medium">{instructorProfile.name}</span>
              {instructorProfile.profilePicture && (
                <img
                  src={`http://localhost:5000/${instructorProfile.profilePicture}`}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border"
                />
              )}
            </div>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {!instructorProfile ? (
        <InstructorProfileForm uid={userId} onProfileCreated={() => {
          // Re-fetch profile once it's created
          const fetchInstructorProfile = async () => {
            try {
              const res = await axios.get(`http://localhost:5000/api/instructor/profile/${userId}`);
              setInstructorProfile(res.data);
            } catch (err) {
              console.error("Failed to fetch instructor profile", err);
              setInstructorProfile(null);
            }
          };
          fetchInstructorProfile();
        }} />
      ) : (
        <>
          <SubjectForm instructorId={instructorProfile._id} onSubjectCreated={() => {
            // Refresh subject list after creating one
            const fetchSubjects = async () => {
              try {
                const res = await axios.get(`http://localhost:5000/api/instructor/subjects/${userId}`);
                setSubjects(res.data);
              } catch (err) {
                console.error("Failed to fetch subjects", err);
              }
            };
            fetchSubjects();
          }} />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
            {subjects.map((subject) => (
              <SubjectCard key={subject._id} subject={subject} />
            ))}
          </div>
        </>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Are you signing out?</h2>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                No
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
