'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Insight = mongoose.model('Insight'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a insight
 */
exports.create = function (req, res) {
  var insight = new Insight(req.body);
  insight.user = req.user;

  insight.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(insight);
    }
  });
};

/**
 * Show the current insight
 */
exports.read = function (req, res) {
  res.json(req.insight);
};

/**
 * Update a insight
 */
exports.update = function (req, res) {
  var insight = req.insight;

  insight.insight = req.body.insight;

  insight.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(insight);
    }
  });
};

/**
 * Delete an insight
 */
exports.delete = function (req, res) {
  var insight = req.insight;

  insight.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(insight);
    }
  });
};

/**
 * List of insights
 */
exports.list = function (req, res) {
  Insight.find().sort('-created').populate('user', 'displayName').exec(function (err, insights) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(insights);
    }
  });
};

/**
 * Insight middleware
 */
exports.insightByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Insight is invalid'
    });
  }

  Insight.findById(id).populate('user', 'displayName').exec(function (err, insight) {
    if (err) {
      return next(err);
    } else if (!insight) {
      return res.status(404).send({
        message: 'No insight with that identifier has been found'
      });
    }
    req.insight = insight;
    next();
  });
};
