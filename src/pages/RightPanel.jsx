import { useLocation } from "react-router-dom";
import LoginPage from "./Login/LoginPage";
import OnboardingPage from "./Onboarding/OnboardingPage";
import DashboardPage from "./Dashboard/DashboardPage";
import RoutineListPage from "./Routine/RoutineListPage";
import RoutineDetailPage from "./Routine/RoutineDetailPage";

const RightPanel = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const panelType = searchParams.get("panel") || "login";
  const routineId = searchParams.get("routineId");

  let content;

  switch (panelType) {
    case "login":
      content = <LoginPage />;
      break;
    case "onboarding":
      content = <OnboardingPage />;
      break;
    case "dashboard":
      content = <DashboardPage />;
      break;
    case "routine":
      content = <RoutineListPage />;
      break;
    case "routine-detail":
      content = <RoutineDetailPage routineId={routineId} />;
      break;
    default:
      content = <div>요청하신 페이지를 찾을 수 없습니다.</div>;
      break;
  }

  return <>{content}</>;
};

export default RightPanel;
