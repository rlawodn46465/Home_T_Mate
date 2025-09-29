const User = require("../models/User");
const { NotFoundError, ConflictError } = require("../utils/errorHandler");

/**
 * @description 새로운 사용자를 등록하는 서비스 로직 (회원가입)
 */
const registerUser = async ({name, email, password}) => {
  try{
    const user = await User.create({name, email, password});

    const token = user.getSignedJwtToken();

    return{
      user: {id: user._id, name: user.name, email: user.email},
      token
    };
  } catch (error){
    if(error.code === 11000){
      throw new ConflictError('이 이메일을 사용하는 사용자가 이미 존재합니다.');
    }
    throw error;
  }
};

/**
 * @description 사용자 로그인을 처리하는 서비스 로직 (로그인)
 */
const loginUser = async ({email, password}) => {
  // 1. 이메일로 사용자 조회 (password 필드를 명시적으로 포함)
  const user = await User.findOne({email}).select('+password');

  // 2. 사용자가 없거나 비밀번호가 일치하지 않는 경우
  if(!user || !(await user.matchPassword(password))){
    throw new NotFoundError("잘못된 인증");
  }

  // 3. 로그인 성공 시 JWT 토큰 생성
  const token = user.getSignedJwtToken();

  return {
    user: {id: user_id, name: user.name, email: user.email},
    token
  };
};

module.exports = {
  registerUser,
  loginUser,
}