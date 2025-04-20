import React, { useState, useEffect } from "react";
import toast from "react-hot-toast"
import axios from "axios";

const EditQuizModal = ({ quiz, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: "",
    duration: 0,
    deadline: "",
    marksPerQuestion: 0,
    negativeMarks: 0,
  });

  const [questions, setQuestions] = useState([]);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (quiz) {
      const formattedData = {
        title: quiz.title || "",
        duration: quiz.duration || 0,
        deadline: quiz.deadline ? quiz.deadline.split("T")[0] : "",
        marksPerQuestion: quiz.marksPerQuestion || 0,
        negativeMarks: quiz.negativeMarks || 0,
      };
      setFormData(formattedData);
      setQuestions(quiz.questions || []);
      setOriginalData({
        formData: formattedData,
        questions: JSON.stringify(quiz.questions || []),
      });
    }
  }, [quiz]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex].text = value;
    setQuestions(updated);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        options: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
        correctOptionIndex: 0,
      },
    ]);
  };

  const handleRemoveQuestion = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await axios.put(`http://localhost:5000/api/quizzes/${quiz._id}`, {
        ...formData,
        questions,
      });
  
      toast.success("Quiz updated successfully 🎉"); 
      onClose();  
      onUpdate(); 
      setIsSaving(false);
    } catch (error) {
      console.error("Error updating quiz:", error);
      setIsSaving(false);
    }
  };
  
  

  const handleCancel = () => {
    const isChanged =
      JSON.stringify(formData) !== JSON.stringify(originalData.formData) ||
      JSON.stringify(questions) !== originalData.questions;

    if (isChanged) {
      setShowConfirmCancel(true);
    } else {
      onClose();
    }
  };

  const confirmCancel = () => {
    setShowConfirmCancel(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto relative animate-fade-in-down">
        <h2 className="text-2xl font-bold mb-4">Edit Quiz</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Quiz Fields */}
          <div>
            <label className="block font-medium">Quiz Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Duration (minutes)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Deadline</label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Marks per Question</label>
            <input
              type="number"
              name="marksPerQuestion"
              value={formData.marksPerQuestion}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
              min={1}
            />
          </div>
          <div>
            <label className="block font-medium">Negative Marks</label>
            <input
              type="number"
              name="negativeMarks"
              value={formData.negativeMarks}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
              max={0}
              min={-(formData.marksPerQuestion / 2)}
              step="0.1"
            />
          </div>

          {/* Questions */}
          <hr className="my-6" />
          <h3 className="text-xl font-semibold mb-2">Questions</h3>

          {questions.map((question, qIndex) => (
            <div key={qIndex} className="border rounded p-4 mb-4 bg-gray-50">
              <label className="block font-medium mb-1">Question {qIndex + 1}</label>
              <input
                type="text"
                value={question.questionText}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "questionText", e.target.value)
                }
                className="w-full p-2 border rounded mb-3"
                placeholder="Enter question"
                required
              />

              {question.options.map((option, optIndex) => (
                <div key={optIndex} className="mb-2">
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) =>
                      handleOptionChange(qIndex, optIndex, e.target.value)
                    }
                    className="w-full p-2 border rounded"
                    placeholder={`Option ${optIndex + 1}`}
                    required
                  />
                </div>
              ))}

              <label className="block font-medium mt-2">Correct Option:</label>
              <select
                value={question.correctOptionIndex}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "correctOptionIndex", parseInt(e.target.value))
                }
                className="w-full p-2 border rounded"
              >
                {question.options.map((_, index) => (
                  <option key={index} value={index}>
                    Option {index + 1}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => handleRemoveQuestion(qIndex)}
                className="mt-3 text-red-500 text-sm hover:underline"
              >
                Delete Question
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddQuestion}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Question
          </button>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={`${
                isSaving ? "bg-green-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              } text-white px-4 py-2 rounded`}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>

        {/* Stylish Cancel Confirmation Modal */}
        {showConfirmCancel && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg transform transition-all scale-100">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Discard Changes?
              </h3>
              <p className="text-gray-600 mb-6">
                Do you want to cancel the changes made?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={confirmCancel}
                >
                  Yes
                </button>
                <button
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                  onClick={() => setShowConfirmCancel(false)}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditQuizModal;



