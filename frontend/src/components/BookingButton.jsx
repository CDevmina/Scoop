import PropTypes from "prop-types";

const Button = ({
  label,
  size = "medium",
  onClick,
  fontSize = "inherit",
  fontFamily = "inherit",
}) => {
  const sizes = {
    small: { padding: "5px 8px", fontSize: "12px" },
    medium: { padding: "7px 14px", fontSize: "14px" },
    large: { padding: "10px 20px", fontSize: "16px" },
  };

  const style = {
    ...sizes[size],
    border: "1px solid red",
    backgroundColor: "black", // Default background
    color: "white", // Default text color
    borderRadius: "2px",
    cursor: "pointer",
    marginRight: "10px",
    fontFamily: fontFamily, // Custom font family
    fontSize: fontSize, // Override font size
    lineHeight: "1", // Ensures the button's size isn't affected
    transition: "background-color 0.3s ease",
  };

  const hoverStyle = {
    backgroundColor: "red", // Hover background color
    color: "white", // Hover text color
  };

  return (
    <button
      style={style}
      onClick={onClick}
      onMouseEnter={(e) => Object.assign(e.target.style, hoverStyle)} // Apply hover style
      onMouseLeave={(e) => Object.assign(e.target.style, style)} // Revert to default style
    >
      {label}
    </button>
  );
};

Button.propTypes = {
  label: PropTypes.string.isRequired,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  onClick: PropTypes.func,
  fontSize: PropTypes.string,
  fontFamily: PropTypes.string,
};

export default Button;
