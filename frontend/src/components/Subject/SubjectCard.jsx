import { useNavigate } from "react-router-dom";

export default function SubjectCard({ subject, onEdit, onDelete, mode = "instructor" }) {
  const navigate = useNavigate();

  // Determine target route based on mode
  const handleClick = () => {
    if (mode === "instructor") {
      navigate(`/instructor-dashboard/${subject._id}`);
    } else if (mode === "student") {
      navigate(`/student-dashboard/${subject._id}`);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 hover:shadow-md transition">
      <img
        src={`http://localhost:5000/${subject.image}`}
        alt={subject.name}
        className="w-full h-40 object-cover rounded mb-2 cursor-pointer"
        onClick={handleClick}
      />
      <h3 className="text-lg font-bold text-gray-800 mb-2">{subject.name}</h3>

      {mode === "instructor" && (
        <div className="flex justify-between gap-2">
          <button
            onClick={() => onEdit(subject)}
            className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(subject._id)}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}