import type { ChangeEvent } from "react";
import type { GoalType } from "../../../../types/goal";
import GoalsNameInput from "./GoalsNameInput";
import GoalsTypeToggle from "./GoalsTypeToggle";
import styles from "./GoalsInfoSection.module.css";

interface GoalInfo {
  name: string;
  goalType: GoalType;
  goalWeeks: number;
}

interface GoalsInfoSectionProps {
  info: GoalInfo;
  onInfoChange: <K extends keyof GoalInfo>(
    field: K,
    value: GoalInfo[K]
  ) => void;
}

const GoalsInfoSection = ({ info, onInfoChange }: GoalsInfoSectionProps) => {
  const { name, goalType, goalWeeks } = info;
  const isChallenge = goalType === "CHALLENGE";

  const handleWeeksChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");

    if (rawValue === "") {
      onInfoChange("goalWeeks", 1 as any);
      return;
    }

    const numValue = parseInt(rawValue, 10);
    let finalValue: number;

    if (isNaN(numValue)) {
      finalValue = 1;
    } else {
      // 1주에서 52주 사이로 제한
      finalValue = Math.min(Math.max(numValue, 1), 52);
    }

    onInfoChange("goalWeeks", finalValue);
  };

  return (
    <div className={styles.goalInfoSection}>
      <div className={styles.nameInputWrapper}>
        <GoalsNameInput
          initialName={name}
          onNameChange={(newName) => onInfoChange("name", newName)}
        />
      </div>

      <div className={styles.toggleContainer}>
        <GoalsTypeToggle
          goalType={goalType}
          onTypeChange={(newType) => onInfoChange("goalType", newType)}
        />

        {isChallenge && (
          <div className={styles.goalWeeksWrapper}>
            <label htmlFor="goal-weeks" className={styles.goalWeekLabel}>
              목표 주차 {" "}
            </label>
            <input
              id="goal-weeks"
              type="text"
              inputMode="numeric"
              value={goalWeeks === 0 ? "" : goalWeeks.toString()}
              onChange={handleWeeksChange}
              className={styles.goalWeekInput}
              placeholder="1"
            />
            <span className={styles.goalWeekUnit}>차</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalsInfoSection;
