import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { getUserDetails, isAdmin } from "../utils/apiService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      fetchUserDetails();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserDetails = async () => {
    try {
      const userDetails = await getUserDetails();
      setUser(userDetails);
      setIsAuthenticated(true);

      // Check if user is admin
      const adminCheck = await isAdmin();
      console.log("Admin check result:", adminCheck); // Debug log
      setIsAdminUser(adminCheck.isAdmin);
      return adminCheck.isAdmin; // Return the admin status
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      setIsAuthenticated(false);
      setIsAdminUser(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (token, rememberMe) => {
    if (rememberMe) {
      localStorage.setItem("token", token);
      sessionStorage.removeItem("token");
    } else {
      sessionStorage.setItem("token", token);
      localStorage.removeItem("token");
    }
    setIsAuthenticated(true);
    setLoading(true);

    try {
      const isAdmin = await fetchUserDetails(); // Get the admin status
      console.log("Is admin user:", isAdmin); // Debug log

      // Navigate based on admin status
      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setIsAuthenticated(false);
    setIsAdminUser(false);
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isAdminUser, user, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
