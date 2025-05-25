import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieById } from "../utils/apiService";
import Button from "../components/Button";
import CustomTable from "../components/CustomTable";
import LoadingScreen from "../components/LoadingScreen";
import { useNavigate } from "react-router-dom";

//Static images
import cinema1 from "../assets/Cinemas/cinema1.png";
import cinema2 from "../assets/Cinemas/cinema2.png";
import cinema3 from "../assets/Cinemas/cinema3.png";

const MovieDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const movieData = await getMovieById(id);
        setMovie(movieData);
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
      }
    };

    fetchMovie();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!movie) {
    return <LoadingScreen />;
  }

  return (
    <div className="font-sans text-white bg-primary">
      {/* Header Section */}
      <div className="relative">
        <div className="w-full h-[50vh] md:h-[75vh] lg:h-[100vh] relative">
          <img
            src={movie.tallBanner}
            alt={movie.title}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </div>
        <div className="absolute bottom-0 left-0 p-4 md:pl-32 md:pb-28">
          <p className="text-lg md:text-2xl lg:text-3xl leading-tight">
            NOW SCREENING
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-8xl leading-tight text-shadow">
            {movie.title}
          </h1>
          <p className="text-base md:text-lg lg:text-xl mt-2">{movie.genre}</p>
          <p className="text-sm md:text-base lg:text-lg mt-2 mb-2">
            {movie.duration} MIN |{" "}
            <span className="text-yellow-500">{movie.rating}/10</span>
          </p>
          <div className="flex flex-col gap-2">
            <Button
              text="BUY TICKETS"
              size="large"
              onClick={() =>
                navigate(`/booking?movie=${encodeURIComponent(movie.title)}`)
              }
            />
            <Button text="WATCH TRAILER" url="/trailer" size="large" />
          </div>
        </div>
      </div>

      {/* Storyline and Cast Section */}
      <div className="flex flex-wrap justify-between p-4 md:pl-32 md:pt-8">
        {/* Storyline Section */}
        <div className="w-full md:w-1/2 pr-4">
          <h2 className="text-xl md:text-2xl lg:text-3xl mb-4">Storyline</h2>
          <p className="max-w-full md:max-w-2xl text-gray-400">
            {movie.description}
          </p>
          <div className="inline-block">
            <p className="mt-4 font-bold">GENRES: {movie.genre}</p>
            <div className="border-b-2 w-full mt-2"></div>
          </div>

          {/* Showing Info */}
          <div className="mt-8 py-6 md:py-10">
            <h3 className="text-lg md:text-xl lg:text-2xl">Now Showing At</h3>
            <div className="flex space-x-4 mt-4">
              <img
                src={cinema1}
                alt="Cinema 1"
                className="w-16 h-16 md:w-24 md:h-24 object-contain rounded"
              />
              <img
                src={cinema2}
                alt="Cinema 2"
                className="w-16 h-16 md:w-24 md:h-24 object-contain rounded"
              />
              <img
                src={cinema3}
                alt="Cinema 3"
                className="w-16 h-16 md:w-24 md:h-24 object-contain rounded"
              />
            </div>
          </div>
        </div>

        {/* Cast Section */}
        <div className="w-full md:w-1/2">
          <CustomTable director={movie.director} actors={movie.actors} />
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
