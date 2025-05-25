import React, { useState, useMemo } from "react";
import TableHeader from "./TableHeader";
import { sampleBookings } from "../config/bookings";
import { bookingColumns } from "../config/bookingColumns";

function ManageBookings() {
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [bookings, setBookings] = useState(sampleBookings);
  const [expandedId, setExpandedId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleSort = (field) => {
    const order = field === sortField && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setDeleteId(id);
  };

  const handleConfirmDelete = (e) => {
    e.stopPropagation();
    setBookings(bookings.filter(booking => booking.id !== deleteId));
    setDeleteId(null);
    setExpandedId(null);
  };

  const handleCancelDelete = (e) => {
    e.stopPropagation();
    setDeleteId(null);
  };

  const sortedBookings = useMemo(() => {
    if (!sortField) return bookings;

    return [...bookings].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle different data types
      if (sortField === 'amountPaid') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      } else if (sortField === 'seatsBooked') {
        aValue = aValue.join(', ');
        bValue = bValue.join(', ');
      } else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (sortOrder === 'asc') {
        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
      } else {
        if (aValue > bValue) return -1;
        if (aValue < bValue) return 1;
      }
      return 0;
    });
  }, [bookings, sortField, sortOrder]);

  const filteredBookings = useMemo(() => {
    return sortedBookings.filter(booking => {
      const searchString = searchTerm.toLowerCase();
      return (
        booking.bookingNumber.toLowerCase().includes(searchString) ||
        booking.userEmail.toLowerCase().includes(searchString) ||
        booking.amountPaid.toString().includes(searchString) ||
        booking.seatsBooked.join(', ').toLowerCase().includes(searchString) ||
        booking.movieName.toLowerCase().includes(searchString) ||
        booking.orderId.toLowerCase().includes(searchString) ||
        booking.paymentMethod.toLowerCase().includes(searchString)
      );
    });
  }, [sortedBookings, searchTerm]);

  return (
    <div className="p-2 sm:p-4">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-white">Manage Bookings</h1>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search bookings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 text-sm sm:text-base rounded-lg bg-gray-700 text-white"
        />
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-700">
            <TableHeader
              columns={bookingColumns}
              sortField={sortField}
              sortOrder={sortOrder}
              handleSort={handleSort}
            />
            <tbody className="divide-y divide-gray-700">
              {filteredBookings.map((booking) => (
                <React.Fragment key={booking.id}>
                  <tr 
                    className="bg-gray-800 hover:bg-gray-700 cursor-pointer text-xs sm:text-sm"
                    onClick={() => toggleExpand(booking.id)}
                  >
                    <td className="px-2 sm:px-4 py-2 sm:py-4 text-white whitespace-nowrap">{booking.bookingNumber}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-4 text-white whitespace-nowrap">{booking.userEmail}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-4 text-white whitespace-nowrap">${booking.amountPaid}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-4 text-white whitespace-nowrap">{booking.seatsBooked.join(', ')}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-4">
                      <div className="flex justify-center sm:justify-start">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(e, booking.id);
                          }}
                          className="w-full sm:w-auto bg-red-600 text-white px-3 py-1.5 text-xs sm:text-sm rounded-md hover:bg-red-700 transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedId === booking.id && (
                    <tr className="bg-gray-900">
                      <td colSpan="5" className="p-2 sm:p-4">
                        <div className="text-white space-y-2 text-xs sm:text-sm">
                          <p><span className="font-bold">Movie:</span> {booking.movieName}</p>
                          <p><span className="font-bold">Movie Date:</span> {new Date(booking.movieDate).toLocaleDateString()}</p>
                          <p>
                            <span className="font-bold">Time Slot:</span>{' '}
                            {new Date(booking.timeSlot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                            {' - '}
                            {new Date(booking.timeSlot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <p><span className="font-bold">Date Paid:</span> {new Date(booking.datePaid).toLocaleDateString()}</p>
                          <p><span className="font-bold">Order ID:</span> {booking.orderId}</p>
                          <p><span className="font-bold">Payment Method:</span> {booking.paymentMethod}</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-sm mx-auto">
            <h3 className="text-lg font-bold text-white mb-4">Confirm Delete</h3>
            <p className="text-white mb-4">Are you sure you want to delete this booking?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleConfirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={handleCancelDelete}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageBookings;