'use strict';

const path = require('path');
const functions = require('firebase-functions');
const mkdirp = require('mkdirp-promise');
// Include a Service Account Key to use a Signed URL
const gcs = require('@google-cloud/storage')({
  credentials: require(path.join(__dirname, 'whitecloud-dev-firebase-adminsdk-bhag6-f3a977c8bc.json'))
});
const admin = require('firebase-admin');
const spawn = require('child-process-promise').spawn;
const LOCAL_TMP_FOLDER = '/tmp/';
const base64Img = require('base64-img');

// Max height and width of the thumbnail in pixels.
const THUMB_MAX_HEIGHT = 200;
const THUMB_MAX_WIDTH = 200;
const THUMB_QUALITY = 50;
const BLUR_MAX_HEIGHT = 40;
const BLUR_MAX_WIDTH = 40;
const BLUR_QUALITY = 25;

// Thumbnail prefix added to file names.
const THUMB_PREFIX = 'thumb_';
const BLUR_PREFIX = 'blur_';

admin.initializeApp(functions.config().firebase);
const ref = admin.database().ref();

exports.newVersion = require('./new-version');


/**
 * When an image is uploaded in the Storage bucket We generate a thumbnail automatically using
 * ImageMagick.
 * After the thumbnail has been generated and uploaded to Cloud Storage,
 * we write the public URL to the Firebase Realtime Database.
 */
exports.generateThumbnail = functions.storage.object().onChange(event => {
  const fileBucket = event.data.bucket;
  const bucket = gcs.bucket(fileBucket);
  const filePath = event.data.name;
  const file = bucket.file(filePath);
  const filePathSplit = filePath.split('/');
  const fileName = filePathSplit.pop();
  const fileDir = filePathSplit.join('/') + (filePathSplit.length > 0 ? '/' : '');
  const fileId = fileName.split('.')[0];
  const thumbFilePath = `${fileDir}${THUMB_PREFIX}${fileName}`;
  const blurFilePath = `${fileDir}${BLUR_PREFIX}${fileName}`;
  const tempLocalDir = `${LOCAL_TMP_FOLDER}${fileDir}`;
  const tempLocalFile = `${tempLocalDir}${fileName}`;
  const tempLocalThumbFile = `${LOCAL_TMP_FOLDER}${thumbFilePath}`;
  const tempLocalBlurFile = `${LOCAL_TMP_FOLDER}${blurFilePath}`;
  const blurFile = bucket.file(blurFilePath);
  const thumbFile = bucket.file(thumbFilePath);

// Exit if this is triggered on a file that is not an image.
  if (!event.data.contentType.startsWith('image/')) {
    console.log('This is not an image.');
    return;
  }

// Exit if the image is already a thumbnail.
  if (fileName.startsWith(THUMB_PREFIX) || fileName.startsWith(BLUR_PREFIX)) {
    console.log('Already a Thumbnail.');
    return;
  }

// Exit if this is a move or deletion event.
  if (event.data.resourceState === 'not_exists') {
    console.log('This is a deletion event.');
    return;
  }

// Create the temp directory where the storage file will be downloaded.
  return mkdirp(tempLocalDir).then(() => {
    // Download file from bucket.
    return bucket.file(filePath).download({
      destination: tempLocalFile
    });
  }).then(() => {
    console.log('The file has been downloaded to', tempLocalFile);
    // Generate a thumbnail using ImageMagick.
    return Promise.all([
      spawn('convert', [
        tempLocalFile,
        '-thumbnail', `${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}>`,
        '-quality', `${THUMB_QUALITY}`,
        tempLocalThumbFile
      ]),
      spawn('convert', [
        tempLocalFile,
        '-thumbnail', `${BLUR_MAX_WIDTH}x${BLUR_MAX_HEIGHT}>`,
        '-quality', `${BLUR_QUALITY}`,
        tempLocalBlurFile
      ])
    ]);
  }).then(() => {
    console.log('Thumbnail created at', tempLocalThumbFile);
// Uploading the Thumbnail.
    return Promise.all([
      bucket.upload(tempLocalThumbFile, {
        destination: thumbFilePath
      }),
      bucket.upload(tempLocalBlurFile, {
        destination: blurFilePath
      })
    ])
  }).then(() => {
    console.log('Thumbnail uploaded to Storage at', thumbFilePath, blurFilePath);
  }).then(() => {
    const config = {
      action: 'read',
      expires: '03-01-2500'
    };
// Get the Signed URL for the thumbnail and original images
    return Promise.all([
      thumbFile.getSignedUrl(config),
      blurFile.getSignedUrl(config),
      file.getSignedUrl(config),
    ]);
  }).then(results => {
    console.log('Got Signed URL');
    const thumbResult = results[0];
    const blurResult = results[1];
    const originalResult = results[2];

    const thumbFileUrl = thumbResult[0];
    const blurFileUrl = blurResult[0];
    const fileUrl = originalResult[0];

    // Get the blur file as a base64 string
    return new Promise((success, failure) => {
      base64Img.base64(tempLocalBlurFile, (err, data) =>
        err
          ? failure(err)
          : success(data)
      )
    }).then(base64 => {
      // Add the URLs to the Database
      return ref.child(`images/${fileId}`)
        .set({
          path: fileUrl,
          base64: base64,
          thumbnail: thumbFileUrl,
          blur: blurFileUrl
        })
        .then(() => {

          return ref.child('events').orderByChild('imageId')
            .equalTo(fileId)
            .once('value')
            .then(dataSnapshot => {
              const val = dataSnapshot && dataSnapshot.val() || {};
              return Promise.all(Object.keys(val).map(key => {
                return ref.child(`events/${key}`)
                  .set(Object.assign(val[key], {
                    imageUrl: fileUrl,
                    thumbUrl: thumbFileUrl,
                    blur: base64,
                  }));
              }))
            });
        });
    });
  })
    .catch(reason => {
      console.error(reason);
    });
})
