import "./Header.css";
import list_icon from "../assets/images/list_icon.svg";
import training_icon from "../assets/images/training_icon.svg";
import routine_icon from "../assets/images/routine_icon.svg";
import user_icon from "../assets/images/user_icon.svg";

const Header = () => {
  return (
    <div className="header-container">
      <h1>홈트메이트</h1>
      <ul className="menu-container">
        <li className="menu-item">
          <img src={list_icon} />
          <p>게시판</p>
        </li>
        <li className="menu-item">
          <img src={training_icon} />
          <p>운동</p>
        </li>
        <li className="menu-item">
          <img src={routine_icon} />
          <p>루틴</p>
        </li>
        <li className="menu-item">
          <img src={user_icon} />
          <p>마이페이지</p>
        </li>
      </ul>
    </div>
  );
}

export default Header;
