import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute() {
  const {
    authState: { status },
  } = useAuth(); // Get current auth state

  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") return <Navigate to="/login" />;

  return <Outlet />; // Shows protected content
}
