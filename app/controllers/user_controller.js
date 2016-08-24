//  Sources: http://mongoosejs.com/docs/queries.html

import User from '../models/user_model';
import jwt from 'jwt-simple';
// import config from '../config';
import dotenv from 'dotenv';
dotenv.config({ silent: true });


export const signin = (req, res, next) => {
  console.log('sign in started');
  res.send({ token: tokenForUser(req.user) });
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
  console.log('~~~~~REQUEST USER ~~~~~~');
  console.log(req.user);
  res.send(req.user);
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
        newUser.groups = [[]];
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
  const facebookUserPicture = req.body.facebookUserPicture;
  console.log(`req ID: ${facebookUserID}`);
  console.log(`req ID: ${facebookUserName}`);
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
      newUser.email = 'NONE';
      newUser.password = 'NONE';
      newUser.username = facebookUserName;
      newUser.profilePictureURL = facebookUserPicture;
      newUser.snapScore = 0;
      newUser.topFriend = 'NONE';
      newUser.friends = [];
      newUser.groups = [[]];
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
