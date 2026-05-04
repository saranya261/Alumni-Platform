import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (user === null) return <div className="p-12 font-serif text-2xl">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
