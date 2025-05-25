import styles from "../pages/CSS/Seats.module.css";
import PropTypes from "prop-types";

const ShowtimeSelection = ({ selectedShowtime }) => (
  <div className={styles.showtimes}>
    <h3 className={styles.showtimeLabel}>Showtime</h3>
    {selectedShowtime && (
      <button className={`${styles.showtimeButton} ${styles.selectedShowtime}`}>
        {selectedShowtime}
      </button>
    )}
  </div>
);

ShowtimeSelection.propTypes = {
  selectedShowtime: PropTypes.string.isRequired,
};

export default ShowtimeSelection;
