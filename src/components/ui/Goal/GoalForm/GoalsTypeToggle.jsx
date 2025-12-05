import "./GoalsTypeToggle.css";

const GoalsTypeToggle = ({ goalType, onTypeChange }) => {
  const isGoal = goalType === "goal";

  return (
    <div className="goal-type-toggle">
      <div className={`active-slider ${isGoal ? 'left' : 'right'}`}/>
      <button
        className="toggle-button"
        data-active={isGoal}
        onClick={() => onTypeChange("goal")}
      >
        루틴
      </button>
      <button
        className="toggle-button"
        data-active={!isGoal}
        onClick={() => onTypeChange("challenge")}
      >
        챌린지
      </button>
    </div>
  );
};

export default GoalsTypeToggle;
