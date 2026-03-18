import { Navigate } from "react-router-dom";
import type { JSX } from "react";
import useAuth from "../context/use-auth";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}