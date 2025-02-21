import { useAppSelector } from "@/app/hook";
import { Navigate, Outlet, useLocation } from "react-router";

// ProtectedRoute component for pages that require authentication
const ProtectedRoute = () => {
  const { user, loading } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
