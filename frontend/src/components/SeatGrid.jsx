import styles from "../pages/CSS/Seats.module.css";
import PropTypes from "prop-types";

const SeatGrid = ({
  seats,
  selectedSeats,
  reservedSeats,
  lockedSeats,
  handleSeatClick,
}) => (
  <div className={styles.seatGridContainer}>
    <div className={styles.screen}>
      <span className={styles.screenText}>SCREEN</span>
    </div>
    <div className={styles.seatGrid}>
      {seats.flat().map((seat, index) =>
        seat ? (
          <button
            key={seat}
            className={`${styles.seat} ${
              selectedSeats.includes(seat) ? styles.selected : ""
            } ${reservedSeats.includes(seat) ? styles.reserved : ""} ${
              lockedSeats.includes(seat) ? styles.locked : ""
            }`}
            onClick={() => handleSeatClick(seat)}
            disabled={
              reservedSeats.includes(seat) || lockedSeats.includes(seat)
            }
          >
            {seat}
          </button>
        ) : (
          <div
            key={`empty-${index}`}
            className={styles.seat}
            style={{ visibility: "hidden" }}
          />
        )
      )}
    </div>
    <div className={styles.legend}>
      <div className={styles.legendItem}>
        <div className={`${styles.legendBox} ${styles.selectedLegend}`}></div>
        <span>Selected</span>
      </div>
      <div className={styles.legendItem}>
        <div className={`${styles.legendBox} ${styles.available}`}></div>
        <span>Available</span>
      </div>
      <div className={styles.legendItem}>
        <div className={`${styles.legendBox} ${styles.reserved}`}></div>
        <span>Reserved</span>
      </div>
      <div className={styles.legendItem}>
        <div className={`${styles.legendBox} ${styles.locked}`}></div>
        <span>Locked</span>
      </div>
    </div>
  </div>
);

SeatGrid.propTypes = {
  seats: PropTypes.arrayOf(PropTypes.array).isRequired,
  selectedSeats: PropTypes.array.isRequired,
  reservedSeats: PropTypes.array.isRequired,
  lockedSeats: PropTypes.array.isRequired,
  handleSeatClick: PropTypes.func.isRequired,
};

export default SeatGrid;
