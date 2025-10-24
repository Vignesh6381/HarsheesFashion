import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // ✅ use the hook instead of AuthContext

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth(); // ✅ get user from useAuth()

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
