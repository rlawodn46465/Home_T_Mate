const { CustomError } = require("../utils/errorHandler");

/**
 * @description 전역 에러 처리 미들웨어
 * 모든 라우트, 서비스에서 throw된 에러를 최종적으로 처리합니다.
 */
const errorHandler = (err, req, res, next) => {
  // 1. 상태 코드 결정
  const statusCode =
    err instanceof CustomError
      ? err.statusCode
      : (err.code === 11000 ? 409 : 500);

  // 2. 메시지 결정
  console.error(`🚨 전역 오류 처리기 적발 [${statusCode}]:`, err.message);
  if(statusCode === 500){
    console.error(err.stack);
  }

  // 3. 응답 전송
  res.status(statusCode).json({
    message: statusCode === 500 && process.env.NODE_ENV === 'production'
      ? "내부 서버 에러"
      : err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = errorHandler;