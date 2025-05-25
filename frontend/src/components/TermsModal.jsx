import PropTypes from "prop-types";

export default function TermsModal({ onAgree, onDisagree }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative bg-white dark:bg-gray-700 rounded-lg shadow-lg w-full max-w-2xl mx-4 p-6">
        <header className="flex justify-between items-center mb-4">
          <h3
            id="modal-title"
            className="text-xl font-semibold text-gray-900 dark:text-white"
          >
            Scoop Cinemas Terms and Conditions
          </h3>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-900 rounded-lg text-sm w-8 h-8"
            onClick={onDisagree}
            aria-label="Close modal"
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </header>

        <main className="space-y-4">
          <ul className="list-disc pl-5 text-base leading-relaxed text-gray-500 dark:text-gray-400">
            <li>
              The website is for personal use only. Do not use it for commercial
              purposes or in any way that is unlawful or harmful.
            </li>
            <li>
              All payments are subject to the terms and conditions of each bank.
              We do not retain your payment details.
            </li>
            <li>
              All sales are final. No cancellations, exchanges, or rebookings
              will be accepted.
            </li>
            <li>
              Scoop Cinemas reserves the right to not screen a movie due to
              unavoidable circumstances. In such cases, refunds will be made to
              valid ticket holders.
            </li>
            <li>
              No food or beverage from outside is permitted at the cinema
              premises.
            </li>
            <li>
              It is your responsibility to ensure that you carry the original
              booking receipt to the theater.
            </li>
            <li>
              The laws of the Republic of Sri Lanka govern these terms and
              conditions.
            </li>
          </ul>
          <p className="text-base leading-relaxed dark:text-red-500">
            Please read our full terms and conditions{" "}
            <a
              href="https://www.scoopcinemas.com/terms-and-conditions"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              here
            </a>
            .
          </p>
        </main>

        <footer className="flex justify-end mt-6 space-x-3">
          <button
            type="button"
            className="py-2.5 px-5 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            onClick={onDisagree}
          >
            Disagree
          </button>
          <button
            type="button"
            className="text-white bg-[#e5090f] hover:bg-[#c1080c] focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
            onClick={onAgree}
          >
            Agree
          </button>
        </footer>
      </div>
    </div>
  );
}

TermsModal.propTypes = {
  onAgree: PropTypes.func.isRequired,
  onDisagree: PropTypes.func.isRequired,
};
