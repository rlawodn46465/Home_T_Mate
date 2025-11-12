const User = require("../models/User");
const { ConflictError } = require("../utils/errorHandler");

// 모든 사용자 목록 조회
const getAllUsers = async () => {
  const users = await User.find({}).select("-__v"); //'__v' 필드는 제외하고 조회
  return users;
};

// 새로운 사용자 DB에 생성
const createUser = async (userData) => {
  try {
    const newUser = new User(userData);
    const savedUser = await newUser.save();
    return savedUser.toObject({ versionKey: false });
  } catch (error) {
    if (error.code === 11000) {
      throw new ConflictError("이 이메일을 사용하는 사용자가 이미 존재합니다.");
    }
    throw error;
  }
};

module.exports = {
  getAllUsers,
  createUser,
};
