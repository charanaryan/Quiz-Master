// src/pages/TopicPage.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import QuizCard from '../components/Quiz/QuizCard';
import QuizForm from '../components/Quiz/QuizForm';

const TopicPage = () => {
  const { subjectId, topicId } = useParams();
  const [quizzes, setQuizzes] = useState([]);

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/quizzes/topic/${topicId}`);
      setQuizzes(res.data);
    } catch (error) {
      console.error('Failed to fetch quizzes', error);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [topicId]);

  const handleQuizCreated = () => {
    fetchQuizzes(); // refresh list after new quiz is created
  };

  const handleQuizDelete = (deletedId) => {
    setQuizzes((prev) => prev.filter((quiz) => quiz._id !== deletedId));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Quizzes</h2>

      <div className="mb-6">
        <QuizForm
          subjectId={subjectId}
          topicId={topicId}
          onQuizCreated={handleQuizCreated}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quizzes.map((quiz) => (
          <QuizCard
            key={quiz._id}
            quiz={quiz}
            subjectId={subjectId}
            topicId={topicId}
            mode="instructor"
            onDelete={handleQuizDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default TopicPage;
