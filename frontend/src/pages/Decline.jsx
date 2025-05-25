import { useNavigate, useLocation } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const error = location.state?.error || "An unknown error occurred";

  const handleTryAgain = () => {
    navigate("/booking");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-center text-white max-w-2xl px-4">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-700 text-red-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">PAYMENT DECLINED</h1>
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-6">
          <p className="text-lg text-red-200">{error}</p>
        </div>
        <button
          onClick={handleTryAgain}
          className="mt-8 px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300"
        >
          Try Again
        </button>
        <p className="text-base text-gray-400 mt-6">
          Need help? Contact Scoop Cinemas on
          <span className="font-medium text-gray-100">
            {" "}
            +94 76 208 3065 - (Gagana){" "}
          </span>
        </p>
      </div>
    </div>
  );
}

export default App;
