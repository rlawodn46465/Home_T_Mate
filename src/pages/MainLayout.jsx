import { Route, Routes } from "react-router-dom";
import CommunityPage from "./Community/CommunityPage";
import PostCreatePage from "./Community/PostCreatePage";
import RightPanel from "./RightPanel";
import "./MainLayout.css";

const MainLayout = () => {
  return (
    <div className="main-content">
      <div className="left-content">
        <Routes>
          <Route path="/" element={<CommunityPage />} />
          <Route path="/write" element={<PostCreatePage />} />
        </Routes>
      </div>
      <div className="right-content">
        <RightPanel />
      </div>
    </div>
  );
};

export default MainLayout;
