import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import LoadingScreen from "./LoadingScreen";

const AdminRoute = () => {
  const { isAuthenticated, loading, isAdminUser } = useContext(AuthContext);

  if (loading) {
    return <LoadingScreen />;
  }

  // Only allow authenticated admin users
  if (!isAuthenticated || !isAdminUser) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
