const User = require("../models/User");
const {
  NotFoundError,
  ConflictError,
  CustomError,
} = require("../utils/errorHandler");
const axios = require("axios");

/**
 * @description 네이버 인증 코드를 받아 JWT 토큰을 발급하는 통합 서비스 로직
 * @param {string} code - 네이버로부터 받은 인증 코드
 * @param {string} state - CSRF 방지용 상태 값
 * @returns {Promise<{user: object, token: string}>} 사용자 정보와 JWT
 */
const naverLogin = async (code, state) => {
  try {
    // 1. 네이버 토큰 교환
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

    const { email, name, id: naverId, age, birthyear } = naverProfile;

    // 3. DB에서 사용자 조회 또는 신규 생성
    let user = await User.findOne({ naverId });

    if (!user) {
      const newUser = new User({
        name: name || "Naver User",
        email: email,
        naverId: naverId,
        age: age,
        birthyear: birthyear
      });
      user = await newUser.save();
    }

    // 4. JWT 토큰 생성 및 반환
    const token = user.getSignedJwtToken();

    return {
      user: { id: user._id, name: user.name, email: user.email },
      token,
    };
  } catch (error) {
    console.error("네이버 로그인 에러:", error.message);

    const status = error.response ? error.response.status : 500;

    throw new CustomError(
      error.message || "네이버 로그인 실패",
      status
    );
  }
};

module.exports = {
  naverLogin,
};
