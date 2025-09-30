import "./LoginPage.css";
import google from "../../assets/images/google_icon.svg";
import naver from "../../assets/images/naver_icon.svg";
import kakao from "../../assets/images/kakao_icon.svg";
import SocialLoginItem from "../../components/ui/Login/SocialLoginItem";

const API_BASE_URL ='http://localhost:3000';

const Login = () => {

  const handleNaverLogin = () => {
    window.location.href = `${API_BASE_URL}/api/v1/auth/naver`;
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/api/v1/auth/google`;
  };

  const handleKakaoLogin = () => {
    window.location.href = `${API_BASE_URL}/api/v1/auth/kakao`;
  };


  const social = [
    { id: "google", iconSrc: google, text: "Google 로그인", onClick: handleGoogleLogin },
    { id: "naver", iconSrc: naver, text: "네이버 로그인", onClick: handleNaverLogin },
    { id: "kakao", iconSrc: kakao, text: "카카오 로그인", onClick: handleKakaoLogin },
  ];

  return (
    <div className="login-container">
      <h2>로그인 방법을 선택해주세요.</h2>
      <ul className="login-box">
        {social.map((menu) => (
          <SocialLoginItem key={menu.id} {...menu} />
        ))}
      </ul>
    </div>
  );
};

export default Login;
