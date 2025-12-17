import { Route, Routes } from "react-router-dom";
import CommunityPage from "./Community/CommunityPage";
import PostCreatePage from "./Community/PostCreatePage";
import PostDetailPage from "./Community/PostDetailPage";
import RightPanel from "./RightPanel";
import styles from "./MainLayout.module.css";

const MainLayout = () => {
  return (
    <div className={styles.mainContent}>
      <div className={styles.leftContent}>
        <Routes>
          <Route path="/" element={<CommunityPage />} />
          <Route path="/write" element={<PostCreatePage />} />
          <Route path="/edit/:postId" element={<PostCreatePage />} />
          <Route path="/:postId" element={<PostDetailPage />} />
        </Routes>
      </div>
      <div className={styles.rightContent}>
        <RightPanel />
      </div>
    </div>
  );
};

export default MainLayout;