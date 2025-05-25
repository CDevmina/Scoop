import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import ScoopLogo from "../assets/Logo/Logo.png";
import { loginUser } from "../utils/apiService";
import AuthContext from "../context/AuthContext";
import Button from "../components/Button";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [loginError, setLoginError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { login } = useContext(AuthContext);

  const onSubmit = async (data) => {
    try {
      setLoginError("");
      const response = await loginUser(data);
      login(response.token, rememberMe);
    } catch (error) {
      setLoginError(error.message || "Invalid email or password");
      console.error("Login failed:", error.message);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-24"
          src={ScoopLogo}
          alt="Scoop Cinemas Logo"
        />
        <h2 className="mt-2 text-center text-2xl/9 font-bold tracking-tight text-white">
          Scoop Cinemas
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          className="space-y-6"
          method="POST"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-white"
            >
              Email
            </label>
            <div className="mt-2">
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-secondary sm:text-sm/6"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm/6 font-medium text-white"
            >
              Password
            </label>
            <div className="mt-2">
              <input
                {...register("password", {
                  required: "Password is required",
                })}
                type="password"
                name="password"
                id="password"
                autoComplete="current-password"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-secondary sm:text-sm/6"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="rememberMe"
              type="checkbox"
              className="w-4 h-4 appearance-none checked:bg-red-600 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label
              htmlFor="rememberMe"
              className="ml-2 block text-sm text-white"
            >
              Remember me
            </label>
          </div>

          {loginError && (
            <div className="text-red-500 text-sm mt-1">{loginError}</div>
          )}

          <div>
            <Button
              type="submit"
              text="Sign in"
              customStyles="w-full justify-center px-3 py-1.5 text-sm/6 font-semibold shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
            />
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Don&apos;t have an account?
          <Link
            to="/register"
            className="font-semibold text-secondary hover:text-red-500"
          >
            {" "}
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
