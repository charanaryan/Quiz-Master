import { useState } from "react";
import axios from "axios";

export default function QuizForm({ subjectId, topicId, onQuizCreated }) {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([{ questionText: "", options: ["", "", "", ""], correctOption: 0 }]);
  const [duration, setDuration] = useState("");
  const [deadline, setDeadline] = useState("");
  const [marksPerQuestion, setMarksPerQuestion] = useState(1);
  const [negativeMarks, setNegativeMarks] = useState(0);

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    if (field === "questionText") {
      updatedQuestions[index].questionText = value;
    } else if (field === "correctOption") {
      updatedQuestions[index].correctOption = parseInt(value);
    }
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[optIndex] = value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { questionText: "", options: ["", "", "", ""], correctOption: 0 }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formattedQuestions = questions.map((q) => ({
      questionText: q.questionText,  // Updated field name for consistency
      options: q.options.map((opt) => ({ text: opt })),
      correctOptionIndex: q.correctOption
    }));
  
    const newQuiz = {
      title,
      subjectId,
      topicId,
      questions: formattedQuestions,
      duration,
      deadline,
      marksPerQuestion,
      negativeMarks,
    };
  
    await axios.post("http://localhost:5000/api/quizzes", newQuiz);
  
    setTitle("");
    setQuestions([{ questionText: "", options: ["", "", "", ""], correctOption: 0 }]);
    setDuration("");
    setDeadline("");
    setMarksPerQuestion(1);
    setNegativeMarks(0);
    onQuizCreated();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Create a New Quiz</h3>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Quiz Title"
        className="w-full mb-4 p-2 border border-gray-300 rounded"
        required
      />

      <div className="grid gap-4">
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="bg-gray-50 p-4 rounded shadow-sm">
            <input
              type="text"
              value={q.questionText}  // Changed to questionText
              onChange={(e) => handleQuestionChange(qIndex, "questionText", e.target.value)}
              placeholder={`Question ${qIndex + 1}`}
              className="w-full mb-2 p-2 border border-gray-300 rounded"
              required
            />
            {q.options.map((opt, optIndex) => (
              <input
                key={optIndex}
                type="text"
                value={opt}
                onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                placeholder={`Option ${optIndex + 1}`}
                className="w-full mb-2 p-2 border border-gray-300 rounded"
                required
              />
            ))}
            <select
              value={q.correctOption}
              onChange={(e) => handleQuestionChange(qIndex, "correctOption", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value={0}>Correct Option: 1</option>
              <option value={1}>Correct Option: 2</option>
              <option value={2}>Correct Option: 3</option>
              <option value={3}>Correct Option: 4</option>
            </select>
          </div>
        ))}
      </div>

      <button type="button" onClick={addQuestion} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        + Add Question
      </button>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Duration (e.g. 30 mins)"
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="number"
          value={marksPerQuestion}
          onChange={(e) => setMarksPerQuestion(Number(e.target.value))}
          placeholder="Marks per question"
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="number"
          value={negativeMarks}
          onChange={(e) => setNegativeMarks(Number(e.target.value))}
          placeholder="Negative marks"
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <button type="submit" className="mt-6 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
        Create Quiz
      </button>
    </form>
  );
}
