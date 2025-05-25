'use strict';

const BookingSessionService = require('../utils/redisService.js');
const { getSocketIO } = require('../utils/socketUtil');
const { validateSessionData, validateSeats, validateSeatsWithSession } = require('../utils/validators');

exports.createBookingSession = async function (body, userId) {
    try {
        // Validate input data
        validateSessionData(body);

        // Validate seats availability
        await validateSeats(body.showtimeId, body.selectedSeats);

        // Generate unique booking number
        const bookingNumber = `BK${Date.now()}${Math.random().toString(36)}`;

        const sessionData = {
            userId: userId,
            showtimeId: body.showtimeId,
            bookingNumber: bookingNumber,
            selectedSeats: body.selectedSeats,
            adultTickets: body.adultTickets || 0,
            childTickets: body.childTickets || 0,
            timestamp: Date.now()
        };

        // Create session and lock seats
        const sessionId = await BookingSessionService.createSession(sessionData);

        // Emit socket event
        const io = getSocketIO();
        io.to(`showtime-${sessionData.showtimeId}`).emit('session-created', {
            sessionId,
            selectedSeats: sessionData.selectedSeats
        });

        return {
            sessionId,
            message: 'Booking session created successfully',
            expiresIn: 900
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

exports.getBookingSession = async function (sessionId, userId) {
    try {
        const session = await BookingSessionService.getSession(sessionId);
        if (!session) {
            throw new Error('Session not found');
        }
        if (session.userId !== userId) {
            throw new Error('Unauthorized');
        }
        return session;
    } catch (error) {
        throw new Error(error.message);
    }
};

exports.updateBookingSession = async function (sessionId, body, userId) {
    try {
        // Validate input data
        validateSessionData(body);

        // Get existing session
        const existingSession = await BookingSessionService.getSession(sessionId);
        if (!existingSession) {
            throw new Error('Session not found');
        }

        // Verify user owns the session
        if (existingSession.userId !== userId) {
            throw new Error('Unauthorized');
        }

        // If seats changed, validate new seats
        if (body.selectedSeats && JSON.stringify(body.selectedSeats) !== JSON.stringify(existingSession.selectedSeats)) {
            await validateSeatsWithSession(sessionId, existingSession.showtimeId, body.selectedSeats);
        }

        // Prepare update data
        const updatedSessionData = {
            ...existingSession,
            selectedSeats: body.selectedSeats || existingSession.selectedSeats,
            adultTickets: body.adultTickets || existingSession.adultTickets,
            childTickets: body.childTickets || existingSession.childTickets,
            timestamp: Date.now()
        };

        // Update session in Redis
        await BookingSessionService.updateSession(sessionId, updatedSessionData);

        // Emit socket events for seat changes
        const io = getSocketIO();
        if (body.selectedSeats) {
            // Unlock old seats
            io.to(`showtime-${existingSession.showtimeId}`).emit('seats-unlocked', {
                seats: existingSession.selectedSeats,
                sessionId
            });

            // Lock new seats
            io.to(`showtime-${existingSession.showtimeId}`).emit('seats-locked', {
                seats: body.selectedSeats,
                sessionId
            });
        }

        return {
            message: 'Session updated successfully',
            sessionId,
            ...updatedSessionData
        };
    } catch (error) {
        throw new Error(error.message);
    }
};