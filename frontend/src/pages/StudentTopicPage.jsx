import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import QuizCard from "../components/Quiz/QuizCard";

const StudentTopicPage = () => {
  const { subjectId, topicId } = useParams();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [topicTitle, setTopicTitle] = useState("");

  useEffect(() => {
    // Fetch quizzes under the topic
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/quizzes/topic/${topicId}`
        );
        setQuizzes(response.data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    // Fetch topic title
    const fetchTopic = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/topics/${topicId}`
        );
        setTopicTitle(response.data.title);
      } catch (error) {
        console.error("Error fetching topic:", error);
      }
    };

    fetchTopic();
    fetchQuizzes();
  }, [topicId]);

  const handleQuizClick = (quizId) => {
    navigate(
      `/student-dashboard/${subjectId}/${topicId}/quiz/${quizId}`
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Quizzes in: {topicTitle}</h2>
      {quizzes.length === 0 ? (
        <p>No quizzes available for this topic.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((quiz) => (
            <div key={quiz._id} onClick={() => handleQuizClick(quiz._id)} className="cursor-pointer">
              <QuizCard quiz={quiz} mode="student" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentTopicPage;
