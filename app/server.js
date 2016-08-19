import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import apiRouter from './router';

// initialize
const app = express();

// enable/disable cross origin resource sharing if necessary
app.use(cors());

// enable json message body for posting data to API
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', apiRouter);


// default index route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/s3', require('react-s3-uploader/s3router')({
  bucket: 'MyS3Bucket',
  region: 'us-east-1', // optional
  signatureVersion: 'v4', // optional (use for some amazon regions: frankfurt and others)
  headers: { 'Access-Control-Allow-Origin': '*' }, // optional
  ACL: 'private', // this is default
}));

// START THE SERVER
// =============================================================================
const port = process.env.PORT || 9090;
app.listen(port);

console.log(`listening on: ${port}`);

// DB Setup
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/SnapApp';
mongoose.connect(mongoURI);
// set mongoose promises to es6 default
mongoose.Promise = global.Promise;
