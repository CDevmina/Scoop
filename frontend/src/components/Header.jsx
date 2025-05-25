import { useState, useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaChevronDown,
  FaHome,
  FaFilm,
  FaTicketAlt,
  FaInfoCircle,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import Logo from "../assets/Logo/Logo.png";
import AuthContext from "../context/AuthContext";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  const desktopDropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);
  const mobileNavRef = useRef(null);

  const closeMenu = () => setIsOpen(false);
  const closeDropdown = () => {
    setIsDropdownOpen(false);
    setIsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      const desktopRef = desktopDropdownRef.current;
      const mobileRef = mobileDropdownRef.current;
      const mobileNav = mobileNavRef.current;

      // Close dropdown if click is outside
      if (isDropdownOpen) {
        const outsideDesktop = desktopRef && !desktopRef.contains(event.target);
        const outsideMobile = mobileRef && !mobileRef.contains(event.target);

        if (
          (desktopRef && mobileRef && outsideDesktop && outsideMobile) ||
          (desktopRef && !mobileRef && outsideDesktop) ||
          (mobileRef && !desktopRef && outsideMobile)
        ) {
          setIsDropdownOpen(false);
        }
      }

      // Close mobile menu if click is outside
      if (isOpen && mobileNav && !mobileNav.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen, isOpen]);

  return (
    <header className="sticky top-0 z-50 bg-black/30 backdrop-blur-md text-white py-4 px-8 flex justify-between items-center shadow-md transition-colors duration-200">
      {/* --- DESKTOP NAVIGATION --- */}
      <nav className="hidden md:flex w-full justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <img src={Logo} alt="Logo" className="h-12 w-auto" />
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link
            to="/"
            className="
              inline-flex items-center gap-2 text-base focus:outline-none
              hover:text-gray-400 hover:scale-[1.02]
              transition-transform duration-200 ease-in-out
            "
          >
            <FaHome /> HOME
          </Link>
          <Link
            to="/movies"
            className="
              inline-flex items-center gap-2 text-base focus:outline-none
              hover:text-gray-400 hover:scale-[1.02]
              transition-transform duration-200 ease-in-out
            "
          >
            <FaFilm /> MOVIES
          </Link>
          <Link
            to="/booking"
            className="
              inline-flex items-center gap-2 text-base focus:outline-none
              hover:text-gray-400 hover:scale-[1.02]
              transition-transform duration-200 ease-in-out
            "
          >
            <FaTicketAlt /> BOOKING
          </Link>
          <Link
            to="/aboutus"
            className="
              inline-flex items-center gap-2 text-base focus:outline-none
              hover:text-gray-400 hover:scale-[1.02]
              transition-transform duration-200 ease-in-out
            "
          >
            <FaInfoCircle /> ABOUT US
          </Link>

          {/* Desktop User Dropdown */}
          {isAuthenticated && user ? (
            <div ref={desktopDropdownRef} className="relative inline-block">
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="
                  inline-flex items-center gap-2 text-base focus:outline-none
                  hover:text-gray-400 hover:scale-[1.02]
                  transition-transform duration-200 ease-in-out
                "
              >
                <FaUser />
                {user?.firstName?.toUpperCase() || "USER"}
                <FaChevronDown
                  className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isDropdownOpen && (
                <div
                  className="
                    absolute left-0 transform -translate-x-4 mt-2 w-48 bg-black/40 backdrop-blur-md text-white 
                    rounded-md shadow-lg z-50 overflow-hidden"
                  style={{ top: "100%" }}
                >
                  <Link
                    to="/profile"
                    onClick={closeDropdown}
                    className="
                      flex items-center gap-2 text-base px-4 py-2 focus:outline-none
                      hover:bg-gray-700/60 hover:backdrop-blur-md
                      hover:scale-[1.02] transition-transform duration-200 ease-in-out
                    "
                  >
                    <FaUser /> Profile
                  </Link>
                  <Link
                    to="/tickets"
                    onClick={closeDropdown}
                    className="
                      flex items-center gap-2 text-base px-4 py-2 focus:outline-none
                      hover:bg-gray-700/60 hover:backdrop-blur-md
                      hover:scale-[1.02] transition-transform duration-200 ease-in-out
                    "
                  >
                    <FaTicketAlt /> Tickets
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      closeDropdown();
                    }}
                    className="
                      flex items-center gap-2 text-base px-4 py-2 w-full text-left focus:outline-none
                      hover:bg-red-700/60 hover:backdrop-blur-md
                      hover:scale-[1.02] transition-transform duration-200 ease-in-out
                    "
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="
                inline-flex items-center gap-2 text-base focus:outline-none
                hover:text-gray-400 hover:scale-[1.02]
                transition-transform duration-200 ease-in-out
              "
            >
              LOGIN
            </Link>
          )}
        </div>
      </nav>

      {/* --- MOBILE NAVBAR --- */}
      <div className="md:hidden flex w-full items-center justify-between relative">
        {/* Logo */}
        <div className="flex items-center">
          <img src={Logo} alt="Logo" className="h-12 w-auto" />
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="text-2xl ml-auto focus:outline-none hover:text-gray-200 transition-colors"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      <nav
        ref={mobileNavRef}
        className={`
          absolute left-0 w-full 
          bg-black/40 backdrop-blur-md text-white 
          flex flex-col space-y-4 p-4 z-50 md:hidden
          transition-transform duration-300 ease-in-out origin-top
          ${
            isOpen
              ? "top-16 scale-y-100 opacity-100"
              : "top-16 scale-y-0 opacity-0 pointer-events-none"
          }
        `}
      >
        <Link
          to="/"
          onClick={closeMenu}
          className="
            inline-flex items-center gap-2 text-base focus:outline-none
            hover:text-gray-400 hover:scale-[1.02]
            transition-transform duration-200 ease-in-out
          "
        >
          <FaHome /> HOME
        </Link>
        <Link
          to="/movies"
          onClick={closeMenu}
          className="
            inline-flex items-center gap-2 text-base focus:outline-none
            hover:text-gray-400 hover:scale-[1.02]
            transition-transform duration-200 ease-in-out
          "
        >
          <FaFilm /> MOVIES
        </Link>
        <Link
          to="/booking"
          onClick={closeMenu}
          className="
            inline-flex items-center gap-2 text-base focus:outline-none
            hover:text-gray-400 hover:scale-[1.02]
            transition-transform duration-200 ease-in-out
          "
        >
          <FaTicketAlt /> BOOKING
        </Link>
        <Link
          to="/aboutus"
          onClick={closeMenu}
          className="
            inline-flex items-center gap-2 text-base focus:outline-none
            hover:text-gray-400 hover:scale-[1.02]
            transition-transform duration-200 ease-in-out
          "
        >
          <FaInfoCircle /> ABOUT US
        </Link>

        {/* Mobile User Dropdown */}
        {isAuthenticated && user ? (
          <div ref={mobileDropdownRef}>
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="
                inline-flex items-center gap-3 text-base focus:outline-none
                hover:text-gray-400 hover:scale-[1.02]
                transition-transform duration-200 ease-in-out
              "
            >
              <FaUser /> {user?.firstName?.toUpperCase() || "USER"}
              <FaChevronDown
                className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isDropdownOpen && (
              <div className="flex flex-col px-4 py-2 bg-black/50 backdrop-blur-md rounded-md shadow-lg mt-2">
                <Link
                  to="/profile"
                  onClick={closeDropdown}
                  className="
                    flex items-center gap-2 rounded-md text-base px-4 py-2 focus:outline-none
                    hover:bg-gray-700/60 hover:backdrop-blur-md
                    hover:scale-[1.02] transition-transform duration-200 ease-in-out
                  "
                >
                  <FaUser /> Profile
                </Link>
                <Link
                  to="/tickets"
                  onClick={closeDropdown}
                  className="
                    flex items-center gap-2 rounded-md text-base px-4 py-2 focus:outline-none
                    hover:bg-gray-700/60 hover:backdrop-blur-md
                    hover:scale-[1.02] transition-transform duration-200 ease-in-out
                  "
                >
                  <FaTicketAlt /> Tickets
                </Link>
                <button
                  onClick={() => {
                    logout();
                    closeDropdown();
                  }}
                  className="
                    flex items-center gap-2 rounded-md text-base px-4 py-2 focus:outline-none
                    hover:bg-red-700/60 hover:backdrop-blur-md
                    hover:scale-[1.02] transition-transform duration-200 ease-in-out
                  "
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            onClick={closeMenu}
            className="
              inline-flex items-center gap-2 text-base px-4 py-2 focus:outline-none
              hover:text-gray-400 hover:scale-[1.02]
              transition-transform duration-200 ease-in-out
            "
          >
            LOGIN
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
