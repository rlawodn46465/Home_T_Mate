import "./MainLayout.css";
import CommunityPage from "./Community/CommunityPage";
import RightPanel from "./RightPanel";

const MainLayout = () => {
  return (
    <div className="main-content">
      <div className="left-content">
        <CommunityPage />
      </div>
      <div className="right-content">
        <RightPanel />
      </div>
    </div>
  );
};

export default MainLayout;
