import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
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
    setIsAuthLoading(true);
    try {
      // 토큰을 설정하고 사용자 정보 가져오기
      const data = await handleSocialLoginSuccess(token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      console.error("인증 상태 확인/사용자 로드 실패: ", err);
      // 실패시 토큰 제거 및 상태 초기화
      clearAuthTokens();
      setUser(null);
      throw err;
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  // 로그아웃 함수
  const handleLogout = useCallback(async () => {
    setIsAuthLoading(true);
    try {
      await logoutUser();
    } catch (err) {
      console.error("로그아웃 처리 중 오류 발생: ", err);
    } finally {
      clearAuthTokens();
      setUser(null);
      setIsAuthLoading(false);
      navigate("/");
    }
  }, [navigate]);

  // 초기 인증 상태 확인
  useEffect(() => {
    loadUser().catch(() => {});
  }, [loadUser]);

  const value = {
    user,
    isAuthenticated: !!user, // user 객체가 존재하면 인증된 상
    isAuthLoading,
    handleLogout,
    loadUser,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
