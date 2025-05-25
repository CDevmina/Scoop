import { useForm } from "react-hook-form";
import { updatePassword } from "../utils/apiService";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const ChangePasswordPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await updatePassword(data);
      navigate("/"); // Redirect to Home
    } catch (error) {
      console.error("Password update failed:", error.message);
    }
  };

  return (
    <div className="flex min-h-full h-screen flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
          Change Password
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          className="space-y-6"
          method="POST"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label
              htmlFor="oldPassword"
              className="block text-sm/6 font-medium text-white"
            >
              Old Password
            </label>
            <div className="mt-2">
              <input
                {...register("oldPassword", {
                  required: "Old Password is required",
                })}
                type="password"
                name="oldPassword"
                id="oldPassword"
                autoComplete="current-password"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-secondary sm:text-sm/6"
              />
              {errors.oldPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.oldPassword.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm/6 font-medium text-white"
            >
              New Password
            </label>
            <div className="mt-2">
              <input
                {...register("newPassword", {
                  required: "New Password is required",
                  minLength: {
                    value: 6,
                    message: "New Password must be at least 6 characters long",
                  },
                })}
                type="password"
                name="newPassword"
                id="newPassword"
                autoComplete="new-password"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-secondary sm:text-sm/6"
              />
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Button
              text={isSubmitting ? "Updating..." : "Update Password"}
              customStyles="w-full justify-center px-3 py-1.5 text-sm/6 font-semibold shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
