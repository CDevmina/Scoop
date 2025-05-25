import { useNavigate, useLocation } from "react-router-dom";
import BookingQRCode from "../components/QRcode";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state?.booking;

  const handleDone = () => {
    navigate("/");
  };

  if (!booking) {
    return navigate("/");
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        {/* Success Header */}
        <div className="bg-green-700 p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">Booking Confirmed!</h1>
        </div>

        {/* Booking Details */}
        <div className="p-6 space-y-6">
          {/* Movie Details */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Movie Details
                </h2>
                <div className="space-y-2 text-gray-300">
                  <p>
                    <span className="text-gray-400">Movie:</span>{" "}
                    {booking.movieTitle}
                  </p>
                  <p>
                    <span className="text-gray-400">Theatre:</span>{" "}
                    {booking.theatreType}
                  </p>
                  <p>
                    <span className="text-gray-400">Location:</span>{" "}
                    {booking.cinemaLocation}
                  </p>
                  <p>
                    <span className="text-gray-400">Date:</span> {booking.date}
                  </p>
                  <p>
                    <span className="text-gray-400">Time:</span> {booking.time}
                  </p>
                </div>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Booking Details
                </h2>
                <div className="space-y-2 text-gray-300">
                  <p>
                    <span className="text-gray-400">Booking Number:</span>{" "}
                    {booking.bookingNumber}
                  </p>
                  <p>
                    <span className="text-gray-400">Seats:</span>{" "}
                    {booking.seats.join(", ")}
                  </p>
                  <p>
                    <span className="text-gray-400">Total Amount:</span> LKR{" "}
                    {booking.amount}
                  </p>
                  <p>
                    <span className="text-gray-400">Created:</span>{" "}
                    {new Date(booking.createdAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="text-center">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Scan QR Code
                </h2>
                <BookingQRCode bookingNumber={booking.bookingNumber} />
                <p className="text-sm text-gray-400 mt-2">
                  Show this QR code at the cinema
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700 p-6">
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={handleDone}
              className="px-8 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-300"
            >
              Done
            </button>
            <p className="text-sm text-gray-400">
              Need help? Contact us at{" "}
              <span className="text-white">+94 76 208 3065 - (Gagana)</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
