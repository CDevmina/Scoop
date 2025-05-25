import { useState, useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useIsMobile } from "../utils/isMobile";
import Button from "../components/Button";
import MovieCard from "../components/MovieCard";
import { getMovies } from "../utils/apiService";
import LoadingScreen from "../components/LoadingScreen";

export default function Home() {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [movies, setMovies] = useState([]);
  const [heroBanners, setHeroBanners] = useState([]);
  const isMobile = useIsMobile();

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const moviesData = await getMovies();
        setMovies(moviesData);

        const banners = moviesData.map((movie) =>
          isMobile ? movie.tallBanner : movie.wideBanner
        );
        setHeroBanners(banners);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      }
    }
    fetchMovies();
  }, [isMobile]);

  const limitedBanners = heroBanners.slice(0, 3);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) =>
        prev === limitedBanners.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [limitedBanners]);

  const heroImage = limitedBanners[currentBannerIndex];

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft -= 200;
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += 200;
    }
  };

  if (!movies) {
    return <LoadingScreen />;
  }

  return (
    <div className="w-full min-h-screen bg-[#1a1a1a] text-white">
      {/* HERO SECTION */}
      <div
        className="relative w-full h-[80vh] overflow-hidden"
        style={{ backgroundColor: "#1a1a1a" }}
      >
        {heroImage && (
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
            style={{
              backgroundImage: `url(${heroImage})`,
              filter: "brightness(85%)",
            }}
          />
        )}
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 flex flex-col justify-center h-full p-8 md:p-16 max-w-5xl">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-3 drop-shadow-md">
            SCOOP CINEMA
          </h1>
          <p className="max-w-xl text-base md:text-xl drop-shadow-md mb-6">
            Immerse yourself in unforgettable cinematic journeys.
          </p>

          <div className="flex items-center space-x-4">
            <Button
              text="Buy Tickets"
              url="/booking"
              customStyles="hover:scale-105 transition-transform duration-200 ease-in-out"
            />
            <Button
              text="More Info"
              url="/movies"
              customStyles="
                bg-gray-500 text-white px-4 py-2 rounded-md 
                hover:bg-gray-600 transition-colors duration-300 
                hover:scale-105 ease-in-out 
                focus:outline-none active:outline-none
              "
            ></Button>
          </div>
        </div>

        {limitedBanners.length > 1 && (
          <div className="absolute bottom-6 w-full flex items-center justify-center gap-2 z-20">
            {limitedBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBannerIndex(index)}
                className={`
                  appearance-none focus:outline-none active:outline-none 
                  cursor-pointer w-8 h-2 rounded-full
                  hover:scale-105 transition-transform duration-200 ease-in-out
                  ${
                    index === currentBannerIndex
                      ? "bg-red-600"
                      : "bg-gray-400/70 hover:bg-gray-300/80"
                  }
                `}
              />
            ))}
          </div>
        )}
      </div>

      {/* NOW SHOWING SECTION */}
      <section
        className="mt-8 md:mt-12 mb-12"
        style={{
          backgroundColor: "#1a1a1a",
        }}
      >
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 relative">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Now Showing</h2>

          <button
            onClick={scrollLeft}
            className="
              absolute left-0 top-[40%] -translate-y-1/2 z-10 
              bg-black/50 hover:bg-black rounded-full p-3 text-white
              focus:outline-none active:outline-none appearance-none
            "
          >
            <FaChevronLeft size={30} />
          </button>

          <div
            ref={scrollContainerRef}
            className="flex space-x-4 p-2 -m-2 overflow-x-hidden scroll-smooth mb-8"
          >
            {movies.map((movie) => (
              <div
                key={movie._id}
                className="flex-shrink-0 w-36 md:w-48 lg:w-56 rounded overflow-hidden relative"
              >
                <MovieCard
                  id={movie._id}
                  title={movie.title}
                  rating={movie.rating}
                  ageRating={movie.ageRating}
                  image={movie.tallBanner}
                />
              </div>
            ))}
          </div>

          <button
            onClick={scrollRight}
            className="
              absolute right-0 top-[40%] -translate-y-1/2 z-10 
              bg-black/50 hover:bg-black rounded-full p-3 text-white
              focus:outline-none active:outline-none appearance-none
            "
          >
            <FaChevronRight size={30} />
          </button>
        </div>
      </section>

      {/* Footer Section */}
      <footer
        className="py-4 text-center"
        style={{
          backgroundColor: "#1a1a1a",
        }}
      ></footer>
    </div>
  );
}
