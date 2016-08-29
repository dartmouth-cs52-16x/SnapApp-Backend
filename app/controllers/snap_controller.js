//  Sources:
//  http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html for AWS S3 calls

import User from '../models/user_model.js';
import Snap from '../models/snap_model.js';
const AWS = require('aws-sdk');


const cleanSnaps = (snaps) => {
  return snaps.map(snap => {
    return { id: snap._id, timer: snap.timer, caption: snap.caption, pictureURL: snap.pictureURL, sentFrom: snap.sentFrom, sentTo: snap.sentTo, time: snap.time, key: snap.key };
  });
};

const cleanSnap = (snap) => {
  return { id: snap._id, timer: snap.timer, caption: snap.caption, pictureURL: snap.pictureURL, sentFrom: snap.sentFrom, sentTo: snap.sentTo, time: snap.time, key: snap.key };
};


export const createSnap = (req, res) => {
  //  update users snap score for every snap sent
  const dict = req.user.friends;
  console.log(dict);
  if (dict.length === 0) {
    console.log('DICT EMPTY');
    dict.push({ name: req.body.sentTo, score: 1 });
  } else {
    //  update friends and score for friend
    // http://stackoverflow.com/questions/7196212/how-to-create-dictionary-and-add-key-value-pairs-dynamically-in-javascript
    let exists = 0;
    for (let i = 0; i < dict.length; i++) {
      if (dict[i].name === req.body.sentTo) {
        dict[i].score += 1;
        exists = 1;
      }
    }
    if (exists === 0) {
      dict.push({ name: req.body.sentTo, score: 1 });
    }
  }

  console.log('updated dict', dict);

  User.findOneAndUpdate({ _id: req.user._id }, {
    snapScore: req.user.snapScore + 1,
    friends: dict,
  }).then(() => {
    // res.send({ message: 'Successfully updated post!' });
  })
  .catch(error => {
    res.json({ error });
  });

  const snap = new Snap();

  const x = Math.floor((Math.random() * 1000000) + 1);
  snap.key = x.toString();

  const s3bucket = new AWS.S3({ params: { Bucket: 'snap-app-bucket' } });

  AWS.config.update({ region: 'us-west-2' });
  const params = { Body: req.body.file, ContentType: 'text/plain', Key: x.toString(), ACL: 'public-read' };
  s3bucket.upload(params, (err, data) => {
    if (err) {
      console.log('Error uploading data: ', err);
    }
  });

  snap.sentFrom = req.body.sentFrom;
  snap.sentTo = req.body.sentTo;
  snap.timer = req.body.timer;
  snap.caption = req.body.caption;
  console.log(`timer is ${snap.timer}`);

  var s3 = new AWS.S3();//eslint-disable-line


  var paramsTwo = { Bucket: 'snap-app-bucket', Key: x.toString() }; //eslint-disable-line
  s3.getSignedUrl('getObject', paramsTwo, (err, Url) => {
    snap.pictureURL = Url;
  });

  snap.save()
    .then((result) => {
      // res.json({ message: 'Snap Created' });
    }).catch((error) => {
      res.json({ error });
    });
};

export const getSnaps = (req, res) => {
  // const urlParts = url.parse(req.url, true);
  // console.log('URL PARTS QUERY', urlParts.query);
  Snap.find({ sentTo: req.user.username })
    .then((snaps) => {
      res.json(cleanSnaps(snaps));
    })
    .catch((error) => {
      res.json({ error });
    });
};

export const deleteSnap = (req, res) => {
  console.log('BODY REQ LOG', req.body.snap);

  const key = req.body.snap.key;
  const s3 = new AWS.S3();//eslint-disable-line

  const params = {
    Bucket: 'snap-app-bucket',
    Key: key,
  };
  s3.deleteObject(params, (err, data) => {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data);           // successful response
  });

  Snap.remove({ _id: req.params.id })
    .then(() => {
      res.json({ message: 'Snap Deleted' });
    })
    .catch((error) => {
      res.json({ error });
    });
};

export const getSnap = (req, res) => {
  // Get a new signed URL for the snap
  console.log('GETTING SNAP');
  var s3 = new AWS.S3();//eslint-disable-line

  Snap.findById({ _id: req.params.id })
    .then(snap => {
      var paramsTwo = { Bucket: 'snap-app-bucket', Key: snap.key }; //eslint-disable-line
      s3.getSignedUrl('getObject', paramsTwo, (err, Url) => {
        console.log('\n\nThe new Signed URL is', Url);

        Snap.findOneAndUpdate({ _id: req.params.id }, {
          pictureURL: Url,
        }).then(() => {
          console.log('Updated Snaps URL');
          Snap.findById({ _id: req.params.id })
            .then((oneSnap) => {
              res.json(cleanSnap(oneSnap));
              console.log('\n\nReturned snap with new URL');
              console.log(cleanSnap(oneSnap));
            })
          .catch(error => {
            res.json({ error });
          });
        })
        .catch(error => {
          res.json({ error });
        });
      });
    })
  .catch(error => {
    res.json({ error });
  });
};
