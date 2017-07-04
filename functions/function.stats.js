const functions = require('firebase-functions');
const admin = require('firebase-admin');


module.exports = functions.database.ref('/events/{eventId}')
  .onWrite(() => {

    // Get all events
    return admin.database().ref('events').once('value', (data) => {

      let val = data.val();
      let ids = Object.keys(val);

      let possum = count('possum', val);
      let rat = count('rat', val);
      let mouse = count('mouse', val);
      let stoat = count('stoat', val);

      return admin.database().ref('stats').set({
        updatedAt: admin.database.ServerValue.TIMESTAMP,
        total: ids.length,
        pests: {possum, rat, mouse, stoat}
      });
    });
  });


function count(pest, val) {
  return Object.keys(val)
    .filter(key => val[key].pest === pest)
    .length;
}
