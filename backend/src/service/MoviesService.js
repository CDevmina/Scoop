'use strict';

const { getDB } = require('../utils/mongoUtil');
const { ObjectId } = require('mongodb');

/**
 * Get a list of movies
 *
 * returns List
 **/
exports.moviesGET = async function () {
  const db = getDB();

  try {
    const movies = await db.collection('movies').find({}).toArray();
    return movies;
  } catch (err) {
    throw new Error('Error fetching movies: ' + err.message);
  }
}

/**
 * Get details of a specific movie
 *
 * movieId String ID of the movie
 * returns Movie
 **/
exports.getMovieById = async function (movieId) {
  const db = getDB();

  try {
    const movie = await db.collection('movies').findOne({ _id: ObjectId.createFromHexString(movieId) });
    if (!movie) {
      throw new Error('Movie not found');
    }
    return movie;
  } catch (err) {
    throw new Error('Error fetching movie: ' + err.message);
  }
}

/**
 * Add a new movie
 *
 * body Movie Movie object that needs to be added
 * returns Movie
 **/
exports.addMovie = async function (body) {
  const db = getDB();

  try {
    const result = await db.collection('movies').insertOne(body);
    const insertedMovie = await db.collection('movies').findOne({ _id: result.insertedId });
    return insertedMovie;
  } catch (err) {
    throw new Error('Error adding movie: ' + err.message);
  }
}

/**
 * Update an existing movie
 *
 * movieId String ID of the movie
 * body Movie Movie object that needs to be updated
 * returns Movie
 **/
exports.updateMovie = async function (movieId, body) {
  const db = getDB();

  try {
    const result = await db.collection('movies').updateOne({ _id: ObjectId.createFromHexString(movieId) }, { $set: body });
    if (result.matchedCount === 0) {
      throw new Error('Movie not found');
    }
    return body;
  } catch (err) {
    throw new Error('Error updating movie: ' + err.message);
  }
}

/**
 * Delete a movie
 *
 * movieId String ID of the movie
 * returns void
 **/
exports.deleteMovie = async function (movieId) {
  const db = getDB();

  try {
    const result = await db.collection('movies').deleteOne({ _id: ObjectId.createFromHexString(movieId) });
    if (result.deletedCount === 0) {
      throw new Error('Movie not found');
    }
  } catch (err) {
    throw new Error('Error deleting movie: ' + err.message);
  }
}