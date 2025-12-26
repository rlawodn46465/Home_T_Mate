import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import axios from "axios";

// Access Token을 관리할 전역 변수
let _accessToken: string | null = null;

// 외부에서 Access Token을 설정/제거할 수 있는 함수
export const setAccessToken = (token: string) => {
  _accessToken = token;
};

export const clearAuthTokens = (): void => {
  _accessToken = null;
};

// 기본 인스턴스
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  timeout: 10000, // 10초
  headers: {
    "Content-Type": "application/json",
  },
  // HttpOnly 쿠키 전송을 위한 설정
  withCredentials: true,
});

// 요청 인터셉터 설정
// 모든 요청이 서버로 가기 전에 토큰을 추가하는 로직
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (_accessToken) {
      config.headers.Authorization = `Bearer ${_accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// 응답 인터셉터 설정
// 서버 응답을 받은 후, 토큰 만료 등 에러를 공통 처리 로직
api.interceptors.response.use(
  (response: AxiosResponse) => response, // 응답 성공시 그대로 반환
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    const status = error.response?.status;

    // 401 Unauthorized 에러 (토큰 만료 등) 발생 시
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 무한 루프 방지

      try {
        // HttpOnly 쿠키로 관리되는 Refresh Token을 사용하여 토큰 갱신 요청
        const refreshResponse = await axios.post<{ accessToken: string }>(
          `${api.defaults.baseURL}/api/v1/auth/refresh`,
          null,
          { withCredentials: true }
        );

        // 전역 변수(_accessToken) 업데이트
        const { accessToken } = refreshResponse.data;
        setAccessToken(accessToken);

        // 원래 요청 헤더 업데이트
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // 토큰 갱신 실패 시 (리프레시 토큰도 만료시)
        clearAuthTokens();
        throw Promise.reject(refreshError);
      }
    }

    // 그 외의 에러 처리
    if (status === 401 && originalRequest._retry) {
      console.warn("인증 세션이 만료되었습니다. 다시 로그인해주세요.");
    }

    return Promise.reject(error);
  }
);

export default api;
