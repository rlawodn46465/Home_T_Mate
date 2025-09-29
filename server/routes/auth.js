const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const authService = require('../services/authService');
const { BadRequestError, CustomError } = require('../utils/errorHandler');

// 네이버 로그인 라우트 (GET /api/v1/auth/naver)
router.get('/naver', asyncHandler(async (req, res) => {
  const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.NAVER_CLIENT_ID}&redirect_uri=${process.env.NAVER_CALLBACK_URL}&state=${Math.random().toString(36).substring(2, 15)}`;

  res.redirect(naverAuthUrl);
}));

// 네이버 콜백 처리 라우트 (GET /api/v1/auth/naver/callback)
router.get('/naver/callback', asyncHandler(async (req, res) => {
  const { code, state, error, error_description } = req.query;

  if(error) {
    console.error('Naver OAuth Error:', error_description);
    throw new CustomError(error_description, 401);
  }

  // 1. 서비스 로직 호출
  const result = await authService.naverLogin(code, state);

  // 2. 클라이언트에게 JWT 토큰 전달 (실제 환경에서는 프론트엔드로 리다이렉트)
  res.status(200).json({
    success: true,
    message: '네이버 로그인 성공',
    data: result.user,
    token: result.token
  });
  // 💡 참고: 실제 운영 환경에서는 res.redirect('프론트엔드_주소?token=' + result.token)와 같이 처리
}));

module.exports = router;