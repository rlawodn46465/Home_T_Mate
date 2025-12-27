import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./pages/Header";
import MainLayout from "./pages/MainLayout";
import SocialAuthRedirectHandler from "./pages/Login/SocialAuthRedirectHandler";
import styles from "./App.module.css";
import { useAuth } from "./hooks/useAuth";
import { useEffect } from "react";

const App = () => {
  const { loadUser, isAuthLoading } = useAuth();

  // 초기 인증 확인(마운트)
  useEffect(() => {
    const initAuth = async () => {
      try {
        await loadUser();
      } catch (error) {
        console.log("초기 세션 없음: 다시 로그인이 필요합니다.");
      }
    };

    initAuth();
  }, [loadUser]);

  if (isAuthLoading) {
    return (
      <div>
        사용자 정보를 확인 중입니다...
      </div>
    );
  }

  return (
    <div className={styles.mainContainer}>
      <Header />
      <Routes>
        <Route path="/login/success" element={<SocialAuthRedirectHandler />} />
        <Route
          path="/login/signup-complete"
          element={<SocialAuthRedirectHandler />}
        />
        <Route path="/" element={<Navigate to="/community" replace />} />
        <Route path="/community/*" element={<MainLayout />} />
      </Routes>
    </div>
  );
};

export default App;
