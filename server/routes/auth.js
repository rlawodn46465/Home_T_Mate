// routes/auth.js

const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const router = express.Router();
const authService = require("../services/authService");
const { CustomError } = require("../utils/errorHandler");
const { protect } = require("../middlewares/authMiddleware");

const FRONTEND_LOGIN_REDIRECT_URL = process.env.FRONTEND_LOGIN_REDIRECT_URL;

// Refresh Token을 프론트로 리다이렉트
const sendAuthResponse = (res, result) => {
  // HTTP-Only Cookie 설정
  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // 배포시 변경
    maxAge: 3600000 * 24 * 7, // 7일 유효(ms)
    sameSite: "Lax",
  });

  // 신규 가입 여부에 따라 리다이렉트 경로 분리 / 신규 : 기존
  const redirectPath = result.isNewUser
    ? "/login/signup-complete"
    : "/login/success"; // 프론트 특정 경로로 리다이렉트

  res.redirect(
    `${FRONTEND_LOGIN_REDIRECT_URL}${redirectPath}?token=${result.token}`
  );
};

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
      return res.redirect(
        `${FRONTEND_LOGIN_REDIRECT_URL}/login?error=${encodeURIComponent(
          error_description || error
        )}`
      );
    }

    const result = await authService.googleLogin(code);
    sendAuthResponse(res, result);
  })
);

// 네이버 로그인 라우트 (GET /api/v1/auth/naver)
router.get(
  "/naver",
  asyncHandler(async (req, res) => {
    const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${
      process.env.NAVER_CLIENT_ID
    }&redirect_uri=${process.env.NAVER_CALLBACK_URL}&state=${Math.random()
      .toString(36)
      .substring(2, 15)}&auth_type=reprompt`;

    res.redirect(naverAuthUrl);
  })
);

// 네이버 콜백 처리 라우트 (GET /api/v1/auth/naver/callback)
router.get(
  "/naver/callback",
  asyncHandler(async (req, res) => {
    const { code, state, error, error_description } = req.query;
    if (error) {
      return res.redirect(
        `${FRONTEND_LOGIN_REDIRECT_URL}/login?error=${encodeURIComponent(
          error_description || error
        )}`
      );
    }

    // 1. 서비스 로직 호출
    const result = await authService.naverLogin(code, state);

    // 2. Cookie 설정 후 리다이렉션
    sendAuthResponse(res, result);
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
      return res.redirect(
        `${FRONTEND_LOGIN_REDIRECT_URL}/login?error=${encodeURIComponent(
          error_description || error
        )}`
      );
    }

    const result = await authService.kakaoLogin(code);
    sendAuthResponse(res, result);
  })
);

// 인증/토큰 관리 라우트 (POST /api/v1/auth/refresh)
router.post(
  "/refresh",
  asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new CustomError("리프레시 토큰이 없습니다.", 401);
    }

    const newAccessToken = await authService.refreshToken(refreshToken);

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  })
);

// 로그인된 사용자 정보 반환 (GET /api/v1/auth/me)
router.get(
  "/me",
  protect,
  asyncHandler(async (req, res) => {
    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        nickname: req.user.nickname,
        email: req.user.email,
      },
    });
  })
);

// 로그아웃 (POST /api/v1/auth/logout)
router.post(
  "/logout",
  asyncHandler(async (req, res) => {
    authService.clearAuthCookies(res);

    res.status(200).json({
      success: true,
      message: "로그아웃 성공",
    });
  })
);

module.exports = router;
