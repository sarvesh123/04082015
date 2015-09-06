'use strict';

// Setting up route
angular.module('insights').config(['$stateProvider',
  function ($stateProvider) {
    // Insights state routing
    $stateProvider
      .state('insights', {
        abstract: true,
        url: '/insights',
        template: '<ui-view/>'
      })
      .state('insights.list', {
        url: '',
        templateUrl: 'modules/insights/client/views/list-insights.client.view.html'
      })
      .state('insights.create', {
        url: '/create',
        templateUrl: 'modules/insights/client/views/create-insight.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('insights.view', {
        url: '/:insightId',
        templateUrl: 'modules/insights/client/views/view-insight.client.view.html'
      })
      .state('insights.edit', {
        url: '/:insightId/edit',
        templateUrl: 'modules/insights/client/views/edit-insight.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('insights.preview', {
        url: '/:insightId/preview',
        templateUrl: 'modules/insights/client/views/preview-insight.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
