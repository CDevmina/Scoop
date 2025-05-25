'use strict';

const utils = require('../utils/writer.js');
const Sessions = require('../service/SessionsService');

module.exports.createBookingSession = function createBookingSession(req, res, next) {
    const userId = req.user && req.user.userId;
    Sessions.createBookingSession(req.body, userId)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (error) {
            utils.writeJson(res, { message: error.message }, 400);
        });
};

module.exports.getBookingSession = function getBookingSession(req, res, next, sessionId) {
    const userId = req.user && req.user.userId;
    Sessions.getBookingSession(sessionId, userId)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (error) {
            utils.writeJson(res, { message: error.message }, 404);
        });
};

module.exports.updateBookingSession = function updateBookingSession(req, res, next, body, sessionId) {
    const userId = req.user && req.user.userId;
    Sessions.updateBookingSession(sessionId, body, userId)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (error) {
            utils.writeJson(res, { message: error.message }, 400);
        });
}