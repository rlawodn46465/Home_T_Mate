// models/User.js

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    // 기본 계정 정보
    name: {
      type: String,
      required: true,
      trim: true,
    },
    nickname: {
      type: String,
      required: false, // 생각
      unique: true, // 생각
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      select: false,
    },
    // 소셜 연동 ID
    socialIds: {
      naverId: { type: String, unique: true, sparse: true, required: false },
      kakaoId: { type: String, unique: true, sparse: true, required: false },
      googleId: { type: String, unique: true, sparse: true, required: false },
      testerId: {type: String, unique: true, sparse: true, required: false}
    },
    // 상세 정보 (선택 입력)
    details: {
      age: { type: String, default: null },
      birthyear: { type: Number, default: null },
      height: { type: Number, default: null },
      weight: { type: Number, default: null },
    },
    // 앱 설정 및 상태
    isDetailed: { type: Boolean, default: false },
    themMode: { type: String, enum: ["light", "dark"], default: "light" },
  },
  { timestamps: true }
);

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "1h",
  });
};

UserSchema.methods.getSignedRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || "7d",
  });
};

module.exports = mongoose.model("User", UserSchema);
