// models/User.js
// import mongoose from 'mongoose';
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullName:{
        type:String
    },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['instructor', 'student'],
    required: true
  },
  firebase_uid: {
    type: String,
    required: true,
    unique: true
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
// export default
module.exports = User
