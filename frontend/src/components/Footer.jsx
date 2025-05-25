import {
  FaFacebookF,
  FaInstagram,
  FaPhone,
  FaTwitter,
  FaYoutube,
  FaEnvelope,
  FaMapMarker,
  FaQuestionCircle,
  FaInfoCircle,
} from "react-icons/fa";
import Logo from "../assets/Logo/Logo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  // Shared Tailwind utility strings for hover effects, etc.
  const mainFooter =
    "bg-black/30 backdrop-blur-md text-white transition-colors duration-200";
  const hoverLink =
    "inline-block hover:scale-105 hover:text-gray-400 transition-transform duration-200 ease-in-out";
  const hoverIcon =
    "transition-transform duration-200 ease-in-out hover:scale-105";
  const hoverInvertBtn =
    "hover:scale-105 hover:filter hover:invert focus:outline-none active:outline-none appearance-none";
  const borderInput = "border border-gray-400 rounded-md overflow-hidden";
  const inputBase = "bg-transparent text-sm outline-none py-2 px-3 flex-1";
  const newsletterBtn =
    "bg-red-600 text-white font-semibold py-1 px-4 mt-4 rounded-md " +
    hoverIcon;

  return (
    <>
      {/* MOBILE FOOTER (screens < md) */}
      <footer className={`block md:hidden py-12 px-6 ${mainFooter}`}>
        {/*
          Increased spacing:
            gap-y-6 → gap-y-8
            gap-x-10 → gap-x-16
        */}
        <div className="grid grid-cols-2 gap-y-8 gap-x-16 border-b border-gray-700 pb-8">
          {/* LEFT COLUMN: Logo, About, Contacts, Address */}
          <div>
            <img src={Logo} alt="Logo" className="h-12 w-auto" />
            <h3 className="text-xl font-bold mt-2">SCOOP CINEMA</h3>

            <h4 className="text-lg font-bold mt-4 mb-2">About Us</h4>
            <p className="text-sm flex items-center gap-2">
              <FaInfoCircle className="text-xl" />
              From the latest blockbusters to timeless classics.
            </p>

            <h4 className="text-lg font-bold mt-4 mb-2">Contacts</h4>
            <p className="text-sm flex items-center gap-2">
              <FaPhone className="text-xl" /> 0761823473
            </p>
            <a
              href="mailto:aura@aura.com"
              className="
                mt-2 text-sm flex items-center gap-2
                transition-colors duration-200
                hover:text-gray-400
              "
            >
              <FaEnvelope className={`text-xl ${hoverIcon}`} />
              aura@aura.com
            </a>

            <h4 className="text-lg font-bold mt-4 mb-2">Office Address</h4>
            <p className="text-sm flex items-center gap-2">
              <FaMapMarker className="text-xl" /> 135/C Galle Road, Colpetty
            </p>
          </div>

          {/* RIGHT COLUMN: Quick Links, Support, Social */}
          <div>
            <h4 className="text-lg font-bold mb-2">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/contactus" className={hoverLink}>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/aboutus" className={hoverLink}>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/booking" className={hoverLink}>
                  Booking
                </Link>
              </li>
              <li>
                <Link to="/login" className={hoverLink}>
                  Login
                </Link>
              </li>
            </ul>

            <h4 className="text-lg font-bold mt-4 mb-2">Support</h4>
            <p className="text-sm flex items-center gap-2">
              <FaQuestionCircle className="text-xl" /> Have Questions?{" "}
              <a href="#" className={`underline ${hoverLink}`}>
                Ask Here!
              </a>
            </p>

            <h4 className="text-lg font-bold mt-4 mb-2">Connect with Us</h4>
            <div className="flex gap-4 mt-2 text-2xl">
              <a href="#" className={hoverLink}>
                <FaFacebookF />
              </a>
              <a href="#" className={hoverLink}>
                <FaInstagram />
              </a>
              <a href="#" className={hoverLink}>
                <FaTwitter />
              </a>
              <a href="#" className={hoverLink}>
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>

        {/* Mobile Newsletter */}
        <div className="mt-8 border-b border-gray-700 pb-8 text-center">
          <h4 className="mt-4 text-lg font-semibold">Join our newsletter</h4>
          <div
            className={`mt-2 flex ${borderInput} justify-center max-w-md mx-auto`}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className={inputBase}
            />
            <button
              className={`
                text-black bg-white px-3 py-2 flex items-center justify-center
                ${hoverIcon} 
                ${hoverInvertBtn}
              `}
            >
              <FaEnvelope />
            </button>
          </div>
          <button className={`${newsletterBtn} block mx-auto`}>
            SUBSCRIBE
          </button>
        </div>

        {/* Mobile Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 text-sm text-gray-400">
         <p>© Scoop Cinema, Inc, 2025.</p>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <a
              href="#"
              className="hover:text-white transition-colors duration-200"
            >
              FAQ
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors duration-200"
            >
              Terms and Conditions
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors duration-200"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>

      {/* DESKTOP FOOTER (screens >= md) */}
      <footer className={`hidden md:block py-12 px-16 ${mainFooter}`}>
        <div className="grid grid-cols-4 gap-8 border-b border-gray-700 pb-8">
          {/* (Unchanged Desktop Columns) */}
          {/* Column 1: Logo & Newsletter */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <img src={Logo} alt="Logo" className="h-16 w-auto" />
              <h3 className="text-2xl font-bold">SCOOP CINEMA</h3>
            </div>
            <h3 className="mt-4 text-lg font-semibold">Join our newsletter</h3>
            <div className={`mt-3 flex ${borderInput}`}>
              <input
                type="email"
                placeholder="Enter your email"
                className={inputBase}
              />
              <button
                className={`
                  text-black bg-white px-3 py-2
                  ${hoverIcon}
                  ${hoverInvertBtn}
                `}
              >
                <FaEnvelope />
              </button>
            </div>
            <button className={newsletterBtn}>SUBSCRIBE</button>
          </div>

          {/* Column 2: About & Contacts */}
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-bold mb-4">About Us</h4>
              <p className="text-sm flex items-center gap-2">
                <FaInfoCircle className="text-xl" />
                From the latest blockbusters to timeless classics.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-2">Contacts</h4>
              <p className="text-sm flex items-center gap-2">
                <FaPhone className="text-xl" /> 0761823473
              </p>
              <a
                href="mailto:aura@aura.com"
                className="mt-2 text-sm flex items-center gap-2 transition-colors duration-200 hover:text-gray-400"
              >
                <FaEnvelope className={`text-xl ${hoverIcon}`} />
                aura@aura.com
              </a>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-2">Office Address</h4>
              <p className="text-sm flex items-center gap-2">
                <FaMapMarker className="text-xl" /> 135/C Galle Road, Colpetty
              </p>
            </div>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/contactus" className={hoverLink}>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/aboutus" className={hoverLink}>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/booking" className={hoverLink}>
                  Booking
                </Link>
              </li>
              <li>
                <Link to="/login" className={hoverLink}>
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Support & Social */}
          <div>
            <h4 className="text-lg font-bold mb-4">Support</h4>
            <p className="text-sm flex items-center gap-2">
              <FaQuestionCircle className="text-xl" /> Have Questions?{" "}
              <a
                href="#"
                className={`inline-block text-white underline ${hoverLink}`}
              >
                Ask Here!
              </a>
            </p>
            <h4 className="text-lg font-bold mt-4 mb-2">Connect with Us</h4>
            <div className="flex gap-4 mt-2">
              <a href="#" className={`text-2xl ${hoverLink}`}>
                <FaFacebookF />
              </a>
              <a href="#" className={`text-2xl ${hoverLink}`}>
                <FaInstagram />
              </a>
              <a href="#" className={`text-2xl ${hoverLink}`}>
                <FaTwitter />
              </a>
              <a href="#" className={`text-2xl ${hoverLink}`}>
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom (Desktop) */}
        <div className="flex flex-row justify-between items-center mt-8 text-sm text-gray-400">
          <p>© Scoop Cinema, Inc, 2025.</p>
          <div className="flex space-x-4">
            <a
              href="#"
              className="hover:text-white transition-colors duration-200"
            >
              FAQ
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors duration-200"
            >
              Terms and Conditions
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors duration-200"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
