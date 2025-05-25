const { getDB } = require('../utils/mongoUtil');
const { ObjectId } = require('mongodb');
const MoviesService = require('../service/MoviesService');

// movie-booking-app/backend/src/service/MoviesService.test.js

jest.mock('../utils/mongoUtil');

describe('MoviesService', () => {
    let dbMock;

    beforeAll(() => {
        dbMock = {
            collection: jest.fn().mockReturnThis(),
            find: jest.fn().mockReturnThis(),
            findOne: jest.fn(),
            insertOne: jest.fn(),
            updateOne: jest.fn(),
            deleteOne: jest.fn(),
            toArray: jest.fn()
        };
        getDB.mockReturnValue(dbMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('moviesGET', () => {
        it('should return a list of movies', async () => {
            const movies = [{ title: 'Movie 1' }, { title: 'Movie 2' }];
            dbMock.toArray.mockResolvedValue(movies);

            const result = await MoviesService.moviesGET();
            expect(result).toEqual(movies);
            expect(dbMock.collection).toHaveBeenCalledWith('movies');
            expect(dbMock.find).toHaveBeenCalled();
            expect(dbMock.toArray).toHaveBeenCalled();
        });

        it('should throw an error if fetching movies fails', async () => {
            dbMock.toArray.mockRejectedValue(new Error('Fetch error'));

            await expect(MoviesService.moviesGET()).rejects.toThrow('Error fetching movies: Fetch error');
        });
    });

    describe('getMovieById', () => {
        it('should return movie details for a valid ID', async () => {
            const movie = { title: 'Movie 1' };
            dbMock.findOne.mockResolvedValue(movie);

            const result = await MoviesService.getMovieById('60f1b7e7c50b02b4c8cfc047');
            expect(result).toEqual(movie);
            expect(dbMock.collection).toHaveBeenCalledWith('movies');
            expect(dbMock.findOne).toHaveBeenCalledWith({ _id: ObjectId.createFromHexString('60f1b7e7c50b02b4c8cfc047') });
        });

        it('should throw an error if movie not found', async () => {
            dbMock.findOne.mockResolvedValue(null);

            await expect(MoviesService.getMovieById('60f1b7e7c50b02b4c8cfc047')).rejects.toThrow('Movie not found');
        });

        it('should throw an error if fetching movie fails', async () => {
            dbMock.findOne.mockRejectedValue(new Error('Fetch error'));

            await expect(MoviesService.getMovieById('60f1b7e7c50b02b4c8cfc047')).rejects.toThrow('Error fetching movie: Fetch error');
        });
    });

    describe('addMovie', () => {
        it('should add a new movie and return it', async () => {
            const movie = { title: 'New Movie' };
            const insertedMovie = { _id: '60f1b7e7c50b02b4c8cfc047', ...movie };
            dbMock.insertOne.mockResolvedValue({ insertedId: '60f1b7e7c50b02b4c8cfc047' });
            dbMock.findOne.mockResolvedValue(insertedMovie);

            const result = await MoviesService.addMovie(movie);
            expect(result).toEqual(insertedMovie);
            expect(dbMock.collection).toHaveBeenCalledWith('movies');
            expect(dbMock.insertOne).toHaveBeenCalledWith(movie);
            expect(dbMock.findOne).toHaveBeenCalledWith({ _id: '60f1b7e7c50b02b4c8cfc047' });
        });

        it('should throw an error if adding movie fails', async () => {
            dbMock.insertOne.mockRejectedValue(new Error('Insert error'));

            await expect(MoviesService.addMovie({ title: 'New Movie' })).rejects.toThrow('Error adding movie: Insert error');
        });
    });

    describe('updateMovie', () => {
        it('should update an existing movie and return the updated movie', async () => {
            const movie = { title: 'Updated Movie' };
            dbMock.updateOne.mockResolvedValue({ matchedCount: 1 });

            const result = await MoviesService.updateMovie('60f1b7e7c50b02b4c8cfc047', movie);
            expect(result).toEqual(movie);
            expect(dbMock.collection).toHaveBeenCalledWith('movies');
            expect(dbMock.updateOne).toHaveBeenCalledWith({ _id: ObjectId.createFromHexString('60f1b7e7c50b02b4c8cfc047') }, { $set: movie });
        });

        it('should throw an error if movie not found', async () => {
            dbMock.updateOne.mockResolvedValue({ matchedCount: 0 });

            await expect(MoviesService.updateMovie('60f1b7e7c50b02b4c8cfc047', { title: 'Updated Movie' })).rejects.toThrow('Movie not found');
        });

        it('should throw an error if updating movie fails', async () => {
            dbMock.updateOne.mockRejectedValue(new Error('Update error'));

            await expect(MoviesService.updateMovie('60f1b7e7c50b02b4c8cfc047', { title: 'Updated Movie' })).rejects.toThrow('Error updating movie: Update error');
        });
    });

    describe('deleteMovie', () => {
        it('should delete an existing movie', async () => {
            dbMock.deleteOne.mockResolvedValue({ deletedCount: 1 });

            await MoviesService.deleteMovie('60f1b7e7c50b02b4c8cfc047');
            expect(dbMock.collection).toHaveBeenCalledWith('movies');
            expect(dbMock.deleteOne).toHaveBeenCalledWith({ _id: ObjectId.createFromHexString('60f1b7e7c50b02b4c8cfc047') });
        });

        it('should throw an error if movie not found', async () => {
            dbMock.deleteOne.mockResolvedValue({ deletedCount: 0 });

            await expect(MoviesService.deleteMovie('60f1b7e7c50b02b4c8cfc047')).rejects.toThrow('Movie not found');
        });

        it('should throw an error if deleting movie fails', async () => {
            dbMock.deleteOne.mockRejectedValue(new Error('Delete error'));

            await expect(MoviesService.deleteMovie('60f1b7e7c50b02b4c8cfc047')).rejects.toThrow('Error deleting movie: Delete error');
        });
    });
});