import { useState } from "react";
import RoutineNameInput from "./RoutineNameInput";
import RoutineTypeToggle from "./RoutineTypeToggle";
import "./RoutineInfoSection.css";

const RoutineInfoSection = ({ info, onInfoChange }) => {
  // 더미
  const [formState, setFormState] = useState({
    name: "팔굽혀펴기 100일 챌린지",
    routineType: "challenge",
    goalWeeks: 4,
  });

  const { name, routineType, goalWeeks } = info;

  const isChallenge = routineType === "challenge";

  return (
    <div className="routine-info-section">
      <div className="routine-info-section__name-input">
        <RoutineNameInput
          initialName={name}
          onNameChange={(newName) => onInfoChange("name", newName)}
        />
      </div>

      <div className="routine-info-section__toggle">
        <RoutineTypeToggle
          routineType={routineType}
          onTypeChange={(newType) => onInfoChange("routineType", newType)}
        />

        {isChallenge && (
          <div className="routine-info-section__goal-weeks">
            <label htmlFor="goal-weeks" className="goal-week-label">
              목표 주차 :{" "}
            </label>
            <input
              id="goal-weeks"
              type="text"
              inputMode="numeric"
              min="1"
              max="52"
              value={goalWeeks}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/[^0-9]/g, "");
                const numValue = parseInt(rawValue, 10);
                let finalValue;
                if (rawValue === "") {
                  finalValue = "";
                } else if (isNaN(numValue)) {
                  finalValue = 1;
                } else {
                  finalValue = Math.min(Math.max(numValue, 1), 52);
                }
                onInfoChange("goalWeeks", finalValue);
              }}
              className="goal-week-input"
            />
            <span className="goal-week-unit">차</span>?
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutineInfoSection;
