'use strict';

// Insights controller
angular.module('insights').controller('InsightsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Insights',
  function ($scope, $stateParams, $location, Authentication, Insights) {
    $scope.authentication = Authentication;

    // Create new Insight
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'insightForm');

        return false;
      }

      // Create new Insight object
      var insight = new Insights({
        content: this.content,
        title: this.title,
        orig_url: this.orig_url,
      });

      // Redirect after save
      insight.$save(function (response) {
        $location.path('insights/' + response._id);

        // Clear form fields
        $scope.insight = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Insight
    $scope.remove = function (insight) {
      if (insight) {
        insight.$remove();

        for (var i in $scope.insights) {
          if ($scope.insights[i] === insight) {
            $scope.insights.splice(i, 1);
          }
        }
      } else {
        $scope.insight.$remove(function () {
          $location.path('insights');
        });
      }
    };

    // Update existing Insight
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'insightForm');

        return false;
      }

      var insight = $scope.insight;

      insight.$update(function () {
        $location.path('insights/' + insight._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Insights
    $scope.find = function () {
      $scope.insights = Insights.query();
    };

    // Find existing Insight
    $scope.findOne = function () {
      $scope.insight = Insights.get({
        insightId: $stateParams.insightId
      });
    };
  }
]);
