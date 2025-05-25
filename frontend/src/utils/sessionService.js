import { createBookingSession, getBookingSession, updateBookingSession } from './apiService';

/**
 * Create a new booking session and store the session ID locally.
 * @param {Object} sessionData - The data required to create a booking session.
 * @returns {Promise<Object>} - The created session details.
 */
export const createSession = async (sessionData) => {
    try {
        const response = await createBookingSession(sessionData);
        sessionStorage.setItem('bookingSessionId', response.sessionId);
        return response;
    } catch (error) {
        console.error('Failed to create booking session:', error);
        throw error;
    }
};

/**
 * Retrieve the booking session details using the stored session ID.
 * @returns {Promise<Object>} - The session details.
 */
export const fetchSession = async () => {
    const sessionId = sessionStorage.getItem('bookingSessionId');
    if (!sessionId) {
        throw new Error('No booking session found');
    }

    try {
        const sessionDetails = await getBookingSession(sessionId);
        return sessionDetails;
    } catch (error) {
        console.error('Failed to fetch booking session:', error);
        throw error;
    }
};

/**
 * Update the existing booking session.
 * @param {Object} sessionData - The data required to update the booking session.
 * @returns {Promise<Object>} - The updated session details.
 */
export const updateSession = async (sessionData) => {
    const sessionId = sessionStorage.getItem('bookingSessionId');
    if (!sessionId) {
        throw new Error('No booking session found');
    }

    try {
        const response = await updateBookingSession(sessionId, sessionData);
        return response;
    } catch (error) {
        console.error('Failed to update booking session:', error);
        throw error;
    }
};

/**
 * Clear the stored booking session ID.
 */
export const clearSession = () => {
    sessionStorage.removeItem('bookingSessionId');
};