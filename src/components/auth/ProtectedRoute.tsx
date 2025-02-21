import { useAppSelector } from "@/app/hook";
import { Navigate, useLocation } from "react-router";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location?.state?.from || "/" }}
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
