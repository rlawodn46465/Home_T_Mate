import MuscleMap from "../../../common/MuscleMap";
import "./GoalsSummary.css";
import WeekDaySelector from "./WeekDaySelector";

const GoalsSummary = ({ goalDetail, allGoalDays }) => {
  
  const progressPercent = (goalDetail.progress * 100).toFixed(0);

  return (
    <div className="goal-summary">
      <div className="body-part-display">
        <MuscleMap selectedTags={goalDetail.parts} />
      </div>
      <div className="summary-text">
        <div className="summary-text__item">
          진행도 : {goalDetail.currentWeek}주차
        </div>
        <div className="summary-text__item">
          부위 : {goalDetail.parts.join(", ")}
        </div>
        <div className="summary-text__item week">
          요일 : <WeekDaySelector selectedDays={allGoalDays} />
        </div>
        {goalDetail.type === "챌린지" && (
          <div>
            <div className="summary-text__item">
              <p>진행도 : </p>
              <div className="goal-summary__progress-bar-wrapper">
                <div
                  className="goal-summary__progress-bar"
                  style={{ width: `${progressPercent}%` }}
                ></div>
                <span className="goal-summary__progress-label">
                  {progressPercent}%
                </span>
              </div>
            </div>
            <div className="summary-text__item">
              목표주차 : {goalDetail.targetWeek}주차
            </div>
          </div>
        )}
        {/* 모든 운동의 요일을 통합해서 보여주거나, 대표 요일을 보여주도록 수정 필요. */}
      </div>
    </div>
  );
};

export default GoalsSummary;
