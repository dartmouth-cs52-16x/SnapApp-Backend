import jwt from 'jwt-simple';
import User from '../models/user_model';
import dotenv from 'dotenv';

dotenv.config({ silent: true });
// encodes a new token for a user object
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.API_SECRET);
}

export const signin = (req, res, next) => {
  res.send({ token: tokenForUser(req.user) });
};

export const signup = (req, res, next) => {
  console.log(req.body);
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send('You must provide email and password');
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        const newUser = new User();
        newUser.email = email;
        newUser.username = username;
        newUser.password = password;
        newUser.save()
          .then(() => {
            res.send({ token: tokenForUser(newUser) });
          });
      } else {
        console.log(`USER ALREADY EXISTS: ${user}`);
        return res.status(422).send('User already exists');
      }
    });
};
