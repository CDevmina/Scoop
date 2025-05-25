import { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock } from "react-icons/fa";
import styles from "./CSS/Seats.module.css";
import { getShowtimeDetails } from "../utils/apiService";
import ShowtimeSelection from "../components/ShowtimeSelection";
import SeatGrid from "../components/SeatGrid";
import TicketSelection from "../components/TicketSelection";
import ActionButtons from "../components/ActionButtons";
import LoadingScreen from "../components/LoadingScreen";
import { getSocketIO } from "../utils/socketUtil";
import {
  createSession,
  fetchSession,
  updateSession,
  clearSession,
} from "../utils/sessionService";

const SeatsPage = () => {
  const [timeLeft, setTimeLeft] = useState(900);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [adultTickets, setAdultTickets] = useState(0);
  const [childTickets, setChildTickets] = useState(0);
  const [showtimeDetails, setShowtimeDetails] = useState(null);
  const [lockedSeats, setLockedSeats] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const socket = getSocketIO();

  const queryParams = new URLSearchParams(location.search);
  const showtimeId = queryParams.get("showtimeId");

  const rows = 10;
  const cols = 23;

  const seats = useMemo(
    () =>
      Array.from({ length: rows }, (_, rowIndex) =>
        Array.from({ length: cols }, (_, colIndex) => {
          if (colIndex === 5 || colIndex === 11 || colIndex === 17) {
            return null;
          }
          return `${String.fromCharCode(65 + rowIndex)}${colIndex + 1}`;
        })
      ),
    [rows, cols]
  );

  useEffect(() => {
    const fetchShowtimeDetails = async () => {
      try {
        const details = await getShowtimeDetails(showtimeId);
        setShowtimeDetails(details);
        console.log("Showtime details:", details);
      } catch (error) {
        console.error("Failed to fetch showtime details:", error);
      }
    };

    if (showtimeId) {
      fetchShowtimeDetails();
    }
  }, [showtimeId]);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const existingSessionId = sessionStorage.getItem("bookingSessionId");

        if (existingSessionId) {
          // Try to fetch existing session
          try {
            const existingSession = await fetchSession();

            // Check if session is for current showtime
            if (existingSession && existingSession.showtimeId === showtimeId) {
              // Use existing session
              setSelectedSeats(existingSession.selectedSeats);
              setAdultTickets(existingSession.adultTickets);
              setChildTickets(existingSession.childTickets);
              return;
            }

            // If different showtime, clear old session
            sessionStorage.removeItem("bookingSessionId");
          } catch (error) {
            // Session fetch failed, clear invalid session
            sessionStorage.removeItem("bookingSessionId");
            throw error;
          }
        }

        // Create new session
        await createSession({
          showtimeId,
          selectedSeats: [],
          adultTickets: 0,
          childTickets: 0,
        });

        // Initialize with empty state
        setSelectedSeats([]);
        setAdultTickets(0);
        setChildTickets(0);
      } catch (error) {
        console.error("Failed to load session:", error);
      }
    };

    if (showtimeId) {
      loadSession();
    }
  }, [showtimeId]);

  useEffect(() => {
    const updateSessionData = async () => {
      try {
        await updateSession({
          showtimeId,
          selectedSeats,
          adultTickets,
          childTickets,
        });
      } catch (error) {
        console.error("Failed to update session:", error);
      }
    };

    updateSessionData();
  }, [showtimeId, selectedSeats, adultTickets, childTickets]);

  useEffect(() => {
    if (timeLeft <= 0) {
      clearSession();
      alert("Session expired! Redirecting to home page.");
      navigate("/");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue =
        "Are you sure you want to leave? This will cancel the booking session.";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("timeLeft", timeLeft.toString());
  }, [timeLeft]);

  useEffect(() => {
    const handleNavigation = (event) => {
      if (
        !window.confirm(
          "Are you sure you want to leave? This will cancel the booking session."
        )
      ) {
        event.preventDefault();
      } else {
        clearSession();
      }
    };

    window.addEventListener("popstate", handleNavigation);

    return () => {
      window.removeEventListener("popstate", handleNavigation);
    };
  }, [navigate]);

  const handleSeatClick = (seat) => {
    if (showtimeDetails?.bookedSeats.includes(seat)) return;

    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
      setAdultTickets(adultTickets - 1);
    } else {
      if (selectedSeats.length < 6) {
        setSelectedSeats([...selectedSeats, seat]);
        setAdultTickets(adultTickets + 1);
      } else {
        alert("You can only select up to 6 seats.");
      }
    }
  };

  useEffect(() => {
    // Join the showtime room
    socket.emit("join-showtime", showtimeId);

    // Listen for seat lock events
    socket.on("seats-locked", ({ seats, sessionId }) => {
      const currentSessionId = sessionStorage.getItem("bookingSessionId");

      // Only lock seats if they're from a different session
      if (sessionId !== currentSessionId) {
        setLockedSeats((prevLockedSeats) => [...prevLockedSeats, ...seats]);
        console.log("Seats locked:", seats);
      }
    });

    // Listen for seat unlock events
    socket.on("seats-unlocked", ({ seats, sessionId }) => {
      const currentSessionId = sessionStorage.getItem("bookingSessionId");

      // Only unlock seats if they're from a different session
      if (sessionId !== currentSessionId) {
        setLockedSeats((prevLockedSeats) =>
          prevLockedSeats.filter((seat) => !seats.includes(seat))
        );
        console.log("Seats unlocked:", seats);
      }
    });

    // Listen for seats booked events
    socket.on("seats-booked", ({ seats }) => {
      setShowtimeDetails((prevDetails) => ({
        ...prevDetails,
        bookedSeats: [...prevDetails.bookedSeats, ...seats],
      }));
      console.log("Seats booked:", seats);
    });

    // Cleanup on component unmount
    return () => {
      socket.emit("leave-showtime", showtimeId);
      socket.off("seats-locked");
      socket.off("seats-unlocked");
      socket.off("seats-booked");
    };
  }, [socket, showtimeId]);

  if (!showtimeDetails) {
    return <LoadingScreen />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <h1 className={styles.title}>{showtimeDetails.movieTitle}</h1>
          <div className={styles.timerBox}>
            <span>
              {Math.floor(timeLeft / 60)}:{("0" + (timeLeft % 60)).slice(-2)}
            </span>
          </div>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.showtimeDetails}>
          <div className={styles.detailItem}>
            <FaMapMarkerAlt className={styles.icon} />
            <span className={styles.detailText}>
              {showtimeDetails.cinemaLocation}
            </span>
          </div>
          <div className={styles.detailItem}>
            <FaCalendarAlt className={styles.icon} />
            <span className={styles.detailText}>{showtimeDetails.date}</span>
          </div>
          <div className={styles.detailItem}>
            <FaClock className={styles.icon} />
            <span className={styles.detailText}>
              {showtimeDetails.theatreType}
            </span>
          </div>
        </div>

        <div className={styles.divider}></div>

        <ShowtimeSelection selectedShowtime={showtimeDetails.time} />

        <div className={styles.divider}></div>

        <SeatGrid
          seats={seats}
          selectedSeats={selectedSeats}
          reservedSeats={showtimeDetails.bookedSeats}
          lockedSeats={lockedSeats}
          handleSeatClick={handleSeatClick}
        />

        <TicketSelection
          selectedSeats={selectedSeats}
          adultTickets={adultTickets}
          setAdultTickets={setAdultTickets}
          childTickets={childTickets}
          setChildTickets={setChildTickets}
          ADULT_PRICE={showtimeDetails.adultTicketPrice}
          CHILD_PRICE={showtimeDetails.kidTicketPrice}
        />

        <div className={styles.divider}></div>

        <ActionButtons
          selectedSeats={selectedSeats}
          disabled={selectedSeats.length !== adultTickets + childTickets}
          onBack={() => {
            clearSession();
            navigate(-1);
          }}
        />
      </div>
    </div>
  );
};

export default SeatsPage;
