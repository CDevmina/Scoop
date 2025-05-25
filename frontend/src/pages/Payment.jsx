import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CSS/Payment.module.css";
import TermsModal from "../components/TermsModal";
import { fetchSession, clearSession } from "../utils/sessionService";
import {
  getShowtimeDetails,
  getUserDetails,
  createBooking,
  processPayment,
} from "../utils/apiService";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import LoadingScreen from "../components/LoadingScreen";

const Payment = () => {
  const navigate = useNavigate();

  // State for timer
  const [timeLeft, setTimeLeft] = useState(600);

  // States from session
  const [showtimeDetails, setShowtimeDetails] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [adultTickets, setAdultTickets] = useState(0);
  const [childTickets, setChildTickets] = useState(0);
  const [bookingNumber, setBookingNumber] = useState(null);

  const [showPayPalButtons, setShowPayPalButtons] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // User details
  const [userDetails, setUserDetails] = useState(null);

  // Promo code handling
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(null);

  // Modal handling
  const [showModal, setShowModal] = useState(false);
  const paymentOptionsRef = useRef(null);

  // Load session info and user details on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch existing session
        const sessionData = await fetchSession();
        if (!sessionData || !sessionData.showtimeId) {
          throw new Error("No valid session found");
        }

        // Set seats/tickets from session
        setSelectedSeats(sessionData.selectedSeats || []);
        setAdultTickets(sessionData.adultTickets || 0);
        setChildTickets(sessionData.childTickets || 0);
        setBookingNumber(sessionData.bookingNumber);

        // Fetch showtime details
        const details = await getShowtimeDetails(sessionData.showtimeId);
        setShowtimeDetails(details);

        // Fetch user details
        const fetchedUser = await getUserDetails();
        setUserDetails(fetchedUser);
      } catch (error) {
        console.error("Failed to load session or user details:", error);
        alert("Session not found. Redirecting to home page.");
        navigate("/");
      }
    };
    loadData();
  }, [navigate]);

  // Handle continuing timer from seats (stored in localStorage)
  useEffect(() => {
    const storedTimeLeft = parseInt(localStorage.getItem("timeLeft"), 10);
    if (!isNaN(storedTimeLeft)) {
      setTimeLeft(storedTimeLeft);
    } else {
      // If no timer found, treat as session ended
      clearSession();
      alert("Session expired or not found. Redirecting to home page.");
      navigate("/");
    }
  }, [navigate]);

  // Decrement the timer every second
  useEffect(() => {
    if (timeLeft <= 0) {
      clearSession();
      alert("Session expired! Redirecting to home page.");
      navigate("/");
      return;
    }
    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft, navigate]);

  // Update localStorage with the latest timeLeft
  useEffect(() => {
    localStorage.setItem("timeLeft", timeLeft.toString());
  }, [timeLeft]);

  // Handle escape key for closing modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && showModal) {
        handleDisagreeModal();
      }
    };
    if (showModal) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showModal]);

  // Show modal if not previously accepted
  useEffect(() => {
    const modalAccepted = localStorage.getItem("modalAccepted");
    if (!modalAccepted) {
      setShowModal(true);
    }
  }, []);

  // PayPal initialization options
  const paypalOptions = {
    "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID || "",
    currency: "USD",
    intent: "capture",
  };

  const handlePaymentMethodSelect = (methodName) => {
    if (methodName !== "PayPal") {
      alert("This payment method is not available. Please select PayPal.");
      setSelectedPaymentOption(null);
      return;
    }
    setSelectedPaymentOption(methodName);
  };

  const handleTermsChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  const handlePayNowClick = (e) => {
    e.preventDefault();

    if (!selectedPaymentOption) {
      alert("Please select PayPal as your payment method");
      return;
    }
    if (!termsAccepted) {
      alert("Please accept the terms and conditions");
      return;
    }
    setShowPayPalButtons(true);
  };

  // PayPal button handlers
  const createOrder = (data, actions) => {
    try {
      const totals = calculateTotal();
      const usdAmount = LKRtoUSD(totals.total);

      return actions.order.create({
        purchase_units: [
          {
            reference_id: bookingNumber,
            amount: {
              currency_code: "USD",
              value: usdAmount,
            },
            description: `Movie Tickets - ${showtimeDetails.movieTitle}`,
          },
        ],
      });
    } catch (err) {
      onError(err);
    }
  };

  const onApprove = async (data) => {
    try {
      const paypalOrderId = await data.orderID;

      // 1. Create Booking
      const bookingData = {
        bookingNumber: bookingNumber,
        movieId: showtimeDetails.movieId,
        showtimeId: showtimeDetails.showtimeId,
        seats: selectedSeats.map((seat) => ({
          seatNumber: seat,
        })),
        adultTickets: adultTickets,
        childTickets: childTickets,
      };

      const booking = await createBooking(bookingData);

      // 2. Process Payment
      const paymentData = {
        bookingNumber: booking.bookingNumber,
        paypalOrderId: paypalOrderId,
        paymentMethod: "PAYPAL",
        amount: parseFloat(totals.total),
        status: "COMPLETED",
      };

      await processPayment(paymentData);

      // 3. Clear session and redirect
      clearSession();
      localStorage.removeItem("timeLeft");
      navigate("/accept", {
        state: {
          booking: {
            ...booking,
            movieTitle: showtimeDetails.movieTitle,
            theatreType: showtimeDetails.theatreType,
            cinemaLocation: showtimeDetails.cinemaLocation,
            date: showtimeDetails.date,
            time: showtimeDetails.time,
            seats: selectedSeats,
            amount: totals.total,
          },
        },
      });
    } catch (error) {
      console.error("Payment processing failed:", error);
      onError(error);
    }
  };

  const onError = (err) => {
    console.error("Payment error", err);
    navigate("/decline", {
      state: {
        error: err.message || "Payment processing failed. Please try again.",
      },
    });
  };

  // Promo code logic
  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === "DISCOUNT10") {
      setDiscount(0.1);
      alert("Promo code applied successfully!");
    } else {
      setDiscount(0);
      alert("Invalid Promo Code");
    }
  };

  const LKRtoUSD = (lkrAmount) => {
    const rate = 0.0031; // 1 LKR = 0.0031 USD
    return (parseFloat(lkrAmount) * rate).toFixed(2);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const formattedMins = mins < 10 ? `0${mins}` : mins;
    const formattedSecs = secs < 10 ? `0${secs}` : secs;
    return `${formattedMins}:${formattedSecs}`;
  };

  // Calculate subtotals from tickets
  const calculateTotal = () => {
    if (!showtimeDetails) {
      return { subTotal: "0.00", vat: "0.00", discount: "0.00", total: "0.00" };
    }
    const ticketCost =
      adultTickets * showtimeDetails.adultTicketPrice +
      childTickets * showtimeDetails.kidTicketPrice;
    const vat = ticketCost * 0.145;
    const discountAmount = ticketCost * discount;
    const total = ticketCost + vat - discountAmount;

    return {
      subTotal: ticketCost.toFixed(2),
      vat: vat.toFixed(2),
      discount: discountAmount.toFixed(2),
      total: total.toFixed(2),
    };
  };
  const totals = calculateTotal();

  // Modal agreement
  const handleAgreeModal = () => {
    localStorage.setItem("modalAccepted", "true");
    setShowModal(false);
  };
  const handleDisagreeModal = () => {
    window.location.href = "/";
  };

  const handleContainerClick = (e) => {
    e.stopPropagation();
  };

  // Form submit
  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Check that we still have time
    if (timeLeft <= 0) {
      clearSession();
      alert("Session expired! Redirecting to home page.");
      navigate("/");
      return;
    }

    // Check payment method
    if (!selectedPaymentOption) {
      alert("Please select a payment method");
      return;
    }

    // Check T&Cs
    const termsAccepted = document.getElementById("terms").checked;
    if (!termsAccepted) {
      alert("Please accept the Terms & Conditions");
      return;
    }

    // All validations pass
    try {
      console.log("Processing payment with:", {
        paymentMethod: selectedPaymentOption,
        saveCard: document.getElementById("saveCard").checked,
      });
      // Go to success page
      window.location.href = "/accept";
    } catch (error) {
      console.error("Payment processing failed:", error);
      window.location.href = "/decline";
    }
  };

  if (!showtimeDetails || !userDetails) {
    return <LoadingScreen />;
  }

  return (
    <div className={styles.paymentPage}>
      {showModal && (
        <TermsModal
          onAgree={handleAgreeModal}
          onDisagree={handleDisagreeModal}
        />
      )}

      <div className={styles.container}>
        {/* Header Section */}
        <header className={styles.headerSection}>
          <h1 className={`${styles.heading} ${styles.movieTitle}`}>
            Payment Summary
          </h1>
          <div className={styles.timer}>{formatTime(timeLeft)}</div>
        </header>

        <hr className={styles.divider} />

        <main className={styles.contentSection}>
          {/* Movie + Showtime Info */}
          <section className={styles.movieCard}>
            {showtimeDetails.tallBanner && (
              <img
                src={showtimeDetails.tallBanner}
                alt={`${showtimeDetails.movieTitle} Poster`}
                className={styles.movieImage}
                loading="lazy"
              />
            )}
            <div className={styles.movieInfo}>
              <h2 className={`${styles.heading} ${styles.movieName}`}>
                {showtimeDetails.movieTitle}
              </h2>
              <p>
                <strong>Date:</strong> {showtimeDetails.date}
              </p>
              <p>
                <strong>Time:</strong> {showtimeDetails.time}
              </p>
              <p>
                <strong>Location:</strong> {showtimeDetails.cinemaLocation}
              </p>
              <p>
                <strong>Theater Type:</strong> {showtimeDetails.theatreType}
              </p>
              <p>
                <strong>Seats:</strong> {selectedSeats.join(", ")}
              </p>
            </div>
          </section>

          {/* Purchase Summary */}
          <section className={styles.purchaseSummary}>
            <h2 className={styles.heading}>PURCHASE SUMMARY</h2>
            <div className={styles.summaryRow}>
              <span>Adult Tickets (x{adultTickets})</span>
              <span>
                LKR{" "}
                {(showtimeDetails.adultTicketPrice * adultTickets).toFixed(2)}
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span>Child Tickets (x{childTickets})</span>
              <span>
                LKR {(showtimeDetails.kidTicketPrice * childTickets).toFixed(2)}
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span>VAT Included</span>
              <span>LKR {totals.vat}</span>
            </div>
            {discount > 0 && (
              <div className={styles.summaryRow}>
                <span>Discount (10%)</span>
                <span>- LKR {totals.discount}</span>
              </div>
            )}
            <hr />
            <div className={styles.summaryRow}>
              <span>SubTotal</span>
              <span>LKR {totals.subTotal}</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.total}`}>
              <span>Total</span>
              <span>LKR {totals.total}</span>
            </div>
            <hr />
            <br />

            {/* Promo Code */}
            <div className={styles.promoCode}>
              <input
                type="text"
                id="promoCode"
                className="bg-gray-800 border border-gray-700 text-gray-100 text-sm rounded-lg focus:ring-red-700 focus:border-red-700 block w-full p-2.5"
                placeholder="Have a promo code?"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button
                type="button"
                className={styles.customRedButton}
                onClick={handleApplyPromo}
              >
                Apply
              </button>
            </div>

            <h3 className="mt-6 text-gray-100 text-xl">
              Select Your Payment Mode
            </h3>
            <div
              className={styles.paymentOptions}
              ref={paymentOptionsRef}
              onClick={handleContainerClick}
            >
              {/* Hard-coded for example; you can map your own methods */}
              {[
                {
                  name: "Visa",
                  image:
                    "https://logos-download.com/wp-content/uploads/2016/02/Visa_Logo_2014.png",
                },
                {
                  name: "MasterCard",
                  image:
                    "https://logos-download.com/wp-content/uploads/2016/03/Mastercard_Logo_2019.png",
                },
                {
                  name: "PayPal",
                  image:
                    "https://logos-download.com/wp-content/uploads/2016/03/PayPal_Logo_2014.png",
                },
                { name: "Scoop Privilege" },
              ].map((option) => (
                <div
                  key={option.name}
                  className={`${styles.paymentOption} ${
                    selectedPaymentOption === option.name ? styles.selected : ""
                  }`}
                  onClick={() => handlePaymentMethodSelect(option.name)}
                >
                  {option.image ? (
                    <img
                      src={option.image}
                      alt={`${option.name} Logo`}
                      className={styles.paymentLogo}
                    />
                  ) : (
                    <span className={styles.customClickable}>
                      {option.name}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* PayPal Buttons Section */}
            <div
              className={`${styles.paypalButtonsContainer} ${
                showPayPalButtons ? styles.show : ""
              } mt-6`}
            >
              {showPayPalButtons && (
                <PayPalScriptProvider options={paypalOptions}>
                  <PayPalButtons
                    style={{ layout: "vertical" }}
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                  />
                </PayPalScriptProvider>
              )}
            </div>

            <form className="max-w-sm mx-auto mt-6" onSubmit={handleFormSubmit}>
              <h2 className="mt-6 text-gray-100 text-xl">Your Details</h2>

              {/* Name */}
              <div className="mb-5">
                <div className="bg-gray-800 border border-gray-700 text-gray-100 text-sm rounded-lg p-2.5">
                  <p className="text-gray-400 text-xs mb-1">Name</p>
                  <p className="text-gray-100">{`${userDetails.firstName} ${userDetails.lastName}`}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="mb-5">
                <div className="bg-gray-800 border border-gray-700 text-gray-100 text-sm rounded-lg p-2.5">
                  <p className="text-gray-400 text-xs mb-1">Phone</p>
                  <p className="text-gray-100">{userDetails.phone}</p>
                </div>
              </div>

              {/* Email */}
              <div className="mb-5">
                <div className="bg-gray-800 border border-gray-700 text-gray-100 text-sm rounded-lg p-2.5">
                  <p className="text-gray-400 text-xs mb-1">Email</p>
                  <p className="text-gray-100">{userDetails.email}</p>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start mb-5">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-700 rounded bg-gray-800 focus:ring-3 focus:ring-red-700"
                    checked={termsAccepted}
                    onChange={handleTermsChange}
                  />
                </div>
                <label
                  htmlFor="terms"
                  className="ms-2 text-sm font-medium text-gray-100"
                >
                  I agree with the{" "}
                  <a href="#" className={styles.customRedLink}>
                    Terms &amp; Conditions
                  </a>
                </label>
              </div>

              {/* Save Card Checkbox */}
              <div className="flex items-start mb-5">
                <div className="flex items-center h-5">
                  <input
                    id="saveCard"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-700 rounded bg-gray-800 focus:ring-3 focus:ring-red-700"
                  />
                </div>
                <label
                  htmlFor="saveCard"
                  className="ms-2 text-sm font-medium text-gray-100"
                >
                  Save the card for future{" "}
                  <a href="#" className={styles.customRedLink}>
                    Quick Pay
                  </a>{" "}
                  facility
                </label>
              </div>

              {/* Buttons */}
              <div className={styles.buttonContainer}>
                <button
                  type="button"
                  className={`${styles.actionButton} ${styles.backButton}`}
                  onClick={() => {
                    clearSession();
                    navigate(-1);
                  }}
                >
                  BACK
                </button>
                <button
                  type="button"
                  className={`${styles.actionButton} ${styles.payNowButton} ${
                    !termsAccepted || selectedPaymentOption !== "PayPal"
                      ? styles.disabled
                      : ""
                  }`}
                  onClick={handlePayNowClick}
                  disabled={
                    !termsAccepted || selectedPaymentOption !== "PayPal"
                  }
                >
                  PAY NOW
                </button>
              </div>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Payment;
