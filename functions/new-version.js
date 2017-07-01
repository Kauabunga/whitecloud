'use strict';

const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const ref = admin.database().ref();

module.exports = functions.https.onRequest((req, res) => {
  const version = req.query && req.query.version || null;
  console.log('newVersion', version);
  return ref.child('version').set({
    timestamp: new Date().toISOString(),
    version: version,
    createdAt: admin.database.ServerValue.TIMESTAMP,
  })
    .then(() => res.status(200).send())
    .catch((err) => res.status(500).send());
});
