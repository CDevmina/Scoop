import { useState, useContext } from "react";
import AddMovies from "../components/AddMovies";
import EditSchedule from "../components/ChangeSchedules";
import ManageBookings from "../components/ManageBookings";
import AuthContext from "../context/AuthContext";

function EditAdminSchedule() {
  return <EditSchedule />;
}

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Add Movies");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useContext(AuthContext);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#1a1a1a] text-white overflow-hidden">
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-black rounded-md"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isSidebarOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 right-0 transform ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } md:translate-x-0 transition duration-200 ease-in-out w-64 bg-black bg-opacity-70 backdrop-blur-md z-40`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
          <nav>
            <ul className="space-y-4">
              {["Add Movies", "Edit Schedule", "Manage Bookings"].map((tab) => (
                <li key={tab}>
                  <button
                    onClick={() => handleTabClick(tab)}
                    className={`w-full text-left py-2 px-4 rounded-lg transition-all duration-200 ${
                      activeTab === tab
                        ? "bg-red-600 hover:bg-red-700"
                        : "hover:bg-gray-800"
                    }`}
                  >
                    {tab}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto pt-4 border-t border-gray-700">
            <button
              onClick={logout}
              className="w-full text-left py-2 px-4 rounded-lg transition-all duration-200 hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        {activeTab === "Add Movies" && <AddMovies />}
        {activeTab === "Edit Schedule" && <EditAdminSchedule />}
        {activeTab === "Manage Bookings" && <ManageBookings />}
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default AdminDashboard;
