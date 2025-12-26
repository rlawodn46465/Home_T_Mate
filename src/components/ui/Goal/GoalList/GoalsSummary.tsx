import MuscleMap from "../../../common/MuscleMap";
import styles from "./GoalsSummary.module.css";
import WeekDaySelector from "./WeekDaySelector";

interface GoalDetail {
  progress: number;
  parts: string[];
  currentWeek: number;
  targetWeek?: number;
  type: "루틴" | "챌린지" | string;
}

interface GoalsSummaryProps {
  goalDetail: GoalDetail;
  allGoalDays: string[];
}

const GoalsSummary = ({ goalDetail, allGoalDays }: GoalsSummaryProps) => {
  const progressPercent = (goalDetail.progress * 100).toFixed(0);

  return (
    <div className={styles.goalSummary}>
      <div className={styles.bodyPartDisplay}>
        <MuscleMap selectedTags={goalDetail.parts} />
      </div>
      <div className={styles.summaryText}>
        <div className={styles.summaryTextItem}>
          진행도 : {goalDetail.currentWeek}주차
        </div>
        <div className={styles.summaryTextItem}>
          부위 : {goalDetail.parts.join(", ")}
        </div>
        <div className={`${styles.summaryTextItem} ${styles.week}`}>
          요일 : <WeekDaySelector selectedDays={allGoalDays} />
        </div>
        {goalDetail.type === "챌린지" && (
          <div>
            <div className={styles.summaryTextItem}>
              <p>진행도 : </p>
              <div className={styles.progressBarWrapper}>
                <div
                  className={styles.progressBar}
                  style={{ width: `${progressPercent}%` }}
                ></div>
                <span className={styles.progressLabel}>{progressPercent}%</span>
              </div>
            </div>
            <div className={styles.summaryTextItem}>
              목표주차 : {goalDetail.targetWeek}주차
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalsSummary;
