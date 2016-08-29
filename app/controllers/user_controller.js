//  Sources:
//  http://mongoosejs.com/docs/queries.html
//  http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html


//  We currently are not using fb auth

import User from '../models/user_model';
import jwt from 'jwt-simple';
const AWS = require('aws-sdk');
import dotenv from 'dotenv';
dotenv.config({ silent: true });


export const signin = (req, res, next) => {
  console.log('sign in started');
  res.send({ token: tokenForUser(req.user) });
};

export const addFriend = (req, res) => {
  console.log('REQ BODY', req.body);
  User.findOneAndUpdate({ _id: req.user._id }, {
    friends: req.body.friends,
  }).then(() => {
    res.send({ message: 'Successfully updated friends!' });
  })
 .catch(error => {
   res.json({ error });
 });
};

export const deleteUser = (req, res) => {
  console.log('DELETE USER ID', req.user._id);
  User.remove({ _id: req.user._id })
   .then(() => {
     res.json({ message: 'Usage successfully deleted!' });
   })
   .catch(error => {
     res.json({ error });
   });
};

//  need body, email, username, id, file
export const updateUserProfile = (req, res) => {
 // console.log('UPDATE REQ:', req.body);

  const x = Math.floor((Math.random() * 10000000) + 1);
  const key = x.toString();

  console.log('KEY GENERATED', key);

  const s3bucket = new AWS.S3({ params: { Bucket: 'snap-app-bucket' } });

  AWS.config.update({ region: 'us-west-2' });
  const params = { Body: req.body.file, ContentType: 'text/plain', Key: key, ACL: 'public-read' };
  s3bucket.upload(params, (err, data) => {
    if (err) {
      console.log('Error uploading data: ', err);
    }
   var s3 = new AWS.S3();//eslint-disable-line
   var paramsTwo = { Bucket: 'snap-app-bucket', Key: x.toString() }; //eslint-disable-line
    s3.getSignedUrl('getObject', paramsTwo, (err, Url) => {
      if (err) {
        console.log('Error getting prof url: ', err);
      }
      console.log('GOT URL', Url);
      User.findOneAndUpdate({ _id: req.body.id }, {
        email: req.body.email,
        profilePicURL: Url,
        profilePicKey: key,
        username: req.body.username,
      }).then(() => {
        res.send({ message: 'Successfully updated post!' });
      })
     .catch(error => {
       res.json({ error });
     });
    });
  });
};

export const checkUserExists = (req, res) => {
  console.log(req.body);
  User.findOne({ username: req.body.sentTo })
   .then((user) => {
     if (user) {
       res.json({ success: 'user exists' });
       if (user.username) {
         res.send({ success: 'USER EXISTS' });
       } else {
         res.send({ error: 'USER DOESN\'T EXIST' });
       }
     }
   }).catch((error) => {
     res.json({ error });
     res.send({ error: 'call failed' });
   });
};


export const getUserObject = (req, res) => {
  const reqUser = req.user;
 var s3 = new AWS.S3();//eslint-disable-line

  User.findById({ _id: reqUser._id })
   .then(user => {
     if (user.profilePicKey !== '') {
       var paramsTwo = { Bucket: 'snap-app-bucket', Key: user.profilePicKey }; //eslint-disable-line
       s3.getSignedUrl('getObject', paramsTwo, (err, Url) => {
         console.log('\n\nThe new Signed URL is', Url);
         User.findOneAndUpdate({ _id: reqUser._id }, {
           profilePicURL: Url,
         }).then(() => {
           console.log('Updated Snaps URL');
           User.findById({ _id: reqUser._id })
             .then((userToReturn) => {
               console.log('\n\nUSER TO RETURN', userToReturn);
               res.send(userToReturn);
             })
           .catch(error => {
             res.json({ error });
           });
         })
         .catch(error => {
           res.json({ error });
         });
       });
     } else {
       res.send(reqUser);
     }
   })
 .catch(error => {
   res.json({ error });
 });
};

// encodes a new token for a user object
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.API_SECRET);
}

export const signup = (req, res, next) => { // eslint-disable-line consistent-return
  console.log('sign up started');
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;

  if (!email || !password || !username) {
    return res.status(422).send('You must provide an email, a password, and a username to sign up!');
  }

 // here you should do a mongo query to find if a user already exists with this email.
 // if user exists then return an error. If not, use the User model to create a new user.
 // Save the new User object
 // this is similar to how you created a Post
 // and then return a token same as you did in in signin

  User.findOne({ username })
   .then((user) => { // eslint-disable-line consistent-return
     if (user) {
       return res.status(422).send('The password or email or username you entered has been taken!');
     }
     else { // eslint-disable-line brace-style
       const newUser = new User();
       newUser.email = email;
       newUser.password = password;
       newUser.username = username;
       newUser.snapScore = 0;
       newUser.topFriend = 'NONE';
       newUser.friends = [];
       newUser.profilePicKey = '';
       newUser.profilePicURL = '';
       newUser.save()
         .then((result) => {
           res.send({ token: tokenForUser(result) });
         })
         .catch(err => {
           res.status(400).send(`${err}`);
         });
     }
   }
 )
 .catch(err => {
   res.status(400).send(`${err}`);
 });
};

export const authenticateWithFacebook = (req, res) => {
  console.log(req.body);
  const facebookUserID = req.body.facebookUserID;
  const facebookUserName = req.body.facebookUserName;
  const facebookEmail = req.body.facebookEmail;
  const facebookUserPicture = req.body.facebookUserPicture;
  console.log(`req ID: ${facebookUserID}`);
  console.log(`req ID: ${facebookUserName}`);
  console.log(`req ID: ${facebookEmail}`);
  console.log(`req ID: ${facebookUserPicture}`);

  User.findOne({ facebookUserID })
 .then((user) => { // eslint-disable-line consistent-return
   if (user) {
     console.log('user found. signing in with facebook');
     console.log(user);
     res.send({ token: tokenForUser(user) });
   }
   else { // eslint-disable-line brace-style
     console.log('no user found. making new user with fb data');
     const newUser = new User();
     newUser.facebookUserID = facebookUserID;
     newUser.email = facebookEmail;
     newUser.password = 'NONE';
     newUser.username = facebookUserName;
     newUser.fbProfPicURL = facebookUserPicture;
     newUser.snapScore = 0;
     newUser.topFriend = 'NONE';
     newUser.friends = [];
     newUser.save()
         .then((result) => {
           console.log(result);
           console.log('token saved as: ');
           console.log({ token: tokenForUser(result) });
           res.send({ token: tokenForUser(result) });
         })
         .catch(err => {
           res.status(400).send(`${err}`);
         });
   }
 }
   )
     .catch(err => {
       res.status(400).send(`${err}`);
     });
};
