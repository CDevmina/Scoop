'use strict';

var utils = require('../utils/writer.js');
var Bookings = require('../service/BookingsService');

module.exports.createBooking = function createBooking(req, res, next, body) {
  const userId = req.user && req.user.userId;
  Bookings.createBooking(body, userId)
    .then(function (response) {
      utils.writeJson(res, response, 201);
    })
    .catch(function (response) {
      utils.writeJson(res, { message: response.message }, 400);
    });
};

module.exports.getShowtimeDetails = function getShowtimeDetails(req, res, next, showtimeId) {
  Bookings.getShowtimeDetails(showtimeId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, { message: response.message }, 400);
    });
};

module.exports.deleteBooking = function deleteBooking(req, res, next, bookingId) {
  const userId = req.user && req.user.userId;
  Bookings.deleteBooking(bookingId, userId)
    .then(function (response) {
      utils.writeJson(res, null, 204);
    })
    .catch(function (response) {
      utils.writeJson(res, { message: response.message }, 404);
    });
};

module.exports.getBookingById = function getBookingById(req, res, next, bookingId) {
  const userId = req.user && req.user.userId;
  Bookings.getBookingById(bookingId, userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getBookings = function getBookings(req, res, next) {
  const userId = req.user && req.user.userId;
  Bookings.getBookings(userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.processPayment = function processPayment(req, res, next, body) {
  const userId = req.user && req.user.userId;
  Bookings.processPayment(body, userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, { message: response.message }, 400);
    });
};

module.exports.getPaymentHistory = function getPaymentHistory(req, res, next) {
  const userId = req.user && req.user.userId;
  Bookings.getPaymentHistory(userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};