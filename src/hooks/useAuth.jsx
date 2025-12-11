import {createContext, useContext, useState, useCallback, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import {
  handleSocialLoginSuccess,
  logoutUser,
} from "../services/api/authService";
import { clearAuthTokens } from "../services/api/api";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const navigate = useNavigate();

  // 사용자 정보를 로드하고 상태를 업데이트하는 함수
  const loadUser = useCallback(async (token = null) => {
    try {
      setIsAuthLoading(true);
      // 토큰을 설정하고 사용자 정보 가져오기
      const data = await handleSocialLoginSuccess(token);
      setUser(data.user);
      return data.user;
    } catch (error) {
      console.error("인증 상태 확인/사용자 로드 실패: ", error);
      // 실패시 토큰 제거 및 상태 초기화
      clearAuthTokens();
      setUser(null);
      throw error;
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  // 로그아웃 함수
  const handleLogout = useCallback(async () => {
    try {
      await logoutUser();
      setUser(null);
      // 로그아웃 후 로그인 페이지로 이동
      navigate("/");
    } catch (error) {
      console.error("로그아웃 처리 중 오류 발생: ", error);
      // 서버 로그아웃이 실패해도 클라이언트 상태는 초기화
      setUser(null);
      navigate("/");
    }
  }, [navigate]);

  // 초기 인증 상태 확인
  useEffect(() => {
    const checkInitialAuth = async () => {
      try {
        // 토큰 없이 호출 시, Access Token이 만료되었으면 서버에서 401 반환
        const data = await handleSocialLoginSuccess();
        setUser(data.user);
      } catch (error) {
        // 갱신 실패 (로그인 필요)
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };
    checkInitialAuth();
  }, [loadUser]);

  const value = {
    user,
    isAuthenticated: !!user, // user 객체가 존재하면 인증된 상
    isAuthLoading,
    handleLogout,
    loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
};
