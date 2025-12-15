import "./Header.css";
import list_icon from "../assets/images/list_icon.svg";
import training_icon from "../assets/images/training_icon.svg";
import goal_icon from "../assets/images/goal_icon.svg";
import user_icon from "../assets/images/user_icon.svg";
import { useAuth } from "../hooks/useAuth";
import { usePersistentPanel } from "../hooks/usePersistentPanel";

const Header = () => {
  const { handleLogout } = useAuth();
  const { navigateToPanel, navigateWithPanel } = usePersistentPanel();

  const handleCommunityClick = (e) => {
    e.preventDefault();
    navigateWithPanel("/community");
  };

  return (
    <div className="header-container">
      <h1>홈트메이트</h1>
      <ul className="menu-container">
        <div
          onClick={handleCommunityClick} // 경로 유지, panel 쿼리만 변경
          className="menu-item"
        >
          <img src={list_icon} alt="게시판" />
          <p>게시판</p>
        </div>
        <div onClick={() => navigateToPanel("?panel=record")} className="menu-item">
          <img src={training_icon} alt="운동" />
          <p>운동</p>
        </div>
        <div onClick={() => navigateToPanel("?panel=goal")} className="menu-item">
          <img src={goal_icon} alt="목표" />
          <p>목표</p>
        </div>
        <div onClick={() => navigateToPanel("?panel=mypage")} className="menu-item">
          <img src={user_icon} alt="마이페이지" />
          <p>마이페이지</p>
        </div>
        {/* 테스트코드 */}
        <p onClick={handleLogout}>로그아웃</p>
      </ul>
    </div>
  );
};

export default Header;
