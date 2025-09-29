const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const authService = require("../services/authService");
const { BadRequestError, CustomError } = require("../utils/errorHandler");

// 네이버 로그인 라우트 (GET /api/v1/auth/naver)
router.get(
  "/naver",
  asyncHandler(async (req, res) => {
    const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${
      process.env.NAVER_CLIENT_ID
    }&redirect_uri=${process.env.NAVER_CALLBACK_URL}&state=${Math.random()
      .toString(36)
      .substring(2, 15)}`;

    res.redirect(naverAuthUrl);
  })
);

// 네이버 콜백 처리 라우트 (GET /api/v1/auth/naver/callback)
router.get(
  "/naver/callback",
  asyncHandler(async (req, res) => {
    const { code, state, error, error_description } = req.query;
    if (error) {
      throw new CustomError(error_description, 401);
    }

    // 1. 서비스 로직 호출
    const result = await authService.naverLogin(code, state);

    // 2. 클라이언트에게 JWT 토큰 전달 (실제 환경에서는 프론트엔드로 리다이렉트)
    res.status(200).json({
      success: true,
      message: "네이버 로그인 성공",
      data: result.user,
      token: result.token,
    });
    // 💡 참고: 실제 운영 환경에서는 res.redirect('프론트엔드_주소?token=' + result.token)와 같이 처리
  })
);

// 구글 로그인 라우트 (GET /api/v1/auth/google)
router.get(
  "/google",
  asyncHandler(async (req, res) => {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_CALLBACK_URL}&response_type=code&scope=profile email`;
    res.redirect(googleAuthUrl);
  })
);

// 구글 콜백 처리 라우트 (GET /api/v1/auth/google/callback)
router.get(
  "/google/callback",
  asyncHandler(async (req, res) => {
    const { code, error, error_description } = req.query;
    if (error) {
      throw new CustomError(error_description, 401);
    }

    const result = await authService.googleLogin(code);
    res.status(200).json({
      success: true,
      message: "구글 로그인 성공",
      data: result.user,
      token: result.token,
    });
  })
);

// 카카오 로그인 라우트 (GET /api/v1/auth/kakao)
router.get(
  "/kakao",
  asyncHandler(async (req, res) => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${process.env.KAKAO_CALLBACK_URL}&response_type=code`;
    res.redirect(kakaoAuthUrl);
  })
);

// 카카오 콜백 처리 라우트 (GET /api/v1/auth/kakao/callback)
router.get(
  "/kakao/callback",
  asyncHandler(async (req, res) => {
    const { code, error, error_description } = req.query;
    if (error) {
      throw new CustomError(error_description, 401);
    }

    const result = await authService.kakaoLogin(code);
    res
      .status(200)
      .json({
        success: true,
        message: "카카오 로그인 성공",
        data: result.user,
        token: result.token,
      });
  })
);

module.exports = router;
