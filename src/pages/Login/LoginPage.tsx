import { useLocation } from "react-router-dom";
import { initiateSocialLogin } from "../../services/api/authService";
import google from "../../assets/images/google_icon.svg";
import naver from "../../assets/images/naver_icon.svg";
import kakao from "../../assets/images/kakao_icon.svg";
import tester from "../../assets/images/tester_icon.svg";
import SocialLoginItem from "../../components/ui/Login/SocialLoginItem";

import styles from "./LoginPage.module.css";

type SocialProvider = "google" | "naver" | "kakao" | "tester";

interface SocialLoginOption {
  id: string;
  iconSrc: string;
  text: string;
  provider: SocialProvider;
}

const ORIGINAL_PATH_KEY = "hometmate_original_path";

const LoginPage = () => {
  const location = useLocation();

  const handleSocialLogin = (provider: SocialProvider) => {
    const currentPath = location.pathname + location.search;
    sessionStorage.setItem(ORIGINAL_PATH_KEY, currentPath);
    initiateSocialLogin(provider);
  };

  const social: SocialLoginOption[] = [
    {
      id: "google",
      iconSrc: google,
      text: "Google 로그인",
      provider: "google",
    },
    { id: "naver", iconSrc: naver, text: "네이버 로그인", provider: "naver" },
    { id: "kakao", iconSrc: kakao, text: "카카오 로그인", provider: "kakao" },
    {
      id: "tester",
      iconSrc: tester,
      text: "테스터 로그인",
      provider: "tester",
    },
  ];

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.title}>로그인 방법을 선택해주세요.</h2>
      <ul className={styles.loginBox}>
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
