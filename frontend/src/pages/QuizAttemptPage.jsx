import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function QuizAttemptPage() {
  const { subjectId, topicId, quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [timerExpired, setTimerExpired] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/quizzes/${quizId}`);
        setQuiz(res.data);
        const durationInSeconds = parseInt(res.data.duration) * 60;
        setTimeLeft(durationInSeconds);
      } catch (err) {
        console.error("Error fetching quiz:", err);
      }
    };
    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (!timeLeft) return;
    if (timeLeft <= 0) {
      setTimerExpired(true);
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerSelect = (qIndex, optIndex) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  const calculateScore = () => {
    let correct = 0;
    let wrong = 0;

    quiz.questions.forEach((q, index) => {
      if (answers[index] === undefined) return;
      if (answers[index] === q.correctOptionIndex) {
        correct++;
      } else {
        wrong++;
      }
    });

    const score = correct * quiz.marksPerQuestion - wrong * quiz.negativeMarks;
    return { correct, wrong, score };
  };

  const handleSubmit = () => {
    const { correct, wrong, score } = calculateScore();
    navigate(
      `/student-dashboard/${subjectId}/${topicId}/quiz/${quizId}/result`,
      {
        state: {
          totalQuestions: quiz.questions.length,
          correct,
          wrong,
          score,
          quizTitle: quiz.title,
          questions: quiz.questions,
          answers,
        },
      }
    );
  };

  if (!quiz) return <div className="p-6">Loading quiz...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{quiz.title}</h2>
      <div className="mb-4 text-right text-red-500 font-semibold">
        Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {quiz.questions.map((q, qIndex) => (
          <div key={qIndex} className="mb-6 p-4 bg-white rounded shadow">
            <p className="font-medium mb-2">
              Q{qIndex + 1}: {q.questionText}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, optIndex) => (
                <label key={optIndex} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`question-${qIndex}`}
                    value={optIndex}
                    checked={answers[qIndex] === optIndex}
                    onChange={() => handleAnswerSelect(qIndex, optIndex)}
                    className="accent-blue-500"
                  />
                  {opt.text}
                </label>
              ))}
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Submit Quiz
        </button>
      </form>
    </div>
  );
}
