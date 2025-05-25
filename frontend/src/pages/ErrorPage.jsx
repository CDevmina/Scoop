import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const ErrorPage = ({ title, message, details }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary text-white p-4">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <p className="text-lg mb-4">{message}</p>
      {details && (
        <pre className="bg-secondary p-4 rounded mb-4">{details}</pre>
      )}
      <button
        onClick={() => navigate(-1)}
        className="bg-secondary text-white py-2 px-4 rounded hover:bg-red-700 transition"
      >
        Go Back
      </button>
    </div>
  );
};

ErrorPage.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  details: PropTypes.string,
};

export default ErrorPage;
