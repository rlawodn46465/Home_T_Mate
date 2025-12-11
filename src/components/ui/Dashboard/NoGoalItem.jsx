import { useNavigate } from "react-router-dom";
import "./TodayGoalItem.css";

const NoGoalItem = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("?panel=goals-form");
  };

  return (
    <li
      className="today-goal-item today-goal-item--no-goal"
      onClick={handleClick}
      role="button"
      aria-label="목표 생성하기"
    >
      목표를 생성해주세요 ✨
    </li>
  );
};

export default NoGoalItem;
