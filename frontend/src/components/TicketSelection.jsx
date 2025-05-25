import styles from "../pages/CSS/Seats.module.css";
import { formatLKR } from "../utils/seatHelpers";
import PropTypes from "prop-types";

const TicketSelection = ({
  selectedSeats,
  adultTickets,
  setAdultTickets,
  childTickets,
  setChildTickets,
  ADULT_PRICE,
  CHILD_PRICE,
}) => (
  <div className={styles.ticketSelectionContainer}>
    <div className={styles.divider}></div>
    <h2 className={styles.ticketHeader}>
      {selectedSeats.length} ticket{selectedSeats.length !== 1 ? "s" : ""}{" "}
      selected. Please select attendees
    </h2>
    <div className={styles.ticketTypes}>
      <div className={styles.ticketType}>
        <div className={styles.ticketLabel}>
          <span>ADULT</span>
          <span className={styles.ticketPrice}>
            {adultTickets} x {formatLKR(ADULT_PRICE)} ={" "}
            {formatLKR(adultTickets * ADULT_PRICE)}
          </span>
        </div>
        <div className={styles.ticketControls}>
          <button
            onClick={() => setAdultTickets(Math.max(adultTickets - 1, 0))}
            disabled={adultTickets <= 0}
          >
            -
          </button>
          <span>{adultTickets}</span>
          <button
            onClick={() => setAdultTickets(adultTickets + 1)}
            disabled={adultTickets + childTickets >= selectedSeats.length}
          >
            +
          </button>
        </div>
      </div>
      <div className={styles.ticketType}>
        <div className={styles.ticketLabel}>
          <span>CHILD (AGES 3 - 12)</span>
          <span className={styles.ticketPrice}>
            {childTickets} x {formatLKR(CHILD_PRICE)} ={" "}
            {formatLKR(childTickets * CHILD_PRICE)}
          </span>
        </div>
        <div className={styles.ticketControls}>
          <button
            onClick={() => setChildTickets(Math.max(childTickets - 1, 0))}
            disabled={childTickets <= 0}
          >
            -
          </button>
          <span>{childTickets}</span>
          <button
            onClick={() => setChildTickets(childTickets + 1)}
            disabled={adultTickets + childTickets >= selectedSeats.length}
          >
            +
          </button>
        </div>
      </div>
    </div>
    <div className={styles.totalPrice}>
      <h3>
        Total Price:{" "}
        {formatLKR(adultTickets * ADULT_PRICE + childTickets * CHILD_PRICE)}
      </h3>
    </div>
  </div>
);
TicketSelection.propTypes = {
  selectedSeats: PropTypes.array.isRequired,
  adultTickets: PropTypes.number.isRequired,
  setAdultTickets: PropTypes.func.isRequired,
  childTickets: PropTypes.number.isRequired,
  setChildTickets: PropTypes.func.isRequired,
  ADULT_PRICE: PropTypes.number.isRequired,
  CHILD_PRICE: PropTypes.number.isRequired,
};

export default TicketSelection;
