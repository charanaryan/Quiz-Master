import { React, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      const res = await axios.get(`http://localhost:5000/api/users/${firebaseUser.uid}`);
      const role = res.data.role;

      if (role === "instructor") {
        navigate("/instructor-dashboard");
        console.log("Successfully logged in as instructor!!s")

      } else if (role === "student") {
        navigate("/student-dashboard");
        console.log("Successfully logged in as student!!")
      } else {
        alert("Unknown role");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Failed to log in.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white px-8 py-10 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">QuizMaster</h2>
        <p className="text-center text-sm text-gray-500 mb-6">Sign in to your account</p>
        <form onSubmit={handleLogin} className="space-y-4">
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
          <div className="flex justify-between items-center text-sm text-gray-600">
            <label className="flex items-center space-x-1">
              <input type="checkbox" className="form-checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-blue-600">Forgot your password?</a>
          </div>
          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-2 rounded-lg font-semibold"
          >
            Sign in
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Don’t have an account? <a href="/" className="text-blue-600 font-medium">Register here</a>
        </p>
      </div>
    </div>
  );
}
