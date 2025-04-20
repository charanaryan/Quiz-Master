// src/pages/StudentSubjectPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import TopicCard from "../components/Topic/TopicCard";

export default function StudentSubjectPage() {
  const { subjectId } = useParams();
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/topics/${subjectId}`);

        setTopics(res.data);
      } catch (err) {
        console.error("Failed to fetch topics", err);
      }
    };

    fetchTopics();
  }, [subjectId]);

  return (
    <div className="min-h-screen p-6 bg-white">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Topics</h2>

      {topics.length === 0 ? (
        <p className="text-gray-500">No topics available under this subject yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <TopicCard key={topic._id} topic={topic} subjectId={subjectId} studentView />
          ))}
        </div>
      )}
    </div>
  );
}