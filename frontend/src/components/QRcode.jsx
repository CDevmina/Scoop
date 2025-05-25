import { QRCodeSVG } from "qrcode.react";
import PropTypes from "prop-types";

const BookingQRCode = ({ bookingNumber }) => {
  return (
    <div className="bg-white p-4 rounded-lg inline-block">
      <QRCodeSVG
        value={bookingNumber}
        size={128}
        level="H"
        includeMargin={true}
      />
    </div>
  );
};

BookingQRCode.propTypes = {
  bookingNumber: PropTypes.string.isRequired,
};

export default BookingQRCode;
