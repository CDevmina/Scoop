const redisClient = require('./redisClient');
const { getSocketIO } = require('./socketUtil');

const SESSION_DURATION = 900;
const LOCK_DURATION = 600;

const BookingSessionService = {
    async createSession(sessionData) {
        const sessionId = `booking_${Date.now()}_${Math.random().toString(36).substring(7)}`;

        // Lock seats in Redis
        for (const seat of sessionData.selectedSeats) {
            const lockKey = `lock_${sessionData.showtimeId}_${seat}`;
            const isLocked = await redisClient.get(lockKey);

            if (isLocked) {
                throw new Error(`Seat ${seat} is already locked`);
            }

            await redisClient.setEx(lockKey, LOCK_DURATION, sessionId);
        }

        // Broadcast seat lock to other users
        const io = getSocketIO();
        io.to(`showtime-${sessionData.showtimeId}`).emit('seats-locked', {
            seats: sessionData.selectedSeats,
            sessionId
        });

        // Store session data
        await redisClient.setEx(sessionId, SESSION_DURATION, JSON.stringify(sessionData));
        return sessionId;
    },

    async getSession(sessionId) {
        try {
            const sessionData = await redisClient.get(sessionId);
            if (!sessionData) {
                return null;
            }
            return JSON.parse(sessionData);
        } catch (error) {
            throw new Error(`Failed to get session: ${error.message}`);
        }
    },

    async updateSession(sessionId, sessionData) {
        try {
            if (!sessionId || typeof sessionId !== 'string') {
                throw new Error('Invalid session ID format');
            }

            // Get existing session first
            const existingSession = await this.getSession(sessionId);
            if (!existingSession) {
                throw new Error('Session not found');
            }

            // Update session in Redis
            await redisClient.setEx(sessionId, SESSION_DURATION, JSON.stringify(sessionData));

            // Handle seat changes
            if (sessionData.selectedSeats !== existingSession.selectedSeats) {
                // Remove old seat locks
                for (const seat of existingSession.selectedSeats) {
                    const lockKey = `lock_${sessionData.showtimeId}_${seat}`;
                    await redisClient.del(lockKey);
                }

                // Add new seat locks
                for (const seat of sessionData.selectedSeats) {
                    const lockKey = `lock_${sessionData.showtimeId}_${seat}`;
                    await redisClient.setEx(lockKey, LOCK_DURATION, sessionId);
                }
            }

            return sessionData;
        } catch (error) {
            throw new Error(`Failed to update session: ${error.message}`);
        }
    },

    async deleteSession(sessionId) {
        const session = await this.getSession(sessionId);
        if (session) {
            // Remove seat locks
            for (const seat of session.selectedSeats) {
                const lockKey = `lock_${session.showtimeId}_${seat}`;
                await redisClient.del(lockKey);
            }

            // Broadcast seat unlock
            const io = getSocketIO();
            io.to(`showtime-${session.showtimeId}`).emit('seats-unlocked', {
                seats: session.selectedSeats,
                sessionId
            });

            // Delete session
            await redisClient.del(sessionId);
        }
    }
};

module.exports = BookingSessionService;