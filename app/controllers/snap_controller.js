//  SAMPLE CURL CREATE SNAP
// curl -X POST -H "Content-Type: application/json" -d '{
//     "pictureURL": "first post",
//     "sentFrom": "words",
//     "sentTo":  "this is a test post"
// }' "http://localhost:9090/api/snaps"


import Snap from '../models/snap_model.js';
// import fs from 'file-system';
const fs = require('fs');
const AWS = require('aws-sdk');


const cleanSnaps = (snaps) => {
  return snaps.map(snap => {
    return { id: snap._id, pictureURL: snap.pictureURL, sentFrom: snap.sentFrom, sentTo: snap.sentTo };
  });
};

const cleanSnap = (snap) => {
  return { id: snap._id, pictureURL: snap.pictureURL, sentFrom: snap.sentFrom, sentTo: snap.sentTo };
};


export const createSnap = (req, res) => {
  console.log('CREATE SNAP BODY', req.body);
  const snap = new Snap();

  const x = Math.floor((Math.random() * 10000) + 1);
  snap.key = x.toString();

  const s3bucket = new AWS.S3({ params: { Bucket: 'snap-app-bucket' } });

  AWS.config.update({ region: 'us-west-2' });
  const params = { Body: req.body.file, ContentType: 'text/plain', Key: x.toString() };
  s3bucket.upload(params, (err, data) => {
    if (err) {
      console.log('Error uploading data: ', err);
    } else {
      console.log('Successfully uploaded data to myBucket/myKey');
    }
  });

  snap.sentFrom = req.body.sentFrom;
  snap.sentTo = req.body.sentTo;

  var s3 = new AWS.S3();//eslint-disable-line


  var paramsTwo = { Bucket: 'snap-app-bucket', Key: x.toString() }; //eslint-disable-line
  s3.getSignedUrl('getObject', paramsTwo, (err, Url) => {
    snap.pictureURL = Url;
    console.log('The URL is', Url);
  });

  console.log('\n');

  snap.save()
    .then((result) => {
      res.json({ message: 'Snap Created' });
    }).catch((error) => {
      res.json({ error });
    });

  // s3bucket.createBucket(() => {
  //   const params = { Key: 'new', Body: 'HIIIII!' };
  //   s3bucket.upload(params, (err, data) => {
  //     if (err) {
  //       console.log('Error uploading data: ', err);
  //     } else {
  //       console.log('Successfully uploaded data to myBucket/myKey');
  //     }
  //   });
  // });

  // s3obj.upload({ Body: body }).
  //   on('httpUploadProgress', (evt) => {
  //     console.log(evt);
  //   }).
  //   send((err, data) => {
  //     console.log(err, data);
  //   });

  // const params = { Bucket: 'bucket', Key: 'key' };
  // const s3 = new AWS.S3();
  // s3.abortMultipartUpload(params, (err, data) => {
  //   if (err) console.log(err, err.stack); // an error occurred
  //   else console.log(data);           // successful response
  // });
  // const url = s3.getSignedUrl('getObject', params);
  // console.log('The URL is', url);
  // const paramss = { Bucket: 'bucket', Key: 'key', Body: req.body.file };
  // s3.upload(paramss, (err, data) => {
  //   console.log(err, data);
  // });
};

export const getSnaps = (req, res) => {
  // const urlParts = url.parse(req.url, true);
  // console.log('URL PARTS QUERY', urlParts.query);
  console.log('GETSNAPS QUERY', req.user.email);
  Snap.find({ sentTo: req.user.email })
    .then((snaps) => {
      res.json(cleanSnaps(snaps));
    })
    .catch((error) => {
      res.json({ error });
    });
};

export const deleteSnap = (req, res) => {
  res.send('snaps deleted here');
  Snap.remove({ _id: req.params.id })
    .then(() => {
      res.json({ message: 'Snap Deleted' });
    })
    .catch((error) => {
      res.json({ error });
    });
};

export const storeImage = (req, res) => {
  const snap = new Snap();
  snap.img.data = fs.readFileSync(req);
  snap.img.contentType = 'image/jpeg';
};

export const getSnap = (req, res) => {
  Snap.findById({ _id: req.params.id })
    .then(snap => {
      res.json(cleanSnap(snap));
      // console.log(snap);
      // var s3 = new AWS.S3();//eslint-disable-line
      //
      // var paramsTwo = { Bucket: 'snap-app-bucket', Key: x.toString() }; //eslint-disable-line
      //
      // var paarams = { //eslint-disable-line
      //   Bucket: 'snap-app-bucket', /* required */
      // };
      // s3.listObjects(paarams, (err, data) => {
      //   if (err) console.log(err, err.stack); // an error occurred
      //   else console.log('OBJECT DATA', data);           // successful response
      // });
      //
      // console.log('/n');
      // console.log('/n');
      // console.log('/n');
      //
      // s3.getObject(paramsTwo, (err, data) => {
      //   if (err) console.log(err, err.stack); // an error occurred
      //   else {
      //     // console.log(data.Body.toString());           // successful response
      //   }
      // });
    })
  .catch(error => {
    res.json({ error });
  });
};
