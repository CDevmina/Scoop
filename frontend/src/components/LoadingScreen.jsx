import { ClipLoader } from "react-spinners";

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-primary">
      <ClipLoader color="#E5090F" size={150} />
    </div>
  );
};

export default LoadingScreen;
