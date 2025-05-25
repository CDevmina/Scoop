import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import LoadingScreen from "./LoadingScreen";

const PrivateRoute = () => {
  const { isAuthenticated, loading, isAdminUser } = useContext(AuthContext);

  if (loading) {
    return <LoadingScreen />;
  }

  if (isAdminUser) {
    return <Navigate to="/admin" replace />;
  }

  // Regular users must be authenticated
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
