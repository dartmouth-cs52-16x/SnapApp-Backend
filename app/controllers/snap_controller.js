//  SAMPLE CURL CREATE SNAP
// curl -X POST -H "Content-Type: application/json" -d '{
//     "pictureURL": "first post",
//     "sentFrom": "words",
//     "sentTo":  "this is a test post"
// }' "http://localhost:9090/api/snaps"


import Snap from '../models/snap_model.js';

const cleanSnaps = (snaps) => {
  return snaps.map(snap => {
    return { id: snap._id, pictureURL: snap.pictureURL, sentFrom: snap.sentFrom, sentTo: snap.sentTo };
  });
};

const cleanSnap = (snap) => {
  return { id: snap._id, pictureURL: snap.pictureURL, sentFrom: snap.sentFrom, sentTo: snap.sentTo };
};

export const createSnap = (req, res) => {
  const snap = new Snap();

  snap.pictureURL = req.body.pictureURL;
  snap.sentFrom = req.body.sentFrom;
  snap.sentTo = req.body.sentTo;
  console.log(req.body);
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
