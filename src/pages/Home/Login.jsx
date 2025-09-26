import "./Login.css";
import google from "../../assets/images/google_icon.svg";
import naver from "../../assets/images/naver_icon.svg";
import kakao from "../../assets/images/kakao_icon.svg";

const Login = () => {
  return (
    <div className="login-container">
      <h2>로그인 방법을 선택해주세요.</h2>
      <ul className="login-box">
        <li className="login-item">
          <img src={google} /> <p>Google 로그인</p>
        </li>
        <li className="login-item">
          <img src={naver} /> <p>네이버 로그인</p>
        </li>
        <li className="login-item">
          <img src={kakao} /> <p>카카오 로그인</p>
        </li>
      </ul>
    </div>
  );
}

export default Login;
