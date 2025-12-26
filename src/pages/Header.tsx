import list_icon from "../assets/images/list_icon.svg";
import training_icon from "../assets/images/training_icon.svg";
import goal_icon from "../assets/images/goal_icon.svg";
import user_icon from "../assets/images/user_icon.svg";
import { useAuth } from "../hooks/useAuth";
import { usePersistentPanel } from "../hooks/usePersistentPanel";
import styles from "./Header.module.css";

const Header = () => {
  const { handleLogout } = useAuth();
  const { navigateToPanel, navigateWithPanel } = usePersistentPanel();

  const handleCommunityClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    navigateWithPanel("/community");
  };

  return (
    <div className={styles.headerContainer}>
      <h1 className={styles.logo}>홈트메이트</h1>
      <ul className={styles.menuContainer}>
        <li onClick={handleCommunityClick} className={styles.menuItem}>
          <img src={list_icon} alt="게시판" className={styles.menuIcon} />
          <p>게시판</p>
        </li>
        <li
          onClick={() => navigateToPanel("?panel=record")}
          className={styles.menuItem}
        >
          <img src={training_icon} alt="운동" className={styles.menuIcon} />
          <p>운동</p>
        </li>
        <li
          onClick={() => navigateToPanel("?panel=goal")}
          className={styles.menuItem}
        >
          <img src={goal_icon} alt="목표" className={styles.menuIcon} />
          <p>목표</p>
        </li>
        <li
          onClick={() => navigateToPanel("?panel=mypage")}
          className={styles.menuItem}
        >
          <img src={user_icon} alt="마이페이지" className={styles.menuIcon} />
          <p>마이페이지</p>
        </li>
        <li
          onClick={handleLogout}
          className={`${styles.menuItem} ${styles.logoutBtn}`}
        >
          <p>로그아웃</p>
        </li>
      </ul>
    </div>
  );
};

export default Header;
