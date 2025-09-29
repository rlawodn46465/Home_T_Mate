const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const authService = require('../services/authService');
const { BadRequestError } = require('../utils/errorHandler');

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