// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, userData, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user || !userData) return <Navigate to="/login" />;

  if (!allowedRoles.includes(userData.role)) {
    // Redirect to their appropriate dashboard if they try to access a wrong one
    return <Navigate to={`/${userData.role}-dashboard`} />;
  }

  return children;
};

export default ProtectedRoute;
