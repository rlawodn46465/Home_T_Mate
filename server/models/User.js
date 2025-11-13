const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
    select: false,
  },
  age: {
    type: String,
    required: false
  },
  birthyear: {
    type: String,
    required: false
  },
  naverId: {
    type: String,
    unique: true,
    sparse: true,
    required: false
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
    required: false
  },
  kakaoId: {
    type: String,
    unique: true,
    sparse: true,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  toJSON: {virtuals: true},
});

UserSchema.methods.getSignedJwtToken = function(){
  return jwt.sign(
    {id: this._id},
    process.env.JWT_SECRET,
    {expiresIn: process.env.JWT_EXPIRE || '1h'}
  );
};

UserSchema.methods.getSignedRefreshToken = function(){
  return jwt.sign(
    {id: this._id},
    process.env.JWT_SECRET,
    {expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d'}
  );
};

module.exports = mongoose.model('User', UserSchema);