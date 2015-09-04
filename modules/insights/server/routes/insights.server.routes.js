'use strict';

/**
 * Module dependencies.
 */
var insightsPolicy = require('../policies/insights.server.policy'),
  insights = require('../controllers/insights.server.controller');

module.exports = function (app) {
  // Insights collection routes
  app.route('/api/insights').all(insightsPolicy.isAllowed)
    .get(insights.list)
    .post(insights.create);

  // Single insight routes
  app.route('/api/insights/:insightId').all(insightsPolicy.isAllowed)
    .get(insights.read)
    .put(insights.update)
    .delete(insights.delete);

  // Finish by binding the insight middleware
  app.param('insightId', insights.insightByID);
};
