## Backend and API

The backend of this application is built using Node.js and Express, and it provides a RESTful API for managing movies, bookings, and user authentication. The backend uses MongoDB as the database to store data.

## Running the Backend with Docker

To run the backend server using Docker, navigate to the `movie-booking-app/` directory and execute the following command in Git Bash:

```sh
. up.sh
```

## API Endpoints

The REST API provides the following endpoints:

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
