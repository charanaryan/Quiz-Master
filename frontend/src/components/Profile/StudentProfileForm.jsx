import { useState } from "react";
import axios from "axios";

export default function StudentProfileForm({ uid, onProfileCreated }) {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !bio || !profilePicture) {
      alert("Please fill all fields and select an image");
      return;
    }

    const formData = new FormData();
    formData.append("userId", uid);
    formData.append("name", name);
    formData.append("bio", bio);
    formData.append("profilePicture", profilePicture);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/student/profile", formData);
      setLoading(false);
      setSuccess(true);
      onProfileCreated(); // call parent to fetch profile
    } catch (error) {
      setLoading(false);
      console.error("Profile creation failed", error);
      alert("Profile creation failed");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Create Your Student Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded mt-1"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-4 py-2 border rounded mt-1"
            placeholder="Tell us something about yourself"
            rows={3}
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Profile Picture</label>
          <input
            type="file"
            onChange={(e) => setProfilePicture(e.target.files[0])}
            accept="image/*"
            className="mt-1"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Creating..." : "Create Profile"}
        </button>
      </form>

      {success && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 border border-green-400 rounded text-center">
          Profile created successfully!
        </div>
      )}
    </div>
  );
}
