## Project Overview

This project is a full-stack application designed for booking and reserving movies. It consists of a frontend built with React and a backend built with Node.js and Express. The backend uses MongoDB as the database to store data.

## Frontend

The frontend of the application is built using React and Vite. It provides a user-friendly interface for users to browse movies, make bookings, and manage their reservations.

### Key Features

- **Movie Listings**: Users can view a list of available movies.
- **Movie Details**: Users can view detailed information about each movie.
- **Booking**: Users can book seats for a selected movie.
- **User Authentication**: Users can register and log in to manage their bookings.

### Technologies Used

- React
- Vite
- Tailwind CSS

### Running the Frontend

To run the frontend, navigate to the `frontend` directory and execute the following commands:

```sh
npm install
npm run dev
```

Once the development server starts, the frontend will be available at:
**http://localhost:5173**

The Vite development server will automatically open your browser to this URL, or you can manually navigate to it.

## Backend

The backend of the application is built using Node.js and Express. It provides a RESTful API for managing movies, bookings, and user authentication. The backend uses MongoDB as the database to store data.

### Key Features

- **User Authentication**: Users can register and log in.
- **Movie Management**: Admins can add, update, and delete movies.
- **Booking Management**: Users can create and view their bookings.

### Technologies Used

- Node.js
- Express
- MongoDB
- JWT for authentication

### Running the Backend

To run the backend, navigate to the `backend` directory and execute the following commands:

```sh
npm install
npm start
```

The backend API will be available at:
**http://localhost:5001**

## Running with Docker

To run the entire application using Docker, navigate to the project root directory and execute the following command:

```sh
. up.sh
```

This will start the frontend, backend, and MongoDB services using Docker Compose.

When running with Docker:
- **Frontend**: http://localhost (port 80)
- **Backend**: http://localhost:5001
- **MongoDB**: Available internally to the application

## Environment Configuration

Before running the application, you need to configure the environment variables in the `.env` file. Create a `.env` file in the root directory and add the following variables:

```properties
# Frontend environment variables
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id_here
NODE_ENV=development
BACKEND_URL=http://localhost:5001

# Backend environment variables
MONGO_URI=your_mongodb_connection_string_here
NODE_PORT=5001
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://localhost
REDIS_URL=redis://default:your_redis_password@redis:6379

# Redis password
REDIS_PASSWORD=your_redis_password_here
```

### Required Environment Variables:

- **VITE_PAYPAL_CLIENT_ID**: Your PayPal client ID for payment processing
- **NODE_ENV**: Application environment (development/production)
- **BACKEND_URL**: URL where the backend API is accessible
- **MONGO_URI**: MongoDB connection string (Atlas or local MongoDB)
- **NODE_PORT**: Port number for the backend server
- **JWT_SECRET**: Secret key for JWT token generation and verification
- **FRONTEND_URL**: URL where the frontend is accessible
- **REDIS_URL**: Redis connection string for caching and session management
- **REDIS_PASSWORD**: Password for Redis authentication

**Important**: Replace the placeholder values with your actual configuration values before running the application.

## API Endpoints

### Authentication

- **Register a new user**

  - **POST** `/auth/register`
  - Request body:
    ```json
    {
      "name": "John Doe",
      "email": "johndoe@example.com",
      "password": "password123",
      "phone": "1234567890"
    }
    ```
  - Responses:
    - `201`: User registered successfully
    - `400`: Invalid input

- **Login a user**
  - **POST** `/auth/login`
  - Request body:
    ```json
    {
      "email": "johndoe@example.com",
      "password": "password123"
    }
    ```
  - Responses:
    - `200`: Login successful
    - `401`: Unauthorized

### Movies

- **Get a list of movies**

  - **GET** `/movies`
  - Responses:
    - `200`: A list of movies

- **Get details of a specific movie**

  - **GET** `/movies/{movieId}`
  - Parameters:
    - `movieId` (string): ID of the movie
  - Responses:
    - `200`: Movie details
    - `404`: Movie not found

- **Add a new movie**

  - **POST** `/movies`
  - Request body:
    ```json
    {
      "title": "The Dark Knight",
      "description": "A gripping tale of Batman's fight against the Joker.",
      "releaseDate": "2008-07-18",
      "duration": 152,
      "genre": "Action"
    }
    ```
  - Responses:
    - `201`: Movie added successfully
    - `400`: Invalid input

- **Update an existing movie**

  - **PUT** `/movies/{movieId}`
  - Parameters:
    - `movieId` (string): ID of the movie
  - Request body:
    ```json
    {
      "title": "The Dark Knight",
      "description": "A gripping tale of Batman's fight against the Joker.",
      "releaseDate": "2008-07-18",
      "duration": 152,
      "genre": "Action"
    }
    ```
  - Responses:
    - `200`: Movie updated successfully
    - `400`: Invalid input
    - `404`: Movie not found

- **Delete a movie**
  - **DELETE** `/movies/{movieId}`
  - Parameters:
    - `movieId` (string): ID of the movie
  - Responses:
    - `204`: Movie deleted successfully
    - `404`: Movie not found

### Bookings

- **Get details of a specific booking**

  - **GET** `/bookings/{bookingId}`
  - Parameters:
    - `bookingId` (string): ID of the booking
  - Responses:
    - `200`: Booking details

- **Create a booking**
  - **POST** `/bookings`
  - Request body:
    ```json
    {
      "movieId": "640f1b7e7c50b02b4c8cfc03",
      "seats": ["A1", "A2"],
      "bookingDate": "2024-12-02T14:00:00Z"
    }
    ```
  - Responses:
    - `201`: Booking created successfully
    - `400`: Invalid input

### Security

The API uses Bearer Authentication with JWT (JSON Web Tokens). The `Authorization` header should be included in requests to protected endpoints, with the token prefixed by "Bearer ":

```
Authorization: Bearer <token>
```
