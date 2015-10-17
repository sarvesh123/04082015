'use strict';

// Insights controller
angular.module('insights').controller('InsightsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Insights', '$modal', '$log', '$rootScope', '$http',
  function ($scope, $stateParams, $location, Authentication, Insights, $modal, $log, $rootScope, $http) {
    $scope.authentication = Authentication;

    $scope.selectedCheckbox = [];

    $scope.url = null;

    // Create new Insight
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'insightForm');

        return false;
      }

      var orig_url = this.url;
      $scope.url = null;
      var embedly_url = 'http://api.embed.ly/1/extract?key=38b6d4e2bb8b4c589a15b0e9e79a8a39&url=';
      var req = {
        method: 'GET',
        url: embedly_url + orig_url,
        headers: {
          'Content-Type': 'application/json'
        }
      };
      $http(req).then(function successCallback(response) {
            // Create new Insight object
            var insight = new Insights({
              title: response.data.title,
              orig_url: orig_url,
            });

            // Redirect after save
            insight.$save(function (response) {
              $location.path('insights/' + response._id + '/edit');
              // Clear form fields
              $scope.insight = '';
            }, function (errorResponse) {
              $scope.error = errorResponse.data.message;
            });
      }, function errorCallback(response) {
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
      $rootScope.insight = Insights.get({
        insightId: $stateParams.insightId
      });
      $rootScope.showSideMenu = 1;
    };

    $scope.autoSave = function () {
      var insight = $scope.insight;
      insight.$update(function () {
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.publish_popup = function (size, insight) {
      
        var modalInstance = $modal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'modules/insights/client/views/publish-lightbox-insight.client.view.html',
          controller: 'ModalInstanceCtrl',
          size: size,
          resolve: {
            insight: function () {
              return $scope.insight;
            }
          }
        });

        modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
        });
    };

    $scope.getUrlData = function () {

      var embedly_url = 'http://api.embed.ly/1/extract?key=38b6d4e2bb8b4c589a15b0e9e79a8a39&url=';
      var req = {
        method: 'GET',
        url: embedly_url + $scope.insight.orig_url,
        headers: {
          'Content-Type': 'application/json'
        }
      };
      $http(req).then(function successCallback(response) {
        $scope.response = response;
      }, function errorCallback(response) {
      });

    };

    $scope.openContentBox = function (checkboxes) {
      if ($scope.selectedCheckbox.length === 1) {
        $scope.openEditBox = $scope.selectedCheckbox[0];
      }
      else if ($scope.selectedCheckbox.length === 0) {
        $scope.checkbox_warning = 'You need to select atleast one insight';
        $scope.openEditBox = false;
      }
      else {
        $scope.checkbox_warning = 'You can edit only one insight at one time';
        $scope.openEditBox = false;
      }
    };

    $scope.saveClickedCheckbox = function (insightId) {
      var checkboxState = $scope.selectedCheckbox.indexOf(insightId);

      if (checkboxState > -1) {
        $scope.selectedCheckbox.splice(checkboxState, 1);
      }
      else {
        $scope.selectedCheckbox.push(insightId);
      }
    };

    $scope.updateContent = function (insight) {
      var selected_insight = insight;

      selected_insight.$update();

    };

    $scope.deleteInsights = function (checkboxes) {
      if ($scope.selectedCheckbox.length === 0) {
        $scope.checkbox_warning = 'You need to select atleast one insight';
      }
      else {
        for (var index = 0; index < $scope.insights.length;) {
          if ($scope.selectedCheckbox.indexOf($scope.insights[index]._id) > -1) {
            $http.delete('/api/insights/' + $scope.insights[index]._id);
            $scope.insights.splice(index, 1);
          }
          else {
            index++;
          }
        }
      }
    };

  }
])
.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

angular.module('ui.bootstrap').controller('ModalInstanceCtrl', function ($scope, $modalInstance, insight) {

  $scope.insight = insight;

  $scope.close = function () {
    $modalInstance.dismiss('cancel');
  };

});
