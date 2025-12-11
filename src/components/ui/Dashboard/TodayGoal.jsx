import { useTodayGoals } from "../../../hooks/useGoals";
import Spinner from "../../common/Spinner";
import ErrorMessage from "../../common/ErrorMessage";
import TodayGoalSlider from "./TodayGoalSlider";
import "./TodayGoal.css";

const TodayGoal = () => {
  const { goals, isLoading, error, loadTodayGoals } = useTodayGoals();

  if (isLoading) {
    return <Spinner text={"불러오는 중..."} />;
  }

  if (error) {
    return (
      <ErrorMessage
        message="목표를 불러오지 못했습니다."
        onRetry={loadTodayGoals}
      />
    );
  }

  if (!goals || goals.length === 0) {
    return <p className="today-goal-title">목표를 설정해주세요.</p>;
  }

  return (
    <div className="today-goal">
      <h4 className="section-title">오늘 운동</h4>
      <TodayGoalSlider goals={goals} />
    </div>
  );
};

export default TodayGoal;
