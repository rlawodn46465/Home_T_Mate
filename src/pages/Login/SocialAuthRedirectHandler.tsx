import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ORIGINAL_PATH_KEY = "hometmate_original_path";

const SocialAuthRedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loadUser } = useAuth();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const serverAuthToken = searchParams.get("token");
    const currentPath = location.pathname;

    const originalPathWithQuery =
      sessionStorage.getItem(ORIGINAL_PATH_KEY) || "/";
    sessionStorage.removeItem(ORIGINAL_PATH_KEY); // 사용 후 바로 삭제

    const originalPath = originalPathWithQuery.split("?")[0];

    const processLogin = async () => {
      let targetPanel = "login";

      try {
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
  }, [location.pathname, location.search, navigate, loadUser]);

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
