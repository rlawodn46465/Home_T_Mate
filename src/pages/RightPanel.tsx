import { useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import LoginPage from "./Login/LoginPage";
import OnboardingPage from "./Onboarding/OnboardingPage";
import DashboardPage from "./Dashboard/DashboardPage";
import GoalsListPage from "./Goal/GoalsListPage";
import GoalsFormPage from "./Goal/GoalsFormPage";
import GoalsDetailPage from "./Goal/GoalsDetailPage";
import ExerciseListPage from "./Exercise/ExerciseListPage";
import ExerciseDetail from "./Exercise/ExerciseDetail";
import ExerciseFormPage from "./Exercise/ExerciseFormPage";

const RightPanel = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const panelType = searchParams.get("panel") || "login";
  const goalId = searchParams.get("goalId");
  const exerciseId = searchParams.get("exerciseId");
  const recordId = searchParams.get("recordId");

  let content: ReactNode;

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
    case "goal":
      content = <GoalsListPage />;
      break;
    case "record":
      content = <ExerciseListPage />;
      break;
    case "record-detail":
      content = exerciseId ? (
        <ExerciseDetail exerciseId={exerciseId} />
      ) : (
        <div>운동 ID가 없습니다.</div>
      );
      break;
    case "goals-detail":
      content = <GoalsDetailPage goalId={goalId} />;
      break;
    case "goals-form":
      content = <GoalsFormPage goalId={goalId} />;
      break;
    case "exercise-detail":
      content = exerciseId ? (
        <ExerciseDetail exerciseId={exerciseId} />
      ) : (
        <div>잘못된 접근입니다.</div>
      );
      break;
    case "exercise-form":
      content = <ExerciseFormPage />;
      break;
    case "exercise-edit":
      content = <ExerciseFormPage recordId={recordId || ""} />;
      break;
    default:
      content = <div>요청하신 페이지를 찾을 수 없습니다.</div>;
      break;
  }

  return <>{content}</>;
};

export default RightPanel;
