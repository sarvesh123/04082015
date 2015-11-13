'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', 'Users', 'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;

    $scope.showEditButton = $scope.allowEditName = false;

    $scope.myImage='';
    $scope.myCroppedImage='';

    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = new Users($scope.user);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'userForm');

        $scope.success = true;
        Authentication.user = response;
      }, function (response) {
        $scope.error = response.data.message;
      });
    };

    $scope.returnViewMode = function () {
      $scope.editMode = $scope.editTitleButton = $scope.editNameButton = $scope.editSocialButton = false;
      $scope.allowEditTitle = $scope.allowEditName = $scope.allowEditSocial = false;
    };

    $scope.editProfileTitle = function () {
      $scope.allowEditTitle = true;
      $scope.editTitleButton = false;
    };

    $scope.editProfileName = function () {
      $scope.allowEditName = true;
      $scope.editNameButton = false;
    };

    $scope.editProfileSocial = function () {
      $scope.allowEditSocial = true;
      $scope.editSocialButton = false;
    };

    $scope.goEditMode = function () {
      $scope.editMode = true;
      $scope.editTitleButton = true;
      $scope.editNameButton = true;
      $scope.editSocialButton = true;
    };

    $scope.saveProfile = function () {
      var user = new Users($scope.user);
      user.$update(function (response) {
        $scope.returnViewMode();
      }, function (response) {
        $scope.error = response.data.message;
      });
    };

    $scope.handleFileSelect = function(evt) {

      console.log(evt.target.result);

      var file = evt.currentTarget.files[0];
      var reader = new FileReader();
      reader.onload = function (evt) {
        $scope.$apply(function($scope){
          $scope.myImage = evt.target.result;
        });
      };
      reader.readAsDataURL(file);
    };
    angular.element(document.querySelector('#fileInput')).on('change', $scope.handleFileSelect);
  }
]);
