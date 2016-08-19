import mongoose, { Schema } from 'mongoose';

// create a schema for posts with a field
const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  username: { type: String, unique: true, lowercase: true },
  password: String,
});

// create model class
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
