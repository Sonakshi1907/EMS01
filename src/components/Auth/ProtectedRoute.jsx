import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

function ProtectedRoute({ allowedRole }) {
  const { currentUser } = useAuth();

  // User login nahi hai.
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // User logged in hai, lekin required role nahi hai.
  if (allowedRole && currentUser.role !== allowedRole) {
    const correctPath = currentUser.role === "admin" ? "/admin" : "/employee";

    return <Navigate to={correctPath} replace />;
  }

  // Authorized user ko nested route render karne do.
  return <Outlet />;
}

export default ProtectedRoute;
