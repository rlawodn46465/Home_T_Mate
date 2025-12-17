import { useNavigate } from "react-router-dom";
import styles from "./TodayGoalItem.module.css";

const TodayGoalItem = ({ goal }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!goal?.userGoalId) return;
    navigate(`?panel=goals-detail&goalId=${goal.userGoalId}`);
  };

  return (
    <li
      className={styles.item}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
    >
      {goal.name}
    </li>
  );
};

export default TodayGoalItem;
