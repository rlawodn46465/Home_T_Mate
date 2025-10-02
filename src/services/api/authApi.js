const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_AUTH_PATH = '/api/v1/auth';

/**
 * 소셜 로그인 경로를 생성하여 반환합니다.
 * @param {'naver' | 'google' | 'kakao'} provider 
 * @returns {string} - 최종 소셜 로그인 리다이렉트 URL
 */
export const getSocialLoginUrl = (provider) => {
  console.log(API_BASE_URL);
  return `${API_BASE_URL}${API_AUTH_PATH}/${provider}`;
}

/**
 * 소셜 로그인을 실행합니다. (브라우저 리다이렉션)
 * @param {'naver' | 'google' | 'kakao'} provider
 */
export const initiateSocialLogin = (provider) => {
  const url = getSocialLoginUrl(provider);
  window.location.href = url;
};