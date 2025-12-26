import api, { setAccessToken, clearAuthTokens } from "./api";

export interface UserInfo {
  id: string | number;
  email: string;
  name?: string;
  nickname?: string;
}

export interface LoginResponse {
  success?: boolean;
  user: UserInfo;
}

const API_AUTH_PATH = "/api/v1/auth";

// 소셜 로그인 경로를 생성하여 반환
export const getSocialLoginUrl = (provider: string): string => {
  return `${api.defaults.baseURL}${API_AUTH_PATH}/${provider}`;
};

// 소셜 로그인을 실행
export const initiateSocialLogin = (provider: string): void => {
  const url = getSocialLoginUrl(provider);
  window.location.href = url;
};

// 서버에서 소셜 로그인 성공 후 리다이렉트될 때 호출할 API
// 로그인 성공 후 서버에서 발급한 토큰 및 사용자 정보 가져올 함수
export const handleSocialLoginSuccess = async (
  token?: string
): Promise<LoginResponse> => {
  try {
    if (token) {
      setAccessToken(token);
    }
    // 서버의 /auth/me 엔드포인트를 호출하여 현재 인증된 사용자 정보를 가져옴
    const response = await api.get<LoginResponse>(`${API_AUTH_PATH}/me`);

    // 사용자 정보 반환
    return response.data;
  } catch (error) {
    // 토큰 설정 실패 또는 사용자 정보 로드 실패 시
    clearAuthTokens();
    throw error;
  }
};

export const logoutUser = async (): Promise<boolean> => {
  try {
    // 서버에 로그아웃 요청
    await api.post(`${API_AUTH_PATH}/logout`);
  } catch (error) {
    console.error(
      "서버 로그아웃 요청 실패 (클라이언트 토큰은 제거): ",
      error.message
    );
  } finally {
    clearAuthTokens(); // 메모리 Access Token 제거
  }
  return true;
};
