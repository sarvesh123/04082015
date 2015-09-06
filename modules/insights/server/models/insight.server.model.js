'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Insight Schema
 */
var InsightSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  title: {
    type: String,
    default: '',
    trim: true,
  },
  orig_url: {
    type: String,
    default: '',
    trim: true,
    required: 'URL cannot be blank'
  },
  views: {
    type: String,
    default: 1
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Insight', InsightSchema);
