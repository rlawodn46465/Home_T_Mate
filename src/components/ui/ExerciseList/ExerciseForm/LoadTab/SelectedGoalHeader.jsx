import "../../../Routine/GoalList/GoalItemCard.css";

const SelectedGoalHeader = ({ goal, onClose }) => {
  return (
    <div className="selected-goal-header">
      <div className="goal-card-header">
        <span
          className={`badge ${
            goal.goalType === "루틴" ? "routine" : "challenge"
          }`}
        >
          {goal.goalType === "루틴" ? "루틴" : "챌린지"}
        </span>
        <span className="goal-name">{goal.name}</span>
        <button className="close-button" onClick={onClose}>
          X
        </button>
      </div>
      <div className="goal-info">
        <p>진행도: {goal.currentWeek || 1}주차</p>
        <p>부위: {goal.parts.join(", ")}</p>
        <p>
          빈도: {goal.activeDays.join(", ")} &nbsp;|&nbsp; 제작자:{" "}
          {goal.creator}
        </p>
      </div>
    </div>
  );
};

export default SelectedGoalHeader;
