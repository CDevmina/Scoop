const { getDB } = require('./mongoUtil');
const redisClient = require('./redisClient');

const validateShowtime = async (showtimeId) => {
    const db = getDB();

    // Find movie with this showtime
    const movie = await db.collection('movies').findOne({
        "cinemas.formats.showtimes.showtimeId": showtimeId
    });

    if (!movie) {
        throw new Error('Invalid showtime ID: Showtime not found');
    }

    return true;
};

const validateSeats = async (showtimeId, selectedSeats) => {
    const db = getDB();

    // First validate showtime
    await validateShowtime(showtimeId);

    // Then check if seats are already booked
    const existingBookings = await db.collection('bookings').find({
        showtimeId: showtimeId,
        'seats.seatNumber': { $in: selectedSeats },
        status: { $nin: ['CANCELLED', 'FAILED'] }
    }).toArray();

    if (existingBookings.length > 0) {
        throw new Error('One or more selected seats are already booked');
    }

    // Check if seats are locked in Redis
    for (const seat of selectedSeats) {
        const lockKey = `lock_${showtimeId}_${seat}`;
        const isLocked = await redisClient.get(lockKey);
        if (isLocked) {
            throw new Error(`Seat ${seat} is temporarily locked by another user`);
        }
    }
};

const validateSeatsWithSession = async (sessionId, showtimeId, selectedSeats) => {
    const db = getDB();

    // First validate showtime
    await validateShowtime(showtimeId);

    // Then check if seats are already booked
    const existingBookings = await db.collection('bookings').find({
        showtimeId: showtimeId,
        'seats.seatNumber': { $in: selectedSeats },
        status: { $nin: ['CANCELLED', 'FAILED'] }
    }).toArray();

    if (existingBookings.length > 0) {
        throw new Error('One or more selected seats are already booked');
    }

    // Check if seats are locked in Redis
    for (const seat of selectedSeats) {
        const lockKey = `lock_${showtimeId}_${seat}`;
        const lockingSessionId = await redisClient.get(lockKey);

        // Only throw error if locked by a different session
        if (lockingSessionId && lockingSessionId !== sessionId) {
            throw new Error(`Seat ${seat} is temporarily locked by another user`);
        }
    }

    return true;
};

const validateSessionData = (body) => {
    if (!body.showtimeId) {
        throw new Error('Showtime ID is required');
    }
    if (!Array.isArray(body.selectedSeats)) {
        throw new Error('Selected seats must be an array');
    }
    console.log(body.selectedSeats);
    if (body.selectedSeats.length > 7) {
        throw new Error('Maximum 6 seats allowed per booking');
    }
    if (body.selectedSeats.length > 0 && (body.adultTickets + body.childTickets !== body.selectedSeats.length)) {
        throw new Error('Number of tickets must match number of selected seats');
    }
};

module.exports = {
    validateShowtime,
    validateSeats,
    validateSeatsWithSession,
    validateSessionData
};