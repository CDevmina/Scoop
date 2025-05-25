import { useState, useEffect } from "react";
import Breadcrumb from "../components/Breadcrumb";
import MovieCard from "../components/MovieCard";
import { getMovies } from "../utils/apiService";
import LoadingScreen from "../components/LoadingScreen";

export default function Movies() {
  const [nowShowingMovies, setNowShowingMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const moviesData = await getMovies();
        setNowShowingMovies(moviesData);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      }
    };

    fetchMovies();
  }, []);

  if (!nowShowingMovies) {
    return <LoadingScreen />;
  }

  return (
    <div className="MoviesContainer container mb-4">
      <div className="mt-6">
        <Breadcrumb
          pageTitle="Movies"
          breadcrumbNav={[
            { label: "Home", link: "/" },
            { label: "Movies", current: true },
          ]}
        />
      </div>

      {/* Now Showing Section */}
      <div className="mt-10">
        <h2 className="text-3xl font-bold text-center mb-8">Now Showing</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {nowShowingMovies.map((movie) => (
            <MovieCard
              key={movie._id}
              id={movie._id}
              title={movie.title}
              rating={movie.rating}
              ageRating={movie.ageRating}
              image={movie.tallBanner}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
