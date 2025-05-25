import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import Breadcrumb from "../components/Breadcrumb.jsx";

import styles from "./CSS/ContactUs.module.css";

const ContactUsPage = () => {
  // Form data and error states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    terms: false,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Track focused inputs to change CSS border color
  const [focusedInputs, setFocusedInputs] = useState({
    name: false,
    email: false,
    phone: false,
    message: false,
  });

  // Regex patterns for validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;

  // Handle focus/blur events for styling
  const handleFocus = (field) => {
    setFocusedInputs((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setFocusedInputs((prev) => ({ ...prev, [field]: false }));
    setTouched((prevTouched) => ({ ...prevTouched, [field]: true }));
    validateField(field, formData[field]);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Validate a single field
  const validateField = (field, value) => {
    let errorMsg = "";

    switch (field) {
      case "name":
        if (!value.trim()) {
          errorMsg = "Name is required.";
        } else if (value.trim().length < 2) {
          errorMsg = "Name must be at least 2 characters long.";
        }
        break;
      case "email":
        if (!value.trim()) {
          errorMsg = "Email is required.";
        } else if (!emailRegex.test(value)) {
          errorMsg = "Please enter a valid email address.";
        }
        break;
      case "phone":
        if (!value.trim()) {
          errorMsg = "Phone number is required.";
        } else if (!phoneRegex.test(value)) {
          errorMsg = "Please enter a valid 10-digit phone number.";
        }
        break;
      case "message":
        if (!value.trim()) {
          errorMsg = "Message is required.";
        } else if (value.trim().length < 10) {
          errorMsg = "Message must be at least 10 characters long.";
        }
        break;
      case "terms":
        if (!value) {
          errorMsg = "You must agree to the terms and conditions.";
        }
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: errorMsg }));
  };

  // Validate all fields
  const validateAllFields = () => {
    let newErrors = {};

    // Name
    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long.";
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Phone
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number.";
    }

    // Message
    if (!formData.message.trim()) {
      newErrors.message = "Message is required.";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long.";
    }

    // Terms
    if (!formData.terms) {
      newErrors.terms = "You must agree to the terms and conditions.";
    }

    setErrors(newErrors);
    return newErrors;
  };

  // Check if form is valid (no errors)
  const isFormValid = () => {
    return (
      !errors.name &&
      !errors.email &&
      !errors.phone &&
      !errors.message &&
      !errors.terms &&
      formData.name.trim() &&
      formData.email.trim() &&
      formData.phone.trim() &&
      formData.message.trim().length >= 10 &&
      formData.terms
    );
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateAllFields();
    if (Object.keys(validationErrors).length === 0) {
      console.log("Form submitted successfully!", formData);
    }
  };

  return (
    <div className="bg-black min-h-screen flex flex-col items-center py-8 px-4 md:px-16">
      {/* Breadcrumb */}
      <div className="w-full max-w-6xl mx-auto mb-4">
        <Breadcrumb
          pageTitle="CONTACT US"
          breadcrumbNav={[
            { label: "Home", link: "/" },
            { label: "Contact Us", current: true },
          ]}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-6xl">
        {/* Form Section */}
        <div className="bg-[#121212] p-8 shadow-lg rounded-lg border border-gray-800">
          <form className="space-y-6 flex flex-col" onSubmit={handleSubmit}>
            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-semibold text-white"
              >
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className={`bg-[#121212] border text-white text-sm rounded-lg block w-full p-3 transition-all duration-300 ${
                  focusedInputs.name
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-800 focus:ring-red-500"
                } ${errors.name && touched.name ? "border-red-500" : ""}`}
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                onFocus={() => handleFocus("name")}
                onBlur={() => handleBlur("name")}
                required
              />
              {errors.name && touched.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-semibold text-white"
              >
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`bg-[#121212] border text-white text-sm rounded-lg block w-full p-3 transition-all duration-300 ${
                  focusedInputs.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-800 focus:ring-red-500"
                } ${errors.email && touched.email ? "border-red-500" : ""}`}
                placeholder="name@email.com"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => handleFocus("email")}
                onBlur={() => handleBlur("email")}
                required
              />
              {errors.email && touched.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone Input */}
            <div>
              <label
                htmlFor="phone"
                className="block mb-2 text-sm font-semibold text-white"
              >
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                className={`bg-[#121212] border text-white text-sm rounded-lg block w-full p-3 transition-all duration-300 ${
                  focusedInputs.phone
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-800 focus:ring-red-500"
                } ${errors.phone && touched.phone ? "border-red-500" : ""}`}
                placeholder="Enter a valid 10-digit phone number"
                value={formData.phone}
                onChange={handleChange}
                onFocus={() => handleFocus("phone")}
                onBlur={() => handleBlur("phone")}
                required
              />
              {errors.phone && touched.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Message Textarea */}
            <div>
              <label
                htmlFor="message"
                className="block mb-2 text-sm font-semibold text-white"
              >
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                className={`block p-3 w-full text-sm text-white bg-[#121212] rounded-lg border transition-all duration-300 ${
                  focusedInputs.message
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-800 focus:ring-red-500"
                } ${errors.message && touched.message ? "border-red-500" : ""}`}
                placeholder="Enter your message (min 10 characters)..."
                value={formData.message}
                onChange={handleChange}
                onFocus={() => handleFocus("message")}
                onBlur={() => handleBlur("message")}
                required
              ></textarea>
              {errors.message && touched.message && (
                <p className="text-red-500 text-sm mt-1">{errors.message}</p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="w-4 h-4 border border-gray-800 rounded bg-[#121212] focus:ring-3 focus:ring-red-500 transition-all duration-300"
                checked={formData.terms}
                onChange={handleChange}
                onBlur={() => {
                  setTouched({ ...touched, terms: true });
                  validateField("terms", formData.terms);
                }}
                required
              />
              <label
                htmlFor="terms"
                className="ml-2 text-sm font-medium text-white"
              >
                I agree with the{" "}
                <a href="#" className="text-red-500 hover:underline">
                  terms and conditions
                </a>
              </label>
            </div>
            {errors.terms && touched.terms && (
              <p className="text-red-500 text-sm mt-1">{errors.terms}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid()}
              className={`bg-red-500 text-white font-semibold rounded-lg py-3 px-4 text-center flex items-center justify-center hover:bg-red-600 transition-all duration-300 ${
                !isFormValid() ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Submit
            </button>
          </form>
        </div>

        {/* Contact Details Section */}
        <div
          className={`bg-[#121212] p-8 shadow-lg rounded-lg grid grid-rows-3 gap-6 ${styles.boxSection}`}
        >
          <div className="flex flex-col items-start">
            <h2 className="text-lg font-bold text-white mb-2">
              Marketing & Advertising
            </h2>
            <p className="text-white">
              <FontAwesomeIcon icon={faPhone} /> 0766248951 - Gagana <br />
              <FontAwesomeIcon icon={faEnvelope} /> gagana@scoopcinemas.com
            </p>
          </div>

          <div className="flex flex-col items-start">
            <h2 className="text-lg font-bold text-white mb-2">
              Theater Contact Details
            </h2>
            <p className="text-white">
              Sydney Opera House <br />
              <FontAwesomeIcon icon={faPhone} /> 0112083064 <br />
            </p>
          </div>

          <div className="flex flex-col items-start">
            <h2 className="text-lg font-bold text-white mb-2">Help Desk</h2>
            <p className="text-white">
              Open: 9:00 AM - 6:00 PM (Monday - Friday) <br />
              <FontAwesomeIcon icon={faPhone} /> 01125564869 / 0765497521 <br />
              <FontAwesomeIcon icon={faEnvelope} /> helpdesk@scoopcinemas.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
