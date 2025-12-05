import "./TodayGoal.css";
import TodayGoalItem from "./TodayGoalItem";

const TodayGoal = () => {
  return (
    <div className="today-goal">
      <h4 className="section-title">오늘 운동</h4>
      <ul className="today-goal-container">
        <TodayGoalItem text={"+ 목표 만들기"} />
      </ul>
      <p className="today-goal-title">목표를 설정해주세요.</p>
    </div>
  );
};

export default TodayGoal;