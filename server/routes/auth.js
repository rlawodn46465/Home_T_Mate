const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const authService = require('../services/authService');
const { BadRequestError, CustomError } = require('../utils/errorHandler');

// 회원가입 라우트 (POST /api/v1/auth/register)
router.post('/register', asyncHandler(async (req, res) => {
  const {name, email, password } = req.body;

  if(!name || !email || !password){
    throw new BadRequestError('필수 항목을 입력해주세요: name, email, password');
  }

  const result = await authService.registerUser({name, email, password});

  res.status(201).json({
    success: true,
    message: '사용자가 성공적으로 등록되었습니다.',
    data: result.user,
    token: result.token
  });
}));

// 로그인 라우트 (POST /api/v1/auth/login)
router.post('/login', asyncHandler(async (req, res) => {
  const {email,password} = req.body;

  if(!email || !password){
    throw new BadRequestError('이메일과 비밀번호를 입력하세요.');
  }

  const result = await authService.loginUser({email, password});

  res.status(200).json({
    success: true,
    message: '로그인되었습니다.',
    data: result.user,
    token: result.token
  })
}));

// 네이버 로그인 라우트 (GET /api/v1/auth/naver)
router.get('/naver', asyncHandler(async (req, res) => {
  const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.NAVER_CLIENT_ID}&redirect_uri=${process.env.NAVER_CALLBACK_URL}&state=${Math.random().toString(36).substring(2, 15)}`;

  res.redirect(naverAuthUrl);
}));

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