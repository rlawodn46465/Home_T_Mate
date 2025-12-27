import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ORIGINAL_PATH_KEY = "hometmate_original_path";

const SocialAuthRedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loadUser } = useAuth();

  const isprocessing = useRef(false);

  useEffect(() => {
    if (isprocessing.current) return;
    isprocessing.current = true;

    const searchParams = new URLSearchParams(location.search);
    const serverAuthToken = searchParams.get("token");
    const currentPath = location.pathname;

    const savedPath = sessionStorage.getItem(ORIGINAL_PATH_KEY);
    const originalPath = savedPath ? savedPath.split("?")[0] : "/community";

    sessionStorage.removeItem(ORIGINAL_PATH_KEY);

    const processLogin = async () => {
      let targetPanel = "dashboard";

      try {
        if (serverAuthToken) {
          await loadUser(serverAuthToken);
        }

        if (currentPath.includes("signup-complete")) {
          targetPanel = "onboarding";
        } else {
          targetPanel = "dashboard";
        }
      } catch (error) {
        console.error("로그인 처리 실패: ", error);
        return navigate("/login", { replace: true });
      }

      const baseRoute = originalPath === "/" ? "/community" : originalPath;
      const finalRedirectUrl = `${baseRoute}?panel=${targetPanel}`;

      console.log(`🚀 최종 이동 경로: ${finalRedirectUrl}`);
      navigate(finalRedirectUrl, { replace: true });
    };

    processLogin();
  }, [location.pathname, location.search, navigate, loadUser]);

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
      <p style={{ fontWeight: "bold" }}>로그인 처리 중입니다...</p>
    </div>
  );
};

export default SocialAuthRedirectHandler;
