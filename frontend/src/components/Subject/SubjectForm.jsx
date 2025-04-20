import { useState, useEffect } from "react";
import axios from "axios";

export default function SubjectForm({ instructorId, onSubjectSaved, editingSubject, clearEdit }) {
  const [subjectName, setSubjectName] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (editingSubject) {
      setSubjectName(editingSubject.name);
      setImage(null); // Do not preload image file
    } else {
      setSubjectName("");
      setImage(null);
    }
  }, [editingSubject]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", subjectName);
    if (image) formData.append("image", image);
    formData.append("instructorId", instructorId);

    try {
      if (editingSubject) {
        await axios.put(`http://localhost:5000/api/instructor/subject/${editingSubject._id}`, formData);
        alert("Subject updated!");
      } else {
        await axios.post("http://localhost:5000/api/instructor/subject", formData);
        alert("Subject created!");
      }
      onSubjectSaved();
      clearEdit(); // Clear editing state
    } catch (err) {
      console.error("Error saving subject:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded-lg max-w-md">
      <h3 className="text-lg font-semibold mb-2">
        {editingSubject ? "Edit Subject" : "Create a New Subject"}
      </h3>
      <input
        type="text"
        placeholder="Subject Name"
        value={subjectName}
        onChange={(e) => setSubjectName(e.target.value)}
        className="w-full border px-3 py-2 rounded mb-2"
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        className="w-full mb-2"
      />
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {editingSubject ? "Update" : "Create"}
        </button>
        {editingSubject && (
          <button
            type="button"
            className="bg-gray-400 text-white px-4 py-2 rounded"
            onClick={clearEdit}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}