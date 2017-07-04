'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


exports.newVersion = require('./new-version');
exports.generateThumbnail = require('./generate-thumbnail');
