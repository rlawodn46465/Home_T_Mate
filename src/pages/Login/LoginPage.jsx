import { useLocation } from "react-router-dom";
import "./LoginPage.css";
import { initiateSocialLogin } from "../../services/api/authApi";
import google from "../../assets/images/google_icon.svg";
import naver from "../../assets/images/naver_icon.svg";
import kakao from "../../assets/images/kakao_icon.svg";
import SocialLoginItem from "../../components/ui/Login/SocialLoginItem";

const ORIGINAL_PATH_KEY = "hometmate_original_path";

const LoginPage = () => {
  const location = useLocation();

  const handleSocialLogin = (provider) => {
    const currentPath = location.pathname;
    sessionStorage.setItem(ORIGINAL_PATH_KEY, currentPath);
    initiateSocialLogin(provider);
  };
  const social = [
    {
      id: "google",
      iconSrc: google,
      text: "Google 로그인",
      provider: "google",
    },
    { id: "naver", iconSrc: naver, text: "네이버 로그인", provider: "naver" },
    { id: "kakao", iconSrc: kakao, text: "카카오 로그인", provider: "kakao" },
  ];

  return (
    <div className="login-container">
      <h2>로그인 방법을 선택해주세요.</h2>
      <ul className="login-box">
        {social.map((menu) => (
          <SocialLoginItem
            key={menu.id}
            {...menu}
            onClick={() => handleSocialLogin(menu.provider)}
          />
        ))}
      </ul>
    </div>
  );
};

export default LoginPage;
