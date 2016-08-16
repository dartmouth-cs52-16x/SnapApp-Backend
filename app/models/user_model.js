import mongoose, { Schema } from 'mongoose';

// create a schema for posts with a field
const UserSchema = new Schema({
  username: String,
  email: String,
  password: String,
});

// create model class
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
