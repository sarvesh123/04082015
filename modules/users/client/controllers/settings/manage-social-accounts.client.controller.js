'use strict';

angular.module('users').controller('SocialAccountsController', ['$scope', '$http', 'Authentication', 
  function ($scope, $http, Authentication) {
    $scope.user = Authentication.user;

    $scope.sn = {
        linkedin: false,
        twitter: false,
        google: false,
        facebook: false
      };

    // Check if there are additional accounts
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }

      return false;
    };

    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
    };

    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;

      $http.delete('/api/users/accounts', {
        params: {
          provider: provider
        }
      }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    $scope.publish = function (insight) {
      var accessToken = user.additionalProvidersData.facebook.accessToken;
      var shareMessage = getInnerHTML('#shareMessage');
      var link = getVal('#origUrl');
      var picture = getSrc('#picture');
      var title = getInnerHTML('#title');
      var desc = getInnerHTML('#urlDescription');
      var description = title +  desc;

      if ( $scope.sn.linkedin ) {
        //linkedinShare();
      }
      if ( $scope.sn.facebook ) {
        facebookShare( accessToken, shareMessage, link, picture, description );
      }
      if ( $scope.sn.twitter ) {
        var tweet = title + description;
        tweet = tweet.substring(0, 140);
        twitterShare( user._id, tweet );
      }
      if ( $scope.sn.google ) {
        //googleShare();
      }
    };

    var facebookShare = function ( accessToken, shareMessage, link, picture, description ) {
      FB.api(
        "/me/feed",
        "POST",
        {
            "access_token": accessToken,
            "message": shareMessage,
            "picture": picture,
            "description": description
        },
        function (response) {
          console.log(response);
          if (response && !response.error) {
            /* handle the result */
          }
        }
      );
    };

    var twitterShare = function (userId, tweet) {
      var url = '/api/users/tweet';
      var data = { 
        userId: userId,
        tweet: tweet
      };
      $http.post(url, {
        data: data,

      }).success(function (response) {
        console.log(response);
      }).error(function (response) {
        console.log(response);
      });
    };

    var getInnerHTML = function (elementId) {
      var element = angular.element(document.querySelector(elementId));
      var elementText = element[0].innerHTML;
      return elementText;
    };

    var getSrc = function (elementId) {
      var element = angular.element(document.querySelector(elementId));
      var elementText = element[0].src;
      return elementText;
    };

    var getVal = function (elementId) {
      var element = angular.element(document.querySelector(elementId));
      var elementText = element[0].value;
      return elementText;
    };

  }
]);
