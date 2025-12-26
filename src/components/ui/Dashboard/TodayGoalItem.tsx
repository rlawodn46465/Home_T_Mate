import type { KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TodayGoalItem.module.css";
import type { TodayGoal } from "../../../types/goal";

interface TodayGoalItemProps {
  goal: TodayGoal;
}

const TodayGoalItem = ({ goal }: TodayGoalItemProps) => {
  const navigate = useNavigate();

  const handleClick = (): void => {
    if (!goal?.userGoalId) return;
    navigate(`?panel=goals-detail&goalId=${goal.userGoalId}`);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLLIElement>): void => {
    if (e.key === "Enter") {
      handleClick();
    }
  };

  return (
    <li
      className={styles.item}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {goal.name}
    </li>
  );
};

export default TodayGoalItem;
