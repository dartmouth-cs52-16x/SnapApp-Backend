import mongoose, { Schema } from 'mongoose';

// create a schema for posts with a field
const SnapSchema = new Schema({
  picture: String,
  sentFrom: String,
  sentTo: String,
});

// create model class
const SnapModel = mongoose.model('User', SnapSchema);

export default SnapModel;
