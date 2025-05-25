const { getDB } = require('../utils/mongoUtil');
const { ObjectId } = require('mongodb');
const BookingsService = require('../service/BookingsService');
const { getSocketIO } = require('../utils/socketUtil');

jest.mock('../utils/mongoUtil');
jest.mock('../utils/socketUtil');

describe('BookingsService', () => {
  let dbMock;
  let ioMock;

  beforeAll(() => {
    dbMock = {
      collection: jest.fn().mockReturnThis(),
      find: jest.fn().mockReturnThis(),
      findOne: jest.fn(),
      insertOne: jest.fn(),
      deleteOne: jest.fn(),
      toArray: jest.fn()
    };
    getDB.mockReturnValue(dbMock);

    ioMock = {
      emit: jest.fn()
    };
    getSocketIO.mockReturnValue(ioMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createBooking', () => {
    it('should create a new booking and return it, emitting socket events', async () => {
      const body = {
        movieId: '60f1b7e7c50b02b4c8cfc047',
        seats: ['A1', 'A2'],
        bookingStartTime: '2024-12-02T18:00:00Z',
        theatreName: 'Grand Cinema',
        movieHallNumber: 5
      };
      const userId = '60f1b7e7c50b02b4c8cfc048';
      const movie = { title: 'Movie 1' };
      const insertedBooking = { _id: '60f1b7e7c50b02b4c8cfc049', ...body, userId: ObjectId.createFromHexString(userId), bookingRequestDate: expect.any(Date) };

      dbMock.findOne.mockResolvedValueOnce(movie);
      dbMock.toArray.mockResolvedValueOnce([]);
      dbMock.insertOne.mockResolvedValueOnce({ insertedId: '60f1b7e7c50b02b4c8cfc049' });
      dbMock.findOne.mockResolvedValueOnce(insertedBooking);

      const result = await BookingsService.createBooking(body, userId);
      expect(result).toEqual(insertedBooking);
      expect(dbMock.collection).toHaveBeenCalledWith('movies');
      expect(dbMock.collection).toHaveBeenCalledWith('bookings');
      expect(dbMock.insertOne).toHaveBeenCalledWith(expect.objectContaining({
        movieId: ObjectId.createFromHexString(body.movieId),
        userId: ObjectId.createFromHexString(userId),
        seats: body.seats,
        bookingRequestDate: expect.any(Date),
        bookingStartTime: new Date(body.bookingStartTime),
        theatreName: body.theatreName,
        movieHallNumber: body.movieHallNumber
      }));
      expect(ioMock.emit).toHaveBeenCalledWith('booking-started', { seats: body.seats });
      expect(ioMock.emit).toHaveBeenCalledWith('booking-ended', { seats: body.seats });
    });

    it('should emit booking-error event if creating booking fails', async () => {
      const body = {
        movieId: '60f1b7e7c50b02b4c8cfc047',
        seats: ['A1', 'A2'],
        bookingStartTime: '2024-12-02T18:00:00Z',
        theatreName: 'Grand Cinema',
        movieHallNumber: 5
      };
      const userId = '60f1b7e7c50b02b4c8cfc048';

      dbMock.findOne.mockResolvedValueOnce(null);

      await expect(BookingsService.createBooking(body, userId)).rejects.toThrow('Invalid movie ID: Movie not found');
      expect(ioMock.emit).toHaveBeenCalledWith('booking-started', { seats: body.seats });
      expect(ioMock.emit).toHaveBeenCalledWith('booking-error', { seats: body.seats });
    });
  });

  describe('getBookingsForMovie', () => {
    it('should return a list of bookings for a specific movie', async () => {
      const bookings = [{ seats: ['A1', 'A2'] }, { seats: ['B1', 'B2'] }];
      dbMock.toArray.mockResolvedValue(bookings);

      const result = await BookingsService.getBookingsForMovie('60f1b7e7c50b02b4c8cfc047');
      expect(result).toEqual(bookings);
      expect(dbMock.collection).toHaveBeenCalledWith('bookings');
      expect(dbMock.find).toHaveBeenCalledWith({ movieId: ObjectId.createFromHexString('60f1b7e7c50b02b4c8cfc047') });
      expect(dbMock.toArray).toHaveBeenCalled();
    });

    it('should throw an error if fetching bookings fails', async () => {
      dbMock.toArray.mockRejectedValue(new Error('Fetch error'));

      await expect(BookingsService.getBookingsForMovie('60f1b7e7c50b02b4c8cfc047')).rejects.toThrow('Error fetching bookings for movie: Fetch error');
    });
  });

  describe('deleteBooking', () => {
    it('should delete an existing booking', async () => {
      dbMock.deleteOne.mockResolvedValue({ deletedCount: 1 });

      await BookingsService.deleteBooking('60f1b7e7c50b02b4c8cfc047', '60f1b7e7c50b02b4c8cfc048');
      expect(dbMock.collection).toHaveBeenCalledWith('bookings');
      expect(dbMock.deleteOne).toHaveBeenCalledWith({ _id: ObjectId.createFromHexString('60f1b7e7c50b02b4c8cfc047'), userId: ObjectId.createFromHexString('60f1b7e7c50b02b4c8cfc048') });
    });

    it('should throw an error if booking not found', async () => {
      dbMock.deleteOne.mockResolvedValue({ deletedCount: 0 });

      await expect(BookingsService.deleteBooking('60f1b7e7c50b02b4c8cfc047', '60f1b7e7c50b02b4c8cfc048')).rejects.toThrow('Booking not found or you do not have permission to delete this booking');
    });

    it('should throw an error if deleting booking fails', async () => {
      dbMock.deleteOne.mockRejectedValue(new Error('Delete error'));

      await expect(BookingsService.deleteBooking('60f1b7e7c50b02b4c8cfc047', '60f1b7e7c50b02b4c8cfc048')).rejects.toThrow('Error deleting booking: Delete error');
    });
  });

  describe('getBookingById', () => {
    it('should return booking details for a valid ID', async () => {
      const booking = { seats: ['A1', 'A2'] };
      dbMock.findOne.mockResolvedValue(booking);

      const result = await BookingsService.getBookingById('60f1b7e7c50b02b4c8cfc047', '60f1b7e7c50b02b4c8cfc048');
      expect(result).toEqual(booking);
      expect(dbMock.collection).toHaveBeenCalledWith('bookings');
      expect(dbMock.findOne).toHaveBeenCalledWith({ _id: ObjectId.createFromHexString('60f1b7e7c50b02b4c8cfc047'), userId: ObjectId.createFromHexString('60f1b7e7c50b02b4c8cfc048') });
    });

    it('should throw an error if booking not found', async () => {
      dbMock.findOne.mockResolvedValue(null);

      await expect(BookingsService.getBookingById('60f1b7e7c50b02b4c8cfc047', '60f1b7e7c50b02b4c8cfc048')).rejects.toThrow('Booking not found or you do not have permission to view this booking');
    });

    it('should throw an error if fetching booking fails', async () => {
      dbMock.findOne.mockRejectedValue(new Error('Fetch error'));

      await expect(BookingsService.getBookingById('60f1b7e7c50b02b4c8cfc047', '60f1b7e7c50b02b4c8cfc048')).rejects.toThrow('Error fetching booking: Fetch error');
    });
  });

  describe('getBookings', () => {
    it('should return a list of bookings for a user', async () => {
      const bookings = [{ seats: ['A1', 'A2'] }, { seats: ['B1', 'B2'] }];
      dbMock.toArray.mockResolvedValue(bookings);

      const result = await BookingsService.getBookings('60f1b7e7c50b02b4c8cfc048');
      expect(result).toEqual(bookings);
      expect(dbMock.collection).toHaveBeenCalledWith('bookings');
      expect(dbMock.find).toHaveBeenCalledWith({ userId: ObjectId.createFromHexString('60f1b7e7c50b02b4c8cfc048') });
      expect(dbMock.toArray).toHaveBeenCalled();
    });

    it('should throw an error if fetching bookings fails', async () => {
      dbMock.toArray.mockRejectedValue(new Error('Fetch error'));

      await expect(BookingsService.getBookings('60f1b7e7c50b02b4c8cfc048')).rejects.toThrow('Error fetching bookings: Fetch error');
    });
  });
});