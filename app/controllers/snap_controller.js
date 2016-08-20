//  SAMPLE CURL CREATE SNAP
// curl -X POST -H "Content-Type: application/json" -d '{
//     "pictureURL": "first post",
//     "sentFrom": "words",
//     "sentTo":  "this is a test post"
// }' "http://localhost:9090/api/snaps"


import Snap from '../models/snap_model.js';
// import fs from 'file-system';
const fs = require('fs');
const zlib = require('zlib');
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
  // console.log(req.body);

  // const body = fs.createReadStream('test').pipe(zlib.createGzip());
  // const s3obj = new AWS.S3({ params: { Bucket: 'snap-app-buckets', Key: 'new' } });

  const s3bucket = new AWS.S3({ params: { Bucket: 'snap-app-buckets' } });

  AWS.config.update({ region: 'us-west-2' });
  const params = { Key: 'newer', Body: req.body.file };
  s3bucket.upload(params, (err, data) => {
    if (err) {
      console.log('Error uploading data: ', err);
    } else {
      console.log('Successfully uploaded data to myBucket/myKey');
    }
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

  const snap = new Snap();

  snap.pictureURL = req.body.pictureURL;
  snap.sentFrom = req.body.sentFrom;
  snap.sentTo = req.body.sentTo;
  snap.img.data = req.body.img;
  snap.img.contentType = 'image/jpeg';

  snap.save()
    .then((result) => {
      res.json({ message: 'Snap Created' });
    }).catch((error) => {
      res.json({ error });
    });
};

export const getSnaps = (req, res) => {
  Snap.find()
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
      console.log(snap);
    })
  .catch(error => {
    res.json({ error });
  });
};
