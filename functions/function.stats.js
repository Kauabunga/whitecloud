const functions = require('firebase-functions');
const admin = require('firebase-admin');


module.exports = functions.database.ref('/events/{eventId}')
  .onWrite(() => {

    // Get all events
    return admin.database().ref('events').once('value', (data) => {

      let ids = Object.keys(data.val());

      return admin.database().ref('stats').set({
        updatedAt: admin.database.ServerValue.TIMESTAMP,
        total: ids.length,
      });
    });
  });
