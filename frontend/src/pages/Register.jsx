import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "student",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, email, password, role } = formData;
  
    try {
      console.log("Creating Firebase user...");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
  
      console.log("Firebase user created:", firebaseUser.uid);
      await updateProfile(firebaseUser, { displayName: fullName });
      console.log("Firebase profile updated");
  
      console.log("Sending data to MongoDB...");
      const response = await axios.post("http://localhost:5000/api/users/register", {
        email,
        role,
        firebase_uid: firebaseUser.uid,
      });
      console.log("MongoDB response:", response.data);
  
      alert("User registered successfully!!");
      navigate("/login");
    } catch (error) {
      console.log("Error occurred during registration");
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white px-8 py-10 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">QuizMaster</h2>
        <p className="text-center text-sm text-gray-500 mb-6">Register to get started</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="role"
                value="student"
                checked={formData.role === "student"}
                onChange={handleChange}
                className="mr-1"
              />
              Student
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="role"
                value="instructor"
                checked={formData.role === "instructor"}
                onChange={handleChange}
                className="mr-1"
              />
              Instructor
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-2 rounded-lg font-semibold"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account? <a href="/login" className="text-blue-600 font-medium">Sign in</a>
        </p>
      </div>
    </div>
  );
}
