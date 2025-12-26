import styles from "./GoalsTypeToggle.module.css";
import type { GoalType } from "../../../../types/goal";

interface GoalsTypeToggleProps {
  goalType: GoalType;
  onTypeChange: (type: GoalType) => void;
}

const GoalsTypeToggle = ({ goalType, onTypeChange }: GoalsTypeToggleProps) => {
  const isGoal = goalType === "ROUTINE";

  return (
    <div className={styles.goalTypeToggle}>
      <div
        className={`${styles.activeSlider} ${
          !isGoal ? styles.activeSliderRight : ""
        }`}
      />
      <button
        className={styles.toggleButton}
        data-active={isGoal}
        onClick={() => onTypeChange("ROUTINE")}
      >
        루틴
      </button>
      <button
        className={styles.toggleButton}
        data-active={!isGoal}
        onClick={() => onTypeChange("CHALLENGE")}
      >
        챌린지
      </button>
    </div>
  );
};

export default GoalsTypeToggle;
