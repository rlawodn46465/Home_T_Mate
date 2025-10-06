import "./TodayRoutine.css";
import TodayRoutineItem from "./TodayRoutineItem";

const TodayRoutine = () => {
  return (
    <div className="today-routine">
      <h4 className="section-title">오늘 운동</h4>
      <ul className="today-routine-container">
        <TodayRoutineItem text={"+ 루틴 만들기"} />
      </ul>
      <p className="today-routine-title">루틴을 설정해주세요.</p>
    </div>
  );
};

export default TodayRoutine;