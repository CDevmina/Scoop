import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import Button from "../components/Button";
import ProfileSection from "../components/ProfileSection";
import {
  getUserDetails,
  deleteUserProfile,
  fetchPaymentHistory,
} from "../utils/apiService";
import AuthContext from "../context/AuthContext";
import LoadingScreen from "../components/LoadingScreen";

const ProfilePages = () => {
  const { handleSubmit } = useForm();
  const [userDetails, setUserDetails] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const data = await getUserDetails();
        setUserDetails(data);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };

    const loadPaymentHistory = async () => {
      try {
        const paymentDetails = await fetchPaymentHistory();
        setPaymentHistory(paymentDetails);
      } catch (error) {
        console.error("Failed to fetch payment history:", error);
      }
    };

    fetchUserDetails();
    loadPaymentHistory();
  }, []);

  const onSubmit = (data) => console.log(data);

  const handleDeleteAccount = async () => {
    try {
      await deleteUserProfile();
      logout();
    } catch (error) {
      console.error("Failed to delete user profile:", error.message);
    }
  };

  if (!userDetails) {
    return <LoadingScreen />;
  }

  return (
    <div className="ProfileSection w-full h-full overflow-y-auto flex flex-col bg-primary">
      <div className="container mx-auto w-full md:w-[75%] px-4 md:px-[15px] pt-4 md:pt-8">
        <div className="grid grid-cols-12 gap-4 md:gap-[30px]">
          <div className="col-span-12 flex flex-col md:flex-row justify-between items-center mb-2 pb-[0.1px] border-b-4 border-white">
            <div className="ProfileTitle font-heading text-[32px] md:text-[48px] text-white mb-2 md:mb-0">
              ACCOUNT INFORMATION
            </div>
            <div className="ProfileNav font-heading text-[18px] md:text-[24px] text-white">
              Home / Account Information
            </div>
          </div>

          <ProfileSection
            title="PERSONAL INFORMATION"
            actionButton={
              <>
                <Button
                  text="EDIT PROFILE"
                  url="/editprofile"
                  customStyles=""
                />
                <div className="absolute top-[80px] md:top-[60px] right-0">
                  <Button text="LOGOUT" onClick={logout} customStyles="" />
                </div>
              </>
            }
            deleteButton={
              <Button
                text="DELETE ACCOUNT"
                onClick={() => setShowDeleteConfirmation(true)}
                className=""
              />
            }
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-2 md:space-y-1"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-0">
                <label className="block font-heading text-white text-[20px] md:text-[27px] w-full md:w-[200px]">
                  First Name:
                </label>
                <div className="font-light text-white text-[18px] md:text-[24px]">
                  {userDetails.firstName}
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-0">
                <label className="block font-heading text-white text-[20px] md:text-[27px] w-full md:w-[200px]">
                  Last Name:
                </label>
                <div className="font-light text-white text-[18px] md:text-[24px]">
                  {userDetails.lastName}
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-0">
                <label className="block font-heading text-white text-[20px] md:text-[27px] w-full md:w-[200px]">
                  E-Mail:
                </label>
                <div className="font-light text-white text-[18px] md:text-[24px]">
                  {userDetails.email}
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-0">
                <label className="block font-heading text-white text-[20px] md:text-[27px] w-full md:w-[200px]">
                  Phone:
                </label>
                <div className="font-light text-white text-[18px] md:text-[24px]">
                  {userDetails.phone}
                </div>
              </div>
            </form>
          </ProfileSection>

          <ProfileSection
            title="PASSWORD"
            actionButton={
              <Button
                text="CHANGE PASSWORD"
                url="/changepass"
                className="!font-body !font-bold bg-primary text-white py-1 md:py-2 px-2 md:px-4 text-[18px] md:text-[24px] focus:outline-none"
              />
            }
            isPasswordSection
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-2 md:space-y-1"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-0">
                <label className="block font-heading text-white text-[20px] md:text-[27px] w-full md:w-[200px]">
                  Password:
                </label>
                <div className="font-light text-white text-[18px] md:text-[24px]">
                  *********
                </div>
              </div>
            </form>
          </ProfileSection>

          <ProfileSection title="PAYMENT HISTORY">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 md:space-y-4"
            >
              {paymentHistory.map((payment, index) => (
                <div
                  key={index}
                  className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors duration-200"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <label className="block font-heading text-white text-[20px] md:text-[27px]">
                        {payment.movieTitle}
                      </label>
                      <div className="text-red-500 font-semibold text-[16px] md:text-[20px]">
                        LKR {payment.amount.toFixed(2)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-300">
                      <div className="font-light text-[16px] md:text-[18px]">
                        <span className="text-gray-400">Booking Date:</span>{" "}
                        {new Date(payment.bookingDate).toLocaleDateString()}
                      </div>
                      <div className="font-light text-[16px] md:text-[18px]">
                        <span className="text-gray-400">Order ID:</span>{" "}
                        {payment.paypalOrderId}
                      </div>
                      <div className="font-light text-[16px] md:text-[18px]">
                        <span className="text-gray-400">Seats:</span>{" "}
                        {payment.seats
                          .map((seat) => seat.seatNumber)
                          .join(", ")}
                      </div>
                      <div className="font-light text-[16px] md:text-[18px]">
                        <span className="text-gray-400">Status:</span>{" "}
                        <span
                          className={`${
                            payment.status === "COMPLETED"
                              ? "text-red-500"
                              : "text-green-500"
                          }`}
                        >
                          {payment.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </form>
          </ProfileSection>
        </div>
      </div>

      {showDeleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-primary p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-white text-2xl mb-4">Are you sure?</h2>
            <p className="text-white mb-6">
              Do you really want to delete your account? This process cannot be
              undone.
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                text="CANCEL"
                onClick={() => setShowDeleteConfirmation(false)}
                className="py-1 md:py-2 px-2 md:px-4 text-[18px] md:text-[24px]"
              />
              <Button
                text="DELETE"
                onClick={handleDeleteAccount}
                className="py-1 md:py-2 px-2 md:px-4 text-[18px] md:text-[24px]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePages;
