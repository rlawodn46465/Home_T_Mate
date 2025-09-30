import "./LoginPage.css";
import google from "../../assets/images/google_icon.svg";
import naver from "../../assets/images/naver_icon.svg";
import kakao from "../../assets/images/kakao_icon.svg";
import SocialLoginItem from "../../components/ui/Login/SocialLoginItem";

const Login = () => {
  const social = [
    { id: "google", iconSrc: google, text: "Google 로그인", onClick: () => {} },
    { id: "naver", iconSrc: naver, text: "네이버 로그인", onClick: () => {} },
    { id: "kakao", iconSrc: kakao, text: "카카오 로그인", onClick: () => {} },
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
