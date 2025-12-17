import styles from "./GoalsTypeToggle.module.css";

const GoalsTypeToggle = ({ goalType, onTypeChange }) => {
  const isGoal = goalType === "routine";

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
        onClick={() => onTypeChange("routine")}
      >
        루틴
      </button>
      <button
        className={styles.toggleButton}
        data-active={!isGoal}
        onClick={() => onTypeChange("challenge")}
      >
        챌린지
      </button>
    </div>
  );
};

export default GoalsTypeToggle;
