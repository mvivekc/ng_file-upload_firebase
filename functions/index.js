const functions = require('firebase-functions');
const request = require('request-promise');
const gcs = require('@google-cloud/firestore');
const path = require('path');
const os = require('os');
const axios = require('axios')
const fs = require('fs');
const { Storage } = require('@google-cloud/storage');

//const firebase = require('firebase');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.database();

// The Firebase Admin SDK to access the Firebase Realtime Database.

exports.testing = functions.storage.object().onFinalize(async (object) => {
  //onMetadataUpdate()
  const fileBucket = object.bucket;
  const filePath = object.name;
  const storage = new Storage();
  const bucket = storage.bucket(object.bucket);

  /*const bucket = gcs.bucket(fileBucket)
  const file = bucket.file(object.name);*/

  const contentType = object.contentType;
  const fileName = path.basename(filePath);

  console.log("photo added by the name: ", filePath);


  const metadata = {
      download_url: filePath,
      type: object.contentType, 
      size: object.size
  };
  const tempFilePath = path.join(os.tmpdir(), fileName)

  let doc = admin.firestore().collection("purpose_build").doc(object.generation);
  doc.set(metadata);

  bucket.file(object.name).download()
    .then(data => {
        const base64 = data[0].toString('base64');
        // Do something with the contents constant, e.g. derive the value you want to write to Firestore
        axios.post('http://random.com/foo_bar', {
          make_attempt: base64
        })
        .then((res) => {
          console.log(`statusCode: ${res.statusCode}; res: ${JSON.stringify(res)}`);
          doc.update({post_status: res.statusCode});
        })
        .catch((error) => {
          doc.update({post_status: JSON.stringify(error)});
        })
        

    });
  

})
