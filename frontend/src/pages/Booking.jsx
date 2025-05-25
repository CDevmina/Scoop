import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/BookingButton";
import { getMovies } from "../utils/apiService";

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const movieQuery = queryParams.get("movie");

  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState("All Movies");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedDate, setSelectedDate] = useState("All Dates");
  const [availableDates, setAvailableDates] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const moviesData = await getMovies();
        setMovies(moviesData);

        const dates = extractDates(moviesData);
        setAvailableDates(dates);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    if (movieQuery) {
      setSelectedMovie(movieQuery);
    }
  }, [movieQuery]);

  const extractDates = (movies) => {
    let dates = [];
    movies.forEach((movie) => {
      movie.cinemas.forEach((cinema) => {
        cinema.formats.forEach((format) => {
          format.showtimes.forEach((time) => {
            dates.push(time.date);
          });
        });
      });
    });

    // Remove duplicates and sort dates
    dates = [...new Set(dates)].sort((a, b) => new Date(a) - new Date(b));
    return dates;
  };

  return (
    <div
      style={{
        paddingLeft: "130px",
        paddingRight: "130px",
        paddingTop: "20px",
        color: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1
          style={{
            fontSize: "70px",
            borderBottom: "2px solid white",
            paddingBottom: "1px",
            marginBottom: "20px",
          }}
        >
          BUY TICKETS
        </h1>
        <div style={{ display: "flex", gap: "20px" }}>
          {/* Movie Dropdown */}
          <select
            value={selectedMovie}
            onChange={(e) => setSelectedMovie(e.target.value)}
            style={dropdownStyle}
          >
            <option>All Movies</option>
            {movies.map((movie, index) => (
              <option key={index} value={movie.title}>
                {movie.title}
              </option>
            ))}
          </select>
          {/* Location Dropdown */}
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            style={dropdownStyle}
          >
            <option>All Locations</option>
            {[
              ...new Set(
                movies.flatMap((movie) =>
                  movie.cinemas.map((cinema) => cinema.name)
                )
              ),
            ].map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </select>
          {/* Date Dropdown */}
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={dropdownStyle}
          >
            <option>All Dates</option>
            {availableDates.map((date, index) => (
              <option key={index} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filtered Movies */}
      {movies
        .filter(
          (movie) =>
            selectedMovie === "All Movies" || movie.title === selectedMovie
        )
        .filter(
          (movie) =>
            selectedLocation === "All Locations" ||
            movie.cinemas.some((cinema) => cinema.name === selectedLocation)
        )
        .filter(
          (movie) =>
            selectedDate === "All Dates" ||
            movie.cinemas.some((cinema) =>
              cinema.formats.some((format) =>
                format.showtimes.some((time) => time.date === selectedDate)
              )
            )
        )
        .map((movie, index) => (
          <div key={index} style={{ marginBottom: "60px" }}>
            <h2 style={{ fontSize: "50px" }}>{movie.title}</h2>

            {movie.cinemas
              .filter(
                (cinema) =>
                  selectedLocation === "All Locations" ||
                  cinema.name === selectedLocation
              )
              .filter(
                (cinema) =>
                  selectedDate === "All Dates" ||
                  cinema.formats.some((format) =>
                    format.showtimes.some((time) => time.date === selectedDate)
                  )
              )
              .map((cinema, cIndex) => (
                <div key={cIndex} style={{ marginBottom: "30px" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <p style={{ fontSize: "20px", marginTop: "-10px" }}>
                      {cinema.name}
                    </p>
                    <div
                      style={{
                        height: "2px",
                        backgroundColor: "white",
                        width: "100%",
                        maxWidth: "450px",
                        margin: "10px 0",
                      }}
                    ></div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "20px",
                        alignItems: "center",
                      }}
                    >
                      {cinema.formats
                        .filter(
                          (format) =>
                            selectedDate === "All Dates" ||
                            format.showtimes.some(
                              (time) => time.date === selectedDate
                            )
                        )
                        .map((format, fIndex) => (
                          <div key={fIndex}></div>
                        ))}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                      }}
                    >
                      {cinema.formats
                        .filter((format) =>
                          format.showtimes.some(
                            (time) =>
                              selectedDate === "All Dates" ||
                              time.date === selectedDate
                          )
                        )
                        .map((format, fIndex) => (
                          <div key={fIndex} style={{ marginBottom: "20px" }}>
                            {/* Format Heading */}
                            <strong
                              style={{
                                fontSize: "18px",
                                display: "block",
                                marginBottom: "10px",
                              }}
                            >
                              {format.type}
                            </strong>
                            {/* Buttons for Times */}
                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                                flexWrap: "wrap",
                              }}
                            >
                              {format.showtimes
                                .filter(
                                  (time) =>
                                    selectedDate === "All Dates" ||
                                    time.date === selectedDate
                                )
                                .map((time, tIndex) => (
                                  <Button
                                    key={tIndex}
                                    label={`${time.time} on ${time.date}`}
                                    size="medium"
                                    fontSize="18px"
                                    fontFamily="'Bebas Neue', sans-serif"
                                    onClick={() =>
                                      navigate(
                                        `/seats?showtimeId=${encodeURIComponent(
                                          time.showtimeId
                                        )}`
                                      )
                                    }
                                  />
                                ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ))}
    </div>
  );
};

const dropdownStyle = {
  fontSize: "18px",
  padding: "10px",
  borderRadius: "5px",
  border: "none",
  background: "#222",
  color: "white",
  fontFamily: "'Bebas Neue', sans-serif",
  cursor: "pointer",
};

export default Booking;
