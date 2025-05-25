import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";

export default function MovieCard({ id, title, rating, ageRating, image }) {
  return (
    <Link
      to={`/movies/${id}`}
      className="block rounded-lg shadow-lg text-white hover:shadow-2xl transition-transform duration-300 transform hover:scale-105"
    >
      {/* Movie Poster */}
      <div className="relative overflow-hidden rounded-t-lg w-full h-64 md:h-80 lg:h-96">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>

      {/* Movie Details */}
      <div
        className="p-4 bg-gray-800/75 backdrop-blur-md rounded-b-lg"
        style={{
          backgroundColor: "rgba(45, 45, 45, 0.75)", // Dark gray with transparency
        }}
      >
        {/* Title */}
        <h3 className="text-lg font-semibold truncate">{title}</h3>

        {/* Rating and Age */}
        <div className="flex items-center justify-between mt-2 text-sm">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-500" />
            <span>{rating}/10</span>
          </div>
          {/* Age Rating */}
          <span className="px-2 py-1 bg-gray-700 rounded-md">{ageRating}</span>
        </div>

        {/* Status */}
        <p className="mt-4 text-sm text-green-400 font-medium">Now Screening</p>
      </div>
    </Link>
  );
}

MovieCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  ageRating: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
};
