import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import AuthContext from "../context/AuthContext";

const Layout = () => {
  const { isAdminUser } = useContext(AuthContext);

  if (isAdminUser) {
    return <Navigate to="/admin" replace />;
  }
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
