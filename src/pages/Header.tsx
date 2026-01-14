// Header.tsx
import { useLocation } from "react-router-dom";
import list_icon from "../assets/images/list_icon.svg";
import training_icon from "../assets/images/training_icon.svg";
import goal_icon from "../assets/images/goal_icon.svg";
import user_icon from "../assets/images/user_icon.svg";
import dashboard_icon from "../assets/images/dashboard_icon.svg";
import { useAuth } from "../hooks/useAuth";
import { usePersistentPanel } from "../hooks/usePersistentPanel";
import styles from "./Header.module.css";

const Header = () => {
  const { user, handleLogout } = useAuth();
  const { navigateToPanel } = usePersistentPanel();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const currentPanel = searchParams.get("panel");

  const isViewingCommunity = !currentPanel || currentPanel === "community";

  const handleMobileToggle = () => {
    if (isViewingCommunity) {
      navigateToPanel("?panel=dashboard");
    } else {
      navigateToPanel("?panel=community");
    }
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>홈트메이트</h1>

      <nav className={styles.nav}>
        <button
          onClick={handleMobileToggle}
          className={`${styles.navItem} ${styles.mobileOnly}`}
        >
          <img src={isViewingCommunity ? dashboard_icon : list_icon} alt="" />
          <span>{isViewingCommunity ? "대시보드" : "게시판"}</span>
        </button>

        {user && (
          <>
            <button
              onClick={() => navigateToPanel("?panel=dashboard")}
              className={`${styles.navItem} ${styles.desktopOnly}`}
            >
              <img src={dashboard_icon} alt="" />
              <span>대시보드</span>
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
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
