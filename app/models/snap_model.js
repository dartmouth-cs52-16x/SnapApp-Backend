import mongoose, { Schema } from 'mongoose';

// create a schema for snaps with fields
const SnapSchema = new Schema({
  pictureURL: String,
  sentFrom: String,
  sentTo: String,
  time: { type: Date, default: Date.now },
  timer: Number,
  key: String,
  caption: String,
});

// create model class
const SnapModel = mongoose.model('Snap', SnapSchema);

export default SnapModel;
