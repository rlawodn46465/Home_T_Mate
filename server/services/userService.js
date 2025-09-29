const User = require("../models/User");
const { ConflictError } = require("../utils/errorHandler");

/**
 * @description 모든 사용자 목록을 조회하는 서비스 로직
 * @returns {Promise<Array>} 사용자 객체 배열
 */
const getAllUsers = async () => {
  const users = await User.find({}).select("-__v"); //'__v' 필드는 제외하고 조회
  return users;
};

/**
 * @description 새로운 사용자를 생성하고 저장하는 서비스 로직
 */
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
