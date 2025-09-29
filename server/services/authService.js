const User = require("../models/User");
const { CustomError } = require("../utils/errorHandler");
const axios = require("axios");
const qs = require("qs");

/**
 * @description 소셜 로그인 통합 처리 (사용자 조회, 생성 및 JWT 발급)
 * @param {string} socialIdField - 사용자 모델에서 해당 소셜 ID를 저장할 필드명 (예: 'naverId')
 * @param {string} socialId - 해당 소셜 프로바이더의 고유 ID
 * @param {object} profileData - 프로필 정보 객체 {email, name, age, birthyear}
 */
const handleSocialLogin = async (socialIdField, socialId, profileData) => {
  // 1. 소셜 ID로 사용자 조회
  let user = await User.findOne({ [socialIdField]: socialId });

  if (!user) {
    // 2. 신규 사용자면 DB에 저장
    const tempPassword = Math.random().toString(36).slice(-8);

    const newUser = new User({
      name: profileData.name || "Social User",
      email: profileData.email,
      password: tempPassword,
      [socialIdField]: socialId, // 네이버, 구글, 카카오 ID 중 하나가 저장됨
      age: profileData.age,
      birthyear: profileData.birthyear,
    });
    user = await newUser.save();
  }

  // 3. JWT 토큰 생성 및 반환
  const token = user.getSignedJwtToken();

  return {
    user: { id: user._id, name: user.name, email: user.email },
    token,
  };
};

/**
 * @description 네이버 인증 코드를 받아 JWT 토큰을 발급하는 서비스 로직
 * @param {string} code - 네이버로부터 받은 인증 코드
 * @param {string} state - CSRF 방지용 상태 값
 * @returns {Promise<{user: object, token: string}>} 사용자 정보와 JWT
 */
const naverLogin = async (code, state) => {
  try {
    // 1. 네이버 토큰 교환 (GET 요청 사용 - 네이버의 특성)
    const tokenUrl = "https://nid.naver.com/oauth2.0/token";
    const tokenResponse = await axios.get(tokenUrl, {
      params: {
        grant_type: "authorization_code",
        client_id: process.env.NAVER_CLIENT_ID,
        client_secret: process.env.NAVER_CLIENT_SECRET,
        code: code,
        state: state,
      },
    });
    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) {
      throw new CustomError("네이버 액세스 토큰을 가져오지 못했습니다", 401);
    }

    // 2. 네이버 사용자 정보 조회
    const profileUrl = "https://openapi.naver.com/v1/nid/me";
    const profileResponse = await axios.get(profileUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const naverProfile = profileResponse.data.response;
    if (!naverProfile || !naverProfile.email) {
      throw new CustomError(
        "네이버에서 사용자 프로필을 가져오지 못했습니다",
        401
      );
    }

    // 3. 통합 처리 함수 호출
    return handleSocialLogin("naverId", naverProfile.id, {
      email: naverProfile.email,
      name: naverProfile.name,
      age: naverProfile.age,
      birthyear: naverProfile.birthyear,
    });
  } catch (error) {
    console.error("네이버 로그인 에러:", error.message);
    throw new CustomError(
      error.message || "네이버 로그인 실패",
      error.response?.status || 500
    );
  }
};

/**
 * @description 구글 인증 코드를 받아 JWT 토큰을 발급하는 서비스 로직
 * @param {string} code - 구글로부터 받은 인증 코드
 * @returns {Promise<{user: object, token: string}>} 사용자 정보와 JWT
 */
const googleLogin = async (code) => {
  try {
    // 1. 구글 토큰 교환(Post 요청 사용 - Oauth 표준)
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_CALLBACK_URL,
        grant_type: "authorization_code",
      }
    );
    const accessToken = tokenResponse.data.access_token;
    if (!accessToken)
      throw new CustomError("구글 액세스 토큰을 가져오지 못했습니다", 401);

    // 2. 구글 사용자 정보 조회
    const profileResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const googleProfile = profileResponse.data;
    if (!googleProfile || !googleProfile.sub)
      throw new CustomError(
        "구글에서 사용자 프로필을 가져오지 못했습니다",
        401
      );

    // 3. 통합 처리 함수 호출
    return handleSocialLogin("googleId", googleProfile.sub, {
      email: googleProfile.email,
      name: googleProfile.name,
      // 구글은 기본적으로 연령대/출생연도를 제공하지 않으므로 null 처리
      age: null,
      birthyear: null,
    });
  } catch (error) {
    console.error("구글 로그인 에러:", error.message);
    throw new CustomError(
      error.message || "구글 로그인 실패",
      error.response?.status || 500
    );
  }
};

/**
 * @description 카카오 인증 코드를 받아 JWT 토큰을 발급하는 서비스 로직
 * @param {string} code - 카카오로부터 받은 인증 코드
 * @returns {Promise<{user: object, token: string}>} 사용자 정보와 JWT
 */
const kakaoLogin = async (code) => {
  try {
    // 1. 카카오 토큰 교환 (POST 요청)
    const tokenResponse = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      qs.stringify({
        grant_type: "authorization_code",
        client_id: process.env.KAKAO_CLIENT_ID,
        client_secret: process.env.KAKAO_CLIENT_SECRET,
        redirect_uri: process.env.KAKAO_CALLBACK_URL,
        code,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const accessToken = tokenResponse.data.access_token;
    if (!accessToken)
      throw new CustomError("카카오 액세스 토큰을 가져오지 못했습니다", 401);

    // 2. 카카오 사용자 정보 조회
    const profileResponse = await axios.get(
      "https://kapi.kakao.com/v2/user/me",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const kakaoProfile = profileResponse.data;
    if (!kakaoProfile || !kakaoProfile.id)
      throw new CustomError(
        "카카오에서 사용자 프로필을 가져오지 못했습니다",
        401
      );

    const kakaoAccount = kakaoProfile.kakao_account;

    // 3. 통합 처리 함수 호출
    return handleSocialLogin("kakaoId", kakaoProfile.id, {
      // 카카오에서 이메일은 kakao_account.email에, 이름은 kakao_account.profile.nickname에 있습니다.
      email: kakaoAccount?.email,
      name: kakaoAccount?.profile?.nickname,
      age: kakaoAccount?.age_range,
      birthyear: kakaoAccount?.birthyear,
    });
  } catch (error) {
    console.error("카카오 로그인 에러:", error.message);
    throw new CustomError(
      error.message || "카카오 로그인 실패",
      error.response?.status || 500
    );
  }
};

module.exports = {
  naverLogin,
  googleLogin,
  kakaoLogin,
};
