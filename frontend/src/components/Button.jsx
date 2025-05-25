import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const Button = ({ text, onClick, url, customStyles = "" }) => {
  const baseStyles =
    "flex items-center px-4 py-2 bg-secondary text-black shadow-md rounded-md text-white font-semibold transition justify-center duration-300";
  const hoverStyles = "hover:bg-secondary/50";
  const pressStyles = "active:scale-95";
  const buttonStyles = `${baseStyles} ${hoverStyles} ${pressStyles} ${customStyles}`;

  if (url) {
    return (
      <Link to={url} className={buttonStyles}>
        {text}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={buttonStyles}>
      {text}
    </button>
  );
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  url: PropTypes.string,
  customStyles: PropTypes.string,
};

export default Button;
