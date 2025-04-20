// components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem("userId"); // or however you store auth info

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
