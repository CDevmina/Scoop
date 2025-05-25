'use strict';

var utils = require('../utils/writer.js');
var Movies = require('../service/MoviesService');

module.exports.moviesGET = function moviesGET(req, res, next) {
  Movies.moviesGET()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response, 400);
    });
};

module.exports.getMovieById = function getMovieById(req, res, next, movieId) {
  Movies.getMovieById(movieId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, { message: response.message }, 404);
    });
};

module.exports.addMovie = function addMovie(req, res, next, body) {
  Movies.addMovie(body)
    .then(function (response) {
      utils.writeJson(res, response, 201);
    })
    .catch(function (response) {
      utils.writeJson(res, { message: response.message }, 400);
    });
};

module.exports.updateMovie = function updateMovie(req, res, next, body, movieId) {
  Movies.updateMovie(movieId, body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, { message: response.message }, 400);
    });
};

module.exports.deleteMovie = function deleteMovie(req, res, next, movieId) {
  Movies.deleteMovie(movieId)
    .then(function () {
      utils.writeJson(res, null, 204);
    })
    .catch(function (response) {
      utils.writeJson(res, { message: response.message }, 404);
    });
};