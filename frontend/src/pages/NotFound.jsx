import Button from "../components/Button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-primary text-white">
      <h1 className="text-8xl font-heading mb-4">404</h1>
      <h2 className="text-4xl font-heading mb-8">Page Not Found</h2>
      <p className="text-xl mb-8 text-center">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Button text="BACK TO HOME" url="/" />
    </div>
  );
}
