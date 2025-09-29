/**
 * @description HTTP 상태 코드를 포함하는 사용자 정의 에러 클래스
 * @extends Error
 */
class CustomError extends Error {
  constructor(message, statusCode){
    super(message);
    this.statusCode = statusCode;
    // 에러 이름 설정(디버깅 용이)
    this.name = this.constructor.name;
    //스택 트레이스를 캡처(디버깅 정보 유지)
    Error.captureStackTrace(this, this.constructor);
  }
}

// 자주 사용되는 HTTP 에러
class BadRequestError extends CustomError {
  constructor(message = "잘못된 요청"){
    super(message, 400);  // 400 Bad Request
  }
}

class NotFoundError extends CustomError {
  constructor(message = "리소스를 찾을 수 없음"){
    super(message, 404); // 404 Not Found
  }
}

class ConflictError extends CustomError {
  constructor(message = "리소스 충돌(예: 중복 항목)"){
    super(message, 409); // 409 Conflict
  }
}

module.exports = {
  CustomError,
  BadRequestError,
  NotFoundError,
  ConflictError,
}