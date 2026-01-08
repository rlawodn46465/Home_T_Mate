// Header.tsx
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
    <header className={styles.header}>
      <h1 className={styles.logo}>홈트메이트</h1>

      <nav className={styles.nav}>
        <button onClick={handleCommunityClick} className={styles.navItem}>
          <img src={list_icon} alt="" />
          <span>게시판</span>
        </button>

        <button
          onClick={() => navigateToPanel("?panel=record")}
          className={styles.navItem}
        >
          <img src={training_icon} alt="" />
          <span>운동</span>
        </button>

        <button
          onClick={() => navigateToPanel("?panel=goal")}
          className={styles.navItem}
        >
          <img src={goal_icon} alt="" />
          <span>목표</span>
        </button>

        <button
          onClick={() => navigateToPanel("?panel=mypage")}
          className={styles.navItem}
        >
          <img src={user_icon} alt="" />
          <span>마이페이지</span>
        </button>

        <button
          onClick={handleLogout}
          className={`${styles.navItem} ${styles.logout}`}
        >
          <span>로그아웃</span>
        </button>
      </nav>
    </header>
  );
};

export default Header;
