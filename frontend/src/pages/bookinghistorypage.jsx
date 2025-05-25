import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Breadcrumb from "../components/Breadcrumb.jsx";
import { getBookings } from "../utils/apiService";
import BookingQRCode from "../components/QRcode";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaCouch,
} from "react-icons/fa";
import { MdLocalMovies, MdTheaters } from "react-icons/md";
import LoadingScreen from "../components/LoadingScreen";

const BookingCard = ({ booking }) => {
  const isUpcoming = new Date(booking.showDate) > new Date();

  return (
    <div
      className={`
      bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 mb-6
      border border-white/10 shadow-xl
      transform transition-all duration-300 ease-in-out
      ${
        isUpcoming
          ? "hover:border-green-500/30 hover:shadow-green-500/10"
          : "hover:border-red-500/30 hover:shadow-red-500/10"
      }
    `}
    >
      {/* Main Grid Layout */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column - Movie & Booking Info */}
        <div className="md:col-span-2 space-y-6">
          {/* Header Section */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <MdLocalMovies className="text-red-500" />
                {booking.movieTitle}
              </h3>
              <p className="text-gray-400 mt-1 flex items-center gap-2">
                <FaTicketAlt className="text-red-500/70" />
                {booking.bookingNumber}
              </p>
            </div>
            <div
              className={`
              px-3 py-1 rounded-full text-sm font-medium
              ${
                isUpcoming
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }
            `}
            >
              {isUpcoming ? "Upcoming" : "Past"}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-red-500/70" />
                <span className="text-gray-300">{booking.showDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaClock className="text-red-500/70" />
                <span className="text-gray-300">{booking.showTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-red-500/70" />
                <span className="text-gray-300">{booking.cinemaLocation}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MdTheaters className="text-red-500/70" />
                <span className="text-gray-300">{booking.theatreType}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCouch className="text-red-500/70" />
                <span className="text-gray-300">
                  Seats: {booking.seats.join(", ")}
                </span>
              </div>
              <div className="text-xl font-bold text-white">
                LKR {booking.amount.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - QR Code */}
        <div className="flex flex-col items-center justify-center p-4 bg-black/30 rounded-lg">
          <p className="text-gray-400 mb-4">Show QR code at cinema</p>
          <BookingQRCode bookingNumber={booking.bookingNumber} />
        </div>
      </div>
    </div>
  );
};

const PaginationControls = ({ currentPage, pageCount, paginate }) => (
  <div className="flex justify-center items-center gap-2 my-8">
    <button
      onClick={() => paginate(currentPage - 1)}
      disabled={currentPage === 1}
      className={`px-4 py-2 rounded ${
        currentPage === 1
          ? "bg-white/5 text-white/50"
          : "bg-white/10 text-white hover:bg-white/20"
      }`}
    >
      Prev
    </button>
    {Array.from({ length: pageCount }).map((_, index) => (
      <button
        key={index}
        onClick={() => paginate(index + 1)}
        className={`px-4 py-2 rounded ${
          currentPage === index + 1
            ? "bg-white text-primary"
            : "bg-white/10 text-white hover:bg-white/20"
        }`}
      >
        {index + 1}
      </button>
    ))}
    <button
      onClick={() => paginate(currentPage + 1)}
      disabled={currentPage === pageCount}
      className={`px-4 py-2 rounded ${
        currentPage === pageCount
          ? "bg-white/5 text-white/50"
          : "bg-white/10 text-white hover:bg-white/20"
      }`}
    >
      Next
    </button>
  </div>
);

const BookingHistoryPage = () => {
  const [currentPageOngoing, setCurrentPageOngoing] = useState(1);
  const [currentPagePrevious, setCurrentPagePrevious] = useState(1);
  const [bookings, setBookings] = useState([]);
  const cardsPerPage = 4;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingsData = await getBookings();
        setBookings(bookingsData);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  const currentDate = React.useMemo(() => new Date(), []);

  const currentBookings = React.useMemo(
    () =>
      bookings
        .filter((booking) => new Date(booking.showDate) > currentDate)
        .sort((a, b) => new Date(a.showDate) - new Date(b.showDate)),
    [bookings, currentDate]
  );

  const previousBookings = React.useMemo(
    () =>
      bookings
        .filter((booking) => new Date(booking.showDate) <= currentDate)
        .sort((a, b) => new Date(b.showDate) - new Date(a.showDate)),
    [bookings, currentDate]
  );

  const currentCards = currentBookings.slice(
    (currentPageOngoing - 1) * cardsPerPage,
    currentPageOngoing * cardsPerPage
  );

  const previousCards = previousBookings.slice(
    (currentPagePrevious - 1) * cardsPerPage,
    currentPagePrevious * cardsPerPage
  );

  const paginateCurrent = (pageNumber) => {
    setCurrentPageOngoing(pageNumber);
    window.scrollTo(0, 0);
  };

  const paginatePrevious = (pageNumber) => {
    setCurrentPagePrevious(pageNumber);
    window.scrollTo(0, 0);
  };

  if (!bookings) {
    return <LoadingScreen />;
  }

  return (
    <div className="w-full min-h-screen bg-primary">
      <div className="container mx-auto w-full md:w-[75%] px-4 md:px-[15px] pt-4 md:pt-8 pb-8">
        <div className="w-full min-h-screen bg-primary">
          <div className="container mx-auto w-full md:w-[75%] px-4 md:px-[15px] pt-4 md:pt-8 pb-8">
            {/* Breadcrumb */}
            <div className="mb-4">
              <Breadcrumb
                pageTitle="BOOKING HISTORY"
                breadcrumbNav={[
                  { label: "Home", link: "/" },
                  { label: "Booking History", current: true },
                ]}
              />
            </div>

            <div className="grid grid-cols-12 gap-4 md:gap-[30px]">
              {!currentBookings.length && !previousBookings.length && (
                <div className="col-span-12 text-center">
                  <p className="text-white font-heading text-[20px] md:text-[24px]">
                    There are no booking data available
                  </p>
                </div>
              )}

              {currentBookings.length > 0 && (
                <div className="col-span-12">
                  <h2 className="font-heading text-[24px] md:text-[36px] text-white mb-4">
                    Current Bookings
                  </h2>
                  {currentCards.map((booking) => (
                    <BookingCard
                      key={booking.bookingNumber}
                      booking={booking}
                    />
                  ))}
                  {currentBookings.length > cardsPerPage && (
                    <PaginationControls
                      currentPage={currentPageOngoing}
                      pageCount={Math.ceil(
                        currentBookings.length / cardsPerPage
                      )}
                      paginate={paginateCurrent}
                    />
                  )}
                </div>
              )}

              {previousBookings.length > 0 && (
                <div className="col-span-12">
                  <h2 className="font-heading text-[24px] md:text-[36px] text-white mb-4">
                    Previous Bookings
                  </h2>
                  {previousCards.map((booking) => (
                    <BookingCard
                      key={booking.bookingNumber}
                      booking={booking}
                    />
                  ))}
                  {previousBookings.length > cardsPerPage && (
                    <PaginationControls
                      currentPage={currentPagePrevious}
                      pageCount={Math.ceil(
                        previousBookings.length / cardsPerPage
                      )}
                      paginate={paginatePrevious}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
BookingCard.propTypes = {
  booking: PropTypes.shape({
    bookingNumber: PropTypes.string.isRequired,
    movieTitle: PropTypes.string.isRequired,
    seats: PropTypes.arrayOf(PropTypes.string).isRequired,
    showDate: PropTypes.string.isRequired,
    showTime: PropTypes.string.isRequired,
    cinemaLocation: PropTypes.string.isRequired,
    theatreType: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
};

PaginationControls.propTypes = {
  currentPage: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
  paginate: PropTypes.func.isRequired,
};

export default BookingHistoryPage;
