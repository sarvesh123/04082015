'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  config = require(path.resolve('./config/config'));

/**
 * Update user details
 */
exports.update = function (req, res) {
  // Init Variables
  var user = req.user;

  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  if (user) {
    // Merge existing user
    user = _.extend(user, req.body);
    user.updated = Date.now();
    user.displayName = user.firstName + ' ' + user.lastName;

    user.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        req.login(user, function (err) {
          if (err) {
            res.status(400).send(err);
          } else {
            res.json(user);
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Update profile picture
 */
exports.changeProfilePicture = function (req, res) {
  var user = req.user;
  var message = null;

  if (user) {
    fs.writeFile('./modules/users/client/img/profile/uploads/' + req.files.file.name, req.files.file.buffer, function (uploadError) {
      if (uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading profile picture'
        });
      } else {
        user.profileImageURL = 'modules/users/client/img/profile/uploads/' + req.files.file.name;

        user.save(function (saveError) {
          if (saveError) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(saveError)
            });
          } else {
            req.login(user, function (err) {
              if (err) {
                res.status(400).send(err);
              } else {
                res.json(user);
              }
            });
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Send User
 */
exports.me = function (req, res) {
  res.json(req.user || null);
};

var userByID = function (id) {
  return User.findOne({
    _id: id
  }).exec(function (err, user) {
    if (err) {
      return err;
    } else {
      return user;
    }
  });
};

exports.tweet = function (req, res) {

    console.log(req.body);

    var userId = req.body.data.userId;
    var user = userByID(userId).then( function (data) {
      //Get this data from your twitter apps dashboard
      var tweetConfig = {
          "consumerKey": config.twitter.clientID,
          "consumerSecret": config.twitter.clientSecret,
          "accessToken": data.additionalProvidersData.twitter.token,
          "accessTokenSecret": data.additionalProvidersData.twitter.tokenSecret,
          "callBackUrl": config.twitter.callbackURL
      }

      var tweet = req.body.data.tweet;
      var Twitter = require('twitter-node-client').Twitter;
      var twitter = new Twitter(tweetConfig);

      //Callback functions
      var error = function (err, response, body) {
        res.send(err);
      };
      var success = function (data) {
        res.send(data);
      };
      twitter.postTweet({ status: tweet}, error, success);
    });
};

var postTweet = function (tweet, tweetConfig) {
  
};
