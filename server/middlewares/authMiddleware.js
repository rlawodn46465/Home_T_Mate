// middlewares/authMiddleware.js

const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/User");
const { CustomError } = require("../utils/errorHandler");

//JWT 토큰을 검증하여 보호된 라우트에 대한 접근을 인가
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. HTTP 헤더에 토큰 확인
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // 'Beare ' 부분을 제외한 토큰 문자열 추출
      token = req.headers.authorization.split(" ")[1];

      // 2. 토큰 검증 및 디코드
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. 디코드된 ID로 사용자 정보 조회
      req.user = await User.findById(decoded.id).select("-password -__v");

      if (!req.user) {
        // 토큰은 유효하지만 DB에서 사용자를 찾을 수 없는 경우
        throw new CustomError(
          "사용자를 찾을 수 없습니다. 토큰이 잘못되었습니다.",
          401
        );
      }

      // 4. 다음 미들웨어/라우트 핸들러로 이동
      next();
    } catch (error) {
      console.error(`🚨 토큰 인증 오류: ${error.message}`);
      throw new CustomError(
        "토큰이 유효하지 않습니다. 토큰이 만료되었습니다.",
        401
      );
    }
  }

  // 5. 토큰이 없는 경우
  if (!token) {
    throw new CustomError("토큰이 유효하지 않습니다. 토큰이 없습니다.", 401);
  }
});

module.exports = { protect };
