import { useState, useEffect } from "react";
import axios from "axios";

export default function TopicForm({ subjectId, onTopicCreated, editingTopic, onCancelEdit }) {
  const [topicName, setTopicName] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (editingTopic) {
      setTopicName(editingTopic.name);
    }
  }, [editingTopic]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", topicName);
    if (image) formData.append("image", image);
    formData.append("subjectId", subjectId);

    try {
      if (editingTopic) {
        await axios.put(`http://localhost:5000/api/topics/${editingTopic._id}`, formData);
      } else {
        await axios.post("http://localhost:5000/api/topics", formData);
      }

      setTopicName("");
      setImage(null);
      onTopicCreated();
      onCancelEdit(); // Clear edit state
    } catch (err) {
      console.error("Error submitting topic:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded p-4 max-w-md">
      <h3 className="text-lg font-semibold mb-2">{editingTopic ? "Edit Topic" : "Create Topic"}</h3>
      <input
        type="text"
        placeholder="Topic Name"
        value={topicName}
        onChange={(e) => setTopicName(e.target.value)}
        required
        className="w-full mb-2 px-3 py-2 border rounded"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        className="w-full mb-2"
      />
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {editingTopic ? "Update" : "Create"}
        </button>
        {editingTopic && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="bg-gray-300 text-black px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}


 
