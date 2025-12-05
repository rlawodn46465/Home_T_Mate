import GoalsNameInput from "./GoalsNameInput";
import GoalsTypeToggle from "./GoalsTypeToggle";
import "./GoalsInfoSection.css";

const GoalsInfoSection = ({ info, onInfoChange }) => {

  const { name, goalType, goalWeeks } = info;

  const isChallenge = goalType === "challenge";

  return (
    <div className="goal-info-section">
      <div className="goal-info-section__name-input">
        <GoalsNameInput
          initialName={name}
          onNameChange={(newName) => onInfoChange("name", newName)}
        />
      </div>

      <div className="goal-info-section__toggle">
        <GoalsTypeToggle
          goalType={goalType}
          onTypeChange={(newType) => onInfoChange("goalType", newType)}
        />

        {isChallenge && (
          <div className="goal-info-section__goal-weeks">
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
            <span className="goal-week-unit">차</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalsInfoSection;
