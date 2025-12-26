import styles from "./SelectedGoalHeader.module.css";

interface SelectedGoalHeaderProps {
  goal: {
    goalType?: string;
    type?: string;
    name?: string;
    title?: string;
    currentWeek?: number;
    parts?: string[];
    activeDays?: string[];
    creator?: string;
  } | null;
  onClose: () => void;
}

const SelectedGoalHeader = ({ goal, onClose }: SelectedGoalHeaderProps) => {
  if (!goal) return null;

  const isRoutine = goal.goalType === "루틴" || goal.type === "루틴";

  return (
    <div className={styles.header}>
      <div className={styles.topRow}>
        <span
          className={`${styles.badge} ${
            isRoutine ? styles.routineBadge : styles.challengeBadge
          }`}
        >
          {isRoutine ? "루틴" : "챌린지"}
        </span>
        <h3 className={styles.title}>{goal.name || goal.title}</h3>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="닫기"
        >
          ✕
        </button>
      </div>

      <div className={styles.infoContent}>
        <p className={styles.infoText}>
          진행도:{" "}
          <span className={styles.accent}>{goal.currentWeek || 1}주차</span>
        </p>
        <p className={styles.infoText}>
          부위: {goal.parts?.join(", ") || "전신"}
        </p>
        <p className={styles.infoText}>
          빈도: {goal.activeDays?.join(", ")} | 제작자:{" "}
          {goal.creator || "시스템"}
        </p>
      </div>
    </div>
  );
};

export default SelectedGoalHeader;
