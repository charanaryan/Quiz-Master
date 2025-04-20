import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function QuizResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    totalQuestions,
    correct,
    wrong,
    score,
    quizTitle,
    questions,
    answers,
  } = location.state || {};

  if (!questions) {
    return <div className="p-6">No result data found.</div>;
  }

  const percentage = ((score / (totalQuestions * questions[0].marksPerQuestion)) * 100).toFixed(2);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-green-600">Quiz Result</h2>
      <h3 className="text-xl font-semibold mb-2">{quizTitle}</h3>
      <p className="mb-2">Total Questions: {totalQuestions}</p>
      <p className="mb-2">Correct: {correct}</p>
      <p className="mb-2">Wrong: {wrong}</p>
      <p className="mb-2 font-semibold">Score: {score}</p>
      <p className="mb-4 text-blue-600">Percentage: {percentage}%</p>

      <div className="space-y-6">
        {questions.map((q, index) => {
          const selected = answers[index];
          const correctIndex = q.correctOptionIndex;

          return (
            <div key={index} className="bg-gray-100 p-4 rounded shadow">
              <p className="font-medium mb-2">
                Q{index + 1}: {q.questionText}
              </p>
              {q.options.map((opt, optIndex) => {
                const isCorrect = optIndex === correctIndex;
                const isSelected = optIndex === selected;

                let color = "bg-white";
                if (isCorrect) color = "bg-green-100 text-green-800";
                if (isSelected && !isCorrect) color = "bg-red-100 text-red-800";

                return (
                  <div key={optIndex} className={`px-3 py-1 rounded ${color}`}>
                    {opt.text}
                    {isCorrect && " (Correct Answer)"}
                    {isSelected && !isCorrect && " (Your Answer)"}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <button
        onClick={() => navigate(-2)}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Back to Quizzes
      </button>
    </div>
  );
}


