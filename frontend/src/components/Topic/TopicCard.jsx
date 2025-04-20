// src/components/TopicCard.jsx
import { useNavigate } from "react-router-dom";

export default function TopicCard({
  topic,
  subjectId,
  onEdit,
  onDelete,
  studentView = false,
}) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (studentView) {
      navigate(`/student-dashboard/${subjectId}/${topic._id}`);
    } else {
      navigate(`/instructor-dashboard/${subjectId}/${topic._id}`);
    }
  };

  return (
    <div className="bg-white shadow p-4 rounded hover:shadow-md">
      <img
        src={`http://localhost:5000/uploads/${topic.image}`}
        alt={topic.name}
        className="w-full h-32 object-cover rounded mb-2 cursor-pointer"
        onClick={handleCardClick}
      />

      <h4 className="text-lg font-semibold mb-2">{topic.name}</h4>
      <p className="text-sm text-gray-600 mb-2">{topic.description}</p>

      {!studentView ? (
        <div className="flex justify-between gap-2">
          <button
            onClick={onEdit}
            className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      ) : (
        <button
          onClick={handleCardClick}
          className="w-full mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          View Quizzes
        </button>
      )}
    </div>
  );
}



