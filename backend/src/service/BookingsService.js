'use strict';

const { getDB } = require('../utils/mongoUtil');
const { ObjectId } = require('mongodb');
const { getSocketIO } = require('../utils/socketUtil');

/**
 * Create a new booking
 *
 * body Booking 
 * returns Booking
 **/
exports.createBooking = async function (body, userId) {
  const db = getDB();

  try {
    // Validate seats array
    if (!body.seats || !Array.isArray(body.seats) || body.seats.length === 0) {
      throw new Error('Seats cannot be empty');
    }

    // Calculate total tickets from seat objects
    const totalSeats = body.seats.length;
    const totalTickets = body.adultTickets + body.childTickets;

    if (totalTickets !== totalSeats) {
      throw new Error(`Number of tickets (${totalTickets}) must match number of seats (${totalSeats})`);
    }

    // First, verify the movie exists
    const movie = await db.collection('movies').findOne({
      _id: ObjectId.createFromHexString(body.movieId)
    });

    if (!movie) {
      throw new Error('Invalid movie ID: Movie not found');
    }

    // Verify the seats are still available
    const existingBookings = await db.collection('bookings').find({
      movieId: ObjectId.createFromHexString(body.movieId),
      showtimeId: body.showtimeId,
      'seats.seatNumber': { $in: body.seats.map(s => s.seatNumber) },
      status: { $ne: 'CANCELLED' }
    }).toArray();

    if (existingBookings.length > 0) {
      throw new Error('One or more selected seats are already booked');
    }

    // Create the booking
    const booking = {
      bookingNumber: body.bookingNumber,
      movieId: ObjectId.createFromHexString(body.movieId),
      userId: ObjectId.createFromHexString(userId),
      showtimeId: body.showtimeId,
      seats: body.seats,
      adultTickets: body.adultTickets,
      childTickets: body.childTickets,
      amount: body.amount,
      status: 'PENDING',
      createdAt: new Date(),
      paypalOrderId: body.paypalOrderId || null
    };

    const result = await db.collection('bookings').insertOne(booking);
    const createdBooking = await db.collection('bookings').findOne({
      _id: result.insertedId
    });

    // Emit socket event for booked seats
    const io = getSocketIO();
    io.to(`showtime-${body.showtimeId}`).emit('seats-booked', {
      seats: body.seats.map(seat => seat.seatNumber),
      showtimeId: body.showtimeId,
      bookingId: createdBooking._id.toString()
    });

    return createdBooking;
  } catch (err) {
    throw new Error('Error creating booking: ' + err.message);
  }
};

/**
 * Process payment for a booking
 * Updates DB with payment details
 * body Payment
**/
exports.processPayment = async function (body, userId) {
  const db = getDB();

  try {
    // Find the booking
    const booking = await db.collection('bookings').findOne({
      bookingNumber: body.bookingNumber,
      userId: ObjectId.createFromHexString(userId)
    });

    if (!booking) {
      throw new Error('Booking not found or unauthorized');
    }

    if (booking.status === 'CONFIRMED' || booking.status === 'FAILED') {
      throw new Error('Booking already processed');
    }

    // Check payment status and PayPal order ID
    const isPaymentSuccessful = body.status === 'COMPLETED' && body.paypalOrderId;

    // Update booking status based on payment result
    await db.collection('bookings').updateOne(
      { _id: booking._id },
      {
        $set: {
          status: isPaymentSuccessful ? 'CONFIRMED' : 'FAILED',
          paypalOrderId: body.paypalOrderId,
          paymentMethod: body.paymentMethod,
          amount: body.amount,
          updatedAt: new Date()
        }
      }
    );

    return {
      paypalOrderId: body.paypalOrderId,
      bookingNumber: body.bookingNumber,
      amount: body.amount,
      paymentMethod: body.paymentMethod,
      status: isPaymentSuccessful ? 'COMPLETED' : 'FAILED',
      createdAt: new Date()
    };

  } catch (err) {
    throw new Error('Payment processing error: ' + err.message);
  }
};

/**
 * Get details for a specific showtime
 *
 * showtimeId String ID of the showtime
 * returns ShowtimeDetails
 **/
