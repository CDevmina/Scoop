const API_BASE_URL = import.meta.env.BACKEND_URL || 'http://localhost:5001';

const getHeaders = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

const handleResponse = async (response) => {
    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            throw new Error('Authorization header required');
        }
        const error = await response.json();
        throw new Error(error.message || 'Something went wrong');
    }
    return response.json();
};

export const registerUser = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(userData),
    });
    return handleResponse(response);
};

export const loginUser = async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(credentials),
    });
    return handleResponse(response);
};

export const updatePassword = async (passwordData) => {
    const response = await fetch(`${API_BASE_URL}/auth/update-password`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(passwordData),
    });
    return handleResponse(response);
};

export const updateUserProfile = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/update`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(userData),
    });
    return handleResponse(response);
}

export const isAdmin = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/is-admin`, {
        method: 'GET',
        headers: getHeaders(),
    });
    return handleResponse(response);
};

export const getUserDetails = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/user`, {
        method: 'GET',
        headers: getHeaders(),
    });
    return handleResponse(response);
};

export const getMovies = async () => {
    const response = await fetch(`${API_BASE_URL}/movies`, {
        method: 'GET',
        headers: getHeaders(),
    });
    return handleResponse(response);
};

export const getMovieById = async (movieId) => {
    const response = await fetch(`${API_BASE_URL}/movies/${movieId}`, {
        method: 'GET',
        headers: getHeaders(),
    });
    return handleResponse(response);
};
export const addMovie = async (movieData) => {
    const response = await fetch(`${API_BASE_URL}/movies`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(movieData),
    });
    return handleResponse(response);
};

export const updateMovie = async (movieId, movieData) => {
    const response = await fetch(`${API_BASE_URL}/movies/${movieId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(movieData),
    });
    return handleResponse(response);
};

export const deleteMovie = async (movieId) => {
    const response = await fetch(`${API_BASE_URL}/movies/${movieId}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    return handleResponse(response);
};

export const createBooking = async (bookingData) => {
    const response = await fetch(`${API_BASE_URL}/booking`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(bookingData),
    });
    return handleResponse(response);
};

export const getShowtimeDetails = async (showtimeId) => {
    const response = await fetch(`${API_BASE_URL}/booking/showtime/${showtimeId}`, {
        method: 'GET',
        headers: getHeaders(),
    });
    return handleResponse(response);
};

export const getBookings = async () => {
    const response = await fetch(`${API_BASE_URL}/booking`, {
        method: 'GET',
        headers: getHeaders(),
    });
    return handleResponse(response);
}

export const getBookingById = async (bookingId) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
        method: 'GET',
        headers: getHeaders(),
    });
    return handleResponse(response);
};

export const deleteBooking = async (bookingId) => {
    const response = await fetch(`${API_BASE_URL}/booking/${bookingId}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    return handleResponse(response);
};

export const getUserBookings = async () => {
    const response = await fetch(`${API_BASE_URL}/booking`, {
        method: 'GET',
        headers: getHeaders(),
    });
    return handleResponse(response);
};

export const deleteUserProfile = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/delete`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    if (response.status !== 204) {
        const error = await response.json();
        throw new Error(error.message || 'Something went wrong');
    }
}

export const fetchPaymentHistory = async () => {
    const response = await fetch(`${API_BASE_URL}/booking/payment`, {
        method: 'GET',
        headers: getHeaders(),
    });
    return handleResponse(response);
};

export const createBookingSession = async (sessionData) => {
    const response = await fetch(`${API_BASE_URL}/booking/session`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(sessionData)
    });
    return handleResponse(response);
};

export const getBookingSession = async (sessionId) => {
    const response = await fetch(`${API_BASE_URL}/booking/session/${sessionId}`, {
        method: 'GET',
        headers: getHeaders()
    });
    return handleResponse(response);
};

export const updateBookingSession = async (sessionId, sessionData) => {
    const response = await fetch(`${API_BASE_URL}/booking/session/${sessionId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(sessionData)
    });
    return handleResponse(response);
};

export const processPayment = async (paymentData) => {
    const response = await fetch(`${API_BASE_URL}/booking/payment`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(paymentData)
    });
    return handleResponse(response);
};