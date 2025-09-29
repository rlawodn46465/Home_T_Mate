const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  toJSON: {virtuals: true},
});

UserSchema.pre('save', async function(next){
  // 비밀번호가 수정되었을 때만 해싱
  if(!this.isModified('password')){
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.getSignedJwtToken = function(){
  return jwt.sign(
    {id: this._id},
    process.env.JWT_SECRET,
    {expiresIn: process.env.JWT_EXPIRE}
  );
};

UserSchema.methods.matchPassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);