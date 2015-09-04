'use strict';

//Insights service used for communicating with the insights REST endpoints
angular.module('insights').factory('Insights', ['$resource',
  function ($resource) {
    return $resource('api/insights/:insightId', {
      insightId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
