import "./RoutineTypeToggle.css";

const RoutineTypeToggle = ({ routineType, onTypeChange }) => {
  const isRoutine = routineType === "routine";

  return (
    <div className="routine-type-toggle">
      <div className={`active-slider ${isRoutine ? 'left' : 'right'}`}/>
      <button
        className="toggle-button"
        data-active={isRoutine}
        onClick={() => onTypeChange("routine")}
      >
        루틴
      </button>
      <button
        className="toggle-button"
        data-active={!isRoutine}
        onClick={() => onTypeChange("challenge")}
      >
        챌린지
      </button>
    </div>
  );
};

export default RoutineTypeToggle;
