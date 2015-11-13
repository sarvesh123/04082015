'use strict';

angular.module('insights').controller('InsightsPublishController',  
  function ($scope, insight, $modalInstance) {
  
  $scope.insight = insight;

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

});
