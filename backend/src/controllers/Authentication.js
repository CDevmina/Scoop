'use strict';

var utils = require('../utils/writer.js');
var Authentication = require('../service/AuthenticationService');

module.exports.authLoginPOST = function authLoginPOST(req, res, next, body) {
  Authentication.authLoginPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, { message: response.message }, 400);
    });
};

module.exports.authRegisterPOST = function authRegisterPOST(req, res, next, body) {
  Authentication.authRegisterPOST(body)
    .then(function (response) {
      utils.writeJson(res, response, 201);
    })
    .catch(function (response) {
      utils.writeJson(res, { message: response.message }, 400);
    });
};

module.exports.updatePassword = function updatePassword(req, res, next, body) {
  const userId = req.user && req.user.userId;
  Authentication.updatePassword(userId, body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, { message: response.message }, 400);
    });
};

module.exports.getUserDetails = function getUserDetails(req, res, next) {
  const userId = req.user && req.user.userId;
  Authentication.getUserDetails(userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, { message: response.message }, 401);
    });
};

module.exports.deleteUserProfile = function deleteUserProfile(req, res, next) {
  const userId = req.user && req.user.userId;
  Authentication.deleteUserProfile(userId)
    .then(function () {
      utils.writeJson(res, null, 204);
    })
    .catch(function (response) {
      utils.writeJson(res, { message: response.message }, 400);
    });
};

module.exports.isAdmin = function isAdmin(req, res, next) {
  const userId = req.user && req.user.userId;
  Authentication.isAdmin(userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, { message: response.message }, 401);
    });
};

module.exports.updateUserProfile = function updateUserProfile(req, res, next, body) {
  const userId = req.user && req.user.userId;
  Authentication.updateUserProfile(userId, body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, { message: response.message }, 400);
    });
};