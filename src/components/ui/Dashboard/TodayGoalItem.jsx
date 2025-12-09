import { useNavigate } from "react-router-dom";
import "./TodayGoalItem.css";

const TodayGoalItem = ({ goal }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`?panel=goals-detail&goalId=${goal.userGoalId}`);
  };

  return (
    <li className="today-goal-item" onClick={handleClick}>
      {goal.name}
    </li>
  );
};

export default TodayGoalItem;
