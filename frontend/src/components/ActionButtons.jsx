import styles from "../pages/CSS/Seats.module.css";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const ActionButtons = ({ selectedSeats }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.buttonContainer}>
      <button
        className={`${styles.actionButton} ${styles.backButton}`}
        onClick={() => navigate(-1)}
      >
        Back
      </button>
      <button
        className={`${styles.actionButton} ${styles.proceedButton}`}
        disabled={selectedSeats.length === 0}
        onClick={() => navigate("/checkout")}
      >
        Proceed
      </button>
    </div>
  );
};
ActionButtons.propTypes = {
  selectedSeats: PropTypes.array.isRequired,
};

export default ActionButtons;
