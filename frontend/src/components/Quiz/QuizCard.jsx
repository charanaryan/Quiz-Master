// src/components/QuizCard.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical } from 'lucide-react';
import axios from 'axios';

const QuizCard = ({ quiz, subjectId, topicId, mode, onDelete }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleCardClick = () => {
    if (mode === 'instructor') {
      navigate(`/instructor-dashboard/${subjectId}/${topicId}/quiz/${quiz._id}`);
    } else {
      navigate(`/student-dashboard/${subjectId}/${topicId}/quiz/${quiz._id}`);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/instructor-dashboard/${subjectId}/${topicId}/quiz/${quiz._id}?edit=true`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    const confirm = window.confirm('Are you sure you want to delete this quiz?');
    if (!confirm) return;
    try {
      await axios.delete(`http://localhost:5000/api/quizzes/${quiz._id}`);
      if (onDelete) onDelete(quiz._id);
    } catch (error) {
      console.error('Error deleting quiz:', error);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white shadow-md rounded-lg p-4 relative hover:shadow-lg transition cursor-pointer"
    >
      {mode === 'instructor' && (
        <div className="absolute top-2 right-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu((prev) => !prev);
            }}
          >
            <MoreVertical size={18} />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 bg-white border shadow-md rounded w-32 z-10">
              <button
                onClick={handleEdit}
                className="block px-4 py-2 w-full text-left hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="block px-4 py-2 w-full text-left text-red-600 hover:bg-gray-100"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}
      <h3 className="text-lg font-semibold">{quiz.title}</h3>
      <p className="text-sm text-gray-600">Duration: {quiz.duration} mins</p>
      <p className="text-sm text-gray-600">
        Deadline: {new Date(quiz.deadline).toLocaleString()}
      </p>
    </div>
  );
};

export default QuizCard;
