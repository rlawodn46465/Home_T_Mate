import { Link } from "react-router-dom";
import "./Header.css";
import list_icon from "../assets/images/list_icon.svg";
import training_icon from "../assets/images/training_icon.svg";
import goal_icon from "../assets/images/goal_icon.svg";
import user_icon from "../assets/images/user_icon.svg";
import { useAuth } from "../hooks/useAuth";

const Header = () => {
  {/* 테스트코드 */}
  const { handleLogout } = useAuth();
  const getPanelLink = (panelName) => {
    return `/?panel=${panelName}`;
  };

  return (
    <div className="header-container">
      <h1>홈트메이트</h1>
      <ul className="menu-container">
        <Link to="/" className="menu-item">
          <img src={list_icon} alt="게시판" />
          <p>게시판</p>
        </Link>
        <Link to={getPanelLink("record")} className="menu-item">
          <img src={training_icon} alt="운동" />
          <p>운동</p>
        </Link>
        <Link to={getPanelLink("goal")} className="menu-item">
          <img src={goal_icon} alt="목표" />
          <p>목표</p>
        </Link>
        <Link to={getPanelLink("mypage")} className="menu-item">
          <img src={user_icon} alt="마이페이지" />
          <p>마이페이지</p>
        </Link>
        {/* 테스트코드 */}
        <p onClick={handleLogout}>로그아웃</p> 
      </ul>
    </div>
  );
};

export default Header;
