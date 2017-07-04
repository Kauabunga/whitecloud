'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


exports.stats = require('./function.stats');
exports.newVersion = require('./function.new-version');
exports.generateThumbnail = require('./function.generate-thumbnail');
