// src/pages/SubjectPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import TopicForm from "../components/Topic/TopicForm";
import TopicCard from "../components/Topic/TopicCard";

export default function SubjectPage() {
  const { subjectId } = useParams();
  const [subject, setSubject] = useState(null);
  const [topics, setTopics] = useState([]);
  const [editingTopic, setEditingTopic] = useState(null);

  const fetchSubject = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/subjects/${subjectId}`);
      setSubject(res.data);
    } catch (err) {
      console.error("Error fetching subject:", err);
    }
  };

  const fetchTopics = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/topics/${subjectId}`);

      setTopics(res.data);
    } catch (err) {
      console.error("Error fetching topics:", err);
    }
  };

  useEffect(() => {
    fetchSubject();
    fetchTopics();
  }, [subjectId]);

  const handleEditTopic = (topic) => {
    setEditingTopic(topic);
  };

  const handleDeleteTopic = async (id) => {
    if (window.confirm("Are you sure you want to delete this topic?")) {
      try {
        await axios.delete(`http://localhost:5000/api/topics/${id}`);
        fetchTopics();
      } catch (err) {
        console.error("Error deleting topic:", err);
      }
    }
  };

  return (
    <div className="p-6">
      {subject && (
        <>
          <h1 className="text-2xl font-bold mb-4">{subject.name}</h1>
          <img
            src={`http://localhost:5000/${subject.image}`}
            alt={subject.name}
            className="w-full max-w-md rounded shadow mb-6"
          />
        </>
      )}

      <TopicForm
        subjectId={subjectId}
        onTopicCreated={fetchTopics}
        editingTopic={editingTopic}
        onCancelEdit={() => setEditingTopic(null)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {topics.map((topic) => (
          <TopicCard
            key={topic._id}
            topic={topic}
            subjectId={subjectId}
            onEdit={() => handleEditTopic(topic)}
            onDelete={() => handleDeleteTopic(topic._id)}
          />
        ))}
      </div>
    </div>
  );
}