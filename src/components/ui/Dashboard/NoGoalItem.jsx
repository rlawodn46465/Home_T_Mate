import { memo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TodayGoalItem.module.css";

const NoGoalItem = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("?panel=goals-form");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <li
      className={styles.noGoal}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="목표 생성하기 페이지로 이동"
    >
      목표를 생성해주세요 ✨
    </li>
  );
};

export default memo(NoGoalItem);
