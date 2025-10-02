import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// 경로 보존을 위한 상수 (App.jsx 또는 utils 파일에 정의해야 하지만, 일단 여기에 임시 정의)
// 클린 코딩 원칙에 따라, 이 상수는 utils/constants.js 등에 별도로 정의하는 것이 좋습니다.
const ORIGINAL_PATH_KEY = "hometmate_original_path";

/**
 * @description 소셜 로그인 콜백 경로를 처리하고, 저장된 원래 경로를 복원하여 적절한 패널로 리다이렉트
 */
const SocialAuthRedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;

    // 1. 저장된 원래 경로를 불러와 복원합니다. 없으면 '/'를 기본값으로 사용
    const originalPath = sessionStorage.getItem(ORIGINAL_PATH_KEY) || "/";
    sessionStorage.removeItem(ORIGINAL_PATH_KEY); // 사용 후 바로 삭제

    let targetPanel = "login";

    if (currentPath === "/login/signup-complete") {
      targetPanel = "onboarding"; // 신규 회원 -> 온보딩 패널
      console.log("🚨 신규 가입자 감지: 'onboarding' 패널로 이동합니다.");
    } else if (currentPath === "/login/success") {
      targetPanel = "login"; // 기존 회원 -> 로그인 패널 (로그인 성공 대시보드 역할)
      console.log("✅ 기존 사용자 감지: 'login' 패널로 이동합니다.");
    }

    // 2. 원래 경로에 panel 쿼리를 추가하여 최종 리다이렉트 URL을 생성
    // 쿼리가 이미 있다면 '&'로, 없다면 '?'로 연결합니다.
    const finalRedirectUrl = `${originalPath}${
      originalPath.includes("?") ? "&" : "?"
    }panel=${targetPanel}`;

    navigate(finalRedirectUrl, { replace: true });
  }, [location.pathname, navigate]);

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
