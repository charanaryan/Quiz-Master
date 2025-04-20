// src/pages/QuizPage.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import QuestionForm from "../components/Quiz/QuestionForm";
import { Pencil, Trash2, Plus } from "lucide-react";

const QuizPage = () => {
  const { quizId, subjectId, topicId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [editing, setEditing] = useState(true); // Start in edit mode
  const [tempQuiz, setTempQuiz] = useState(null);

  const fetchQuiz = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/quizzes/${quizId}`);
      setQuiz(res.data);
      setTempQuiz(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, []);

  const handleDetailChange = (e) => {
    setTempQuiz({ ...tempQuiz, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, updatedQuestion) => {
    const updated = [...tempQuiz.questions];
    updated[index] = updatedQuestion;
    setTempQuiz({ ...tempQuiz, questions: updated });
  };

  const handleDeleteQuestion = (index) => {
    const updated = [...tempQuiz.questions];
    updated.splice(index, 1);
    setTempQuiz({ ...tempQuiz, questions: updated });
  };

  const addNewQuestion = (newQuestion) => {
    setTempQuiz({
      ...tempQuiz,
      questions: [...tempQuiz.questions, newQuestion],
    });
  };

  const saveChanges = async () => {
    try {
      await axios.put(`http://localhost:5000/api/quizzes/${quizId}`, tempQuiz);
      setEditing(false);
      navigate(`/instructor-dashboard/${subjectId}/${topicId}`);
    } catch (err) {
      console.error(err);
    }
  };

  const cancelChanges = () => {
    setEditing(false);
    navigate(`/instructor-dashboard/${subjectId}/${topicId}`);
  };

  const deleteQuiz = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/quizzes/${quizId}`);
      navigate(`/instructor-dashboard/${subjectId}/${topicId}`);
    } catch (err) {
      console.error(err);
    }
  };

  if (!quiz || !tempQuiz) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Quiz</h1>
        <button
          onClick={deleteQuiz}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center"
        >
          <Trash2 className="mr-2 h-4 w-4" /> Delete Quiz
        </button>
      </div>

      {/* Quiz Details Form */}
      <div className="grid gap-4 mb-6">
        <input
          type="text"
          name="title"
          value={tempQuiz.title}
          onChange={handleDetailChange}
          className="border p-2 rounded"
          placeholder="Quiz Title"
        />
        <input
          type="text"
          name="duration"
          value={tempQuiz.duration}
          onChange={handleDetailChange}
          className="border p-2 rounded"
          placeholder="Duration"
        />
        <input
          type="text"
          name="deadline"
          value={tempQuiz.deadline}
          onChange={handleDetailChange}
          className="border p-2 rounded"
          placeholder="Deadline"
        />
        <input
          type="number"
          name="marksPerQuestion"
          value={tempQuiz.marksPerQuestion}
          onChange={handleDetailChange}
          className="border p-2 rounded"
          placeholder="Marks per Question"
        />
        <input
          type="number"
          name="negativeMarks"
          value={tempQuiz.negativeMarks}
          onChange={handleDetailChange}
          className="border p-2 rounded"
          placeholder="Negative Marks"
        />

        <div className="flex gap-4">
          <button
            onClick={saveChanges}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save
          </button>
          <button
            onClick={cancelChanges}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Questions */}
      <h2 className="text-xl font-bold mb-4">Questions</h2>
      {tempQuiz.questions.map((q, idx) => (
        <div key={idx} className="mb-4 border rounded p-4">
          <QuestionForm
            question={q}
            index={idx}
            onSubmit={(updatedQ) => handleQuestionChange(idx, updatedQ)}
            onDelete={() => handleDeleteQuestion(idx)}
          />
        </div>
      ))}

      {/* Add New Question */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Add New Question</h3>
        <QuestionForm onSubmit={addNewQuestion} />
      </div>
    </div>
  );
};

export default QuizPage;
