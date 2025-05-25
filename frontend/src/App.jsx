import { Routes, Route } from "react-router-dom";

// Page Imports
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import MovieDetails from "./pages/MovieDetails";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Movies from "./pages/Movies";

// Protected Pages
import Profilepages from "./pages/Profilepages";
import UpdateProfile from "./pages/UpdateProfile";
import BookingPage from "./pages/Booking";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import BookingHistoryPage from "./pages/bookinghistorypage";
import Seats from "./pages/Seats";
import Payment from "./pages/Payment";
import Accept from "./pages/Accept";
import Decline from "./pages/Decline";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard.jsx";

// Components
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <Routes>
      {/* Protected Admin Routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Route>

      <Route element={<Layout />}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/movies/:id" element={<MovieDetails />} />

        {/* Protected User Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profilepages />} />
          <Route path="/editprofile" element={<UpdateProfile />} />
          <Route path="/changepass" element={<ChangePasswordPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/seats" element={<Seats />} />
          <Route path="/tickets" element={<BookingHistoryPage />} />
          <Route path="/checkout" element={<Payment />} />
          <Route path="/accept" element={<Accept />} />
          <Route path="/decline" element={<Decline />} />
        </Route>
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