exports.getShowtimeDetails = async function (showtimeId) {
  const db = getDB();

  try {
    // Find the movie that contains the showtime
    const movie = await db.collection('movies').findOne({
      "cinemas.formats.showtimes.showtimeId": showtimeId
    });

    if (!movie) {
      throw new Error('Showtime not found');
    }

    // Extract showtime details
    let showtimeDetails;
    let cinemaLocation;
    let theatreType;
    let adultTicketPrice;
    let kidTicketPrice;

    movie.cinemas.forEach((cinema) => {
      cinema.formats.forEach((format) => {
        format.showtimes.forEach((showtime) => {
          if (showtime.showtimeId === showtimeId) {
            showtimeDetails = showtime;
            cinemaLocation = cinema.name;
            theatreType = format.type;
            adultTicketPrice = movie.adultTicketPrice;
            kidTicketPrice = movie.kidTicketPrice;
          }
        });
      });
    });

    if (!showtimeDetails) {
      throw new Error('Showtime details not found');
    }
    const bookings = await db.collection('bookings').find({
      showtimeId: showtimeId
    }).toArray();

    const bookedSeats = bookings
      .filter(booking => booking.status === 'PENDING' || booking.status === 'CONFIRMED')
      .flatMap(booking => booking.seats.map(seat => seat.seatNumber));

    return {
      showtimeId: showtimeId,
      movieId: movie._id.toString(),
      movieTitle: movie.title,
      cinemaLocation,
      theatreType,
      time: showtimeDetails.time,
      date: showtimeDetails.date,
      adultTicketPrice,
      kidTicketPrice,
      bookedSeats,
      tallBanner: movie.tallBanner
    };
  } catch (err) {
    throw new Error('Error fetching showtime details: ' + err.message);
  }
};

/**
 * Delete a specific booking
 *
 * bookingId String ID of the booking
 * userId String ID of the user
 * no response value expected for this operation
 **/
exports.deleteBooking = async function (bookingId, userId) {
  const db = getDB();
  try {
    const result = await db.collection('bookings').deleteOne({ _id: ObjectId.createFromHexString(bookingId), userId: ObjectId.createFromHexString(userId) });
    if (result.deletedCount === 0) {
      throw new Error('Booking not found or you do not have permission to delete this booking');
    }
  } catch (err) {
    throw new Error('Error deleting booking: ' + err.message);
  }
}

/**
 * Get details of a specific booking
 *
 * bookingId String ID of the booking
 * userId String ID of the user
 * returns Booking
 **/
exports.getBookingById = async function (bookingId, userId) {
  const db = getDB();
  try {
    const booking = await db.collection('bookings').findOne({ _id: ObjectId.createFromHexString(bookingId), userId: ObjectId.createFromHexString(userId) });
    if (!booking) {
      throw new Error('Booking not found or you do not have permission to view this booking');
    }
    return booking;
  } catch (err) {
    throw new Error('Error fetching booking: ' + err.message);
  }
}

/**
 * Get a list of bookings for a user
 *
 * userId String ID of the user
 * returns List
 **/
exports.getBookings = async function (userId) {
  const db = getDB();
  try {
    // Get all bookings for user
    const bookings = await db.collection('bookings').find({
      userId: ObjectId.createFromHexString(userId)
    }).toArray();

    // Process each booking to get full details
    const bookingHistory = await Promise.all(
      bookings.map(async (booking) => {
        // Find movie with this showtime
        const movie = await db.collection('movies').findOne({
          "cinemas.formats.showtimes.showtimeId": booking.showtimeId
        });

        // Extract showtime details
        let movieTitle = movie.title || '';
        let cinemaLocation = '';
        let theatreType = '';
        let showTime = '';
        let showDate = '';

        if (movie) {
          movie.cinemas.forEach((cinema) => {
            cinema.formats.forEach((format) => {
              format.showtimes.forEach((showtime) => {
                if (showtime.showtimeId === booking.showtimeId) {
                  cinemaLocation = cinema.name;
                  theatreType = format.type;
                  showTime = showtime.time;
                  showDate = showtime.date;
                }
              });
            });
          });
        }

        // Return formatted booking details
        return {
          bookingNumber: booking.bookingNumber,
          movieTitle: movieTitle,
          movieTitle: movie ? movie.title : '',
          seats: booking.seats.map(seat => seat.seatNumber),
          amount: booking.amount,
          status: booking.status,
          createdAt: booking.createdAt,
          cinemaLocation,
          theatreType,
          showTime,
          showDate
        };
      })
    );

    return bookingHistory;
  } catch (err) {
    throw new Error('Error fetching bookings: ' + err.message);
  }
}


/**
 * Get payment history for a user
 *
 * userId String ID of the user
 * returns List
 **/
exports.getPaymentHistory = async function (userId) {
  const db = getDB();
  try {
    // Get all bookings for user
    const bookings = await db.collection('bookings').find({
      userId: ObjectId.createFromHexString(userId)
    }).toArray();

    // Process each booking to get full details
    const bookingHistory = await Promise.all(
      bookings.map(async (booking) => {
        // Find movie with this showtime
        const movie = await db.collection('movies').findOne({
          "cinemas.formats.showtimes.showtimeId": booking.showtimeId
        });

        let movieTitle = movie.title || '';

        return {
          bookingNumber: booking.bookingNumber,
          movieTitle: movieTitle,
          seats: booking.seats.map(seat => seat.seatNumber),
          bookingDate: booking.createdAt,
          paypalOrderId: booking.paypalOrderId || "",
          status: booking.status,
          seats: booking.seats,
          amount: booking.amount,
        };
      })
    );

    return bookingHistory;
  } catch (err) {
    throw new Error('Error fetching bookings: ' + err.message);
  }
}