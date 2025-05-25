import { useForm } from "react-hook-form";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ScoopLogo from "../assets/Logo/Logo.png";
import { updateUserProfile } from "../utils/apiService";
import AuthContext from "../context/AuthContext";
import LoadingScreen from "../components/LoadingScreen";

export default function UpdateProfile() {
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({});
  const [focusedInputs, setFocusedInputs] = useState({
    firstName: false,
    lastName: false,
    phone: false,
  });

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const phoneRegex =
    /^(?:0|94|\+94)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)(0|2|3|4|5|7|9)|7(0|1|2|4|5|6|7|8)\d)\d{6}$/;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
    },
  });

  // Set form default values when user data is available
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
      });
    }
  }, [user, reset]);

  const handleFocus = (field) => {
    setFocusedInputs((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setFocusedInputs((prev) => ({ ...prev, [field]: false }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const onSubmit = async (data) => {
    try {
      await updateUserProfile(data);
      navigate("/profile");
    } catch (err) {
      setError(err.message || "Failed to update profile");
    }
  };

  if (!user) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex min-h-full h-screen flex-col justify-center px-6 py-2 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-[140px] w-auto"
          src={ScoopLogo}
          alt="Scoop Cinemas Logo"
        />
        <h2 className="mt-3 text-center text-3xl/9 font-bold tracking-wide text-white">
          Update Profile
        </h2>
        {error && <p className="text-center text-red-500 mt-2">{error}</p>}
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor="firstName"
              className="block mb-2 text-sm font-semibold text-white"
            >
              First Name
            </label>
            <input
              {...register("firstName", {
                required: "First name is required",
                minLength: { value: 2, message: "Min 2 characters" },
                pattern: { value: /^[A-Za-z\s]+$/, message: "Letters only" },
              })}
              type="text"
              id="firstName"
              className={`bg-[#121212] border text-white text-sm rounded-lg block w-full p-3 transition-all duration-300 ${
                focusedInputs.firstName
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-800 focus:ring-red-500"
              } ${
                errors.firstName && touched.firstName ? "border-red-500" : ""
              }`}
              onFocus={() => handleFocus("firstName")}
              onBlur={() => handleBlur("firstName")}
            />
            {errors.firstName && touched.firstName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block mb-2 text-sm font-semibold text-white"
            >
              Last Name
            </label>
            <input
              {...register("lastName", {
                required: "Last name is required",
                minLength: { value: 2, message: "Min 2 characters" },
                pattern: { value: /^[A-Za-z\s]+$/, message: "Letters only" },
              })}
              type="text"
              id="lastName"
              className={`bg-[#121212] border text-white text-sm rounded-lg block w-full p-3 transition-all duration-300 ${
                focusedInputs.lastName
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-800 focus:ring-red-500"
              } ${errors.lastName && touched.lastName ? "border-red-500" : ""}`}
              onFocus={() => handleFocus("lastName")}
              onBlur={() => handleBlur("lastName")}
            />
            {errors.lastName && touched.lastName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block mb-2 text-sm font-semibold text-white"
            >
              Phone Number
            </label>
            <input
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: phoneRegex,
                  message: "Invalid phone number format",
                },
              })}
              type="tel"
              id="phone"
              className={`bg-[#121212] border text-white text-sm rounded-lg block w-full p-3 transition-all duration-300 ${
                focusedInputs.phone
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-800 focus:ring-red-500"
              } ${errors.phone && touched.phone ? "border-red-500" : ""}`}
              onFocus={() => handleFocus("phone")}
              onBlur={() => handleBlur("phone")}
            />
            {errors.phone && touched.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="w-full px-4 py-2 text-sm font-semibold text-white bg-gray-600 rounded-lg hover:bg-gray-500 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all duration-300 disabled:opacity-50"
            >
              {isSubmitting ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
