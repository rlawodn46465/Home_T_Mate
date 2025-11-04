/**
 * @description Express 비동기 라우트 핸들러에서 발생하는 에러를 캐치하여
 * Express의 에러 처리 미들웨어로 전달(next)하는 유틸리티 함수입니다.
 * @param {function} fn - 비동기 함수인 Express 라우트 핸들러 (req, res, next) => Promise
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
