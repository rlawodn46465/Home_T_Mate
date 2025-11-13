import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

// 경로 보존을 위한 상수 (App.jsx 또는 utils 파일에 정의해야 하지만, 일단 여기에 임시 정의)
// 이 상수는 utils/constants.js 등에 별도로 정의하는 것이 좋음
const ORIGINAL_PATH_KEY = "hometmate_original_path";

// 소셜 로그인 콜백 경로 처리, 저장된 경로를 복원하고 리다이렉트
const SocialAuthRedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loadUser } = useAuth();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const serverAuthToken = searchParams.get("token"); // 서버가 쿼리로 토큰을 보냈다고 가정
    const currentPath = location.pathname;

    // 저장된 원래 경로를 불러 복원. 없으면 '/'를 기본값으로 사용
    const originalPathWithQuery =
      sessionStorage.getItem(ORIGINAL_PATH_KEY) || "/";
    sessionStorage.removeItem(ORIGINAL_PATH_KEY); // 사용 후 바로 삭제

    // originalPath에서 쿼리 파라미터를 제거하고 순수한 경로(pathname)만 추출
    const originalPath = originalPathWithQuery.split("?")[0];

    const processLogin = async () => {
      let targetPanel = "login";

      try {
        // Access Token 설정 및 사용자 정보 로드, 전역 상태 업데이트
        await loadUser(serverAuthToken);
        if (currentPath === "/login/signup-complete") {
          targetPanel = "onboarding"; // 신규 회원 -> 온보딩
          console.log("🚨 신규 가입자 감지: 'onboarding' 패널로 이동합니다.");
        } else if (currentPath === "/login/success") {
          targetPanel = "dashboard"; // 기존 회원 -> 대시보드
          console.log("✅ 기존 사용자 감지: 'dashboard' 패널로 이동합니다.");
        } else {
          targetPanel = "dashboard";
        }
      } catch (error) {
        console.error("로그인 처리 실패: ", error);
        targetPanel = "login";
      }
      const finalRedirectUrl = `${originalPath}?panel=${targetPanel}`;

      navigate(finalRedirectUrl, { replace: true });
    };
    processLogin();
  }, [location.pathname, navigate, loadUser]);

  // 로딩 UI
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f9f9f9",
      }}
    >
      <p style={{ display: "flex", alignItems: "center", fontWeight: "bold" }}>
        로그인 처리 중입니다...
      </p>
    </div>
  );
};

export default SocialAuthRedirectHandler;
