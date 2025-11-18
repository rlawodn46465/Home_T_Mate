import MuscleMap from "../../common/MuscleMap";
import "./RoutineSummary.css";
import WeekDaySelector from "./WeekDaySelector";

const RoutineSummary = ({ routineDetail, allRoutineDays }) => {
  
  const progressPercent = (routineDetail.progress * 100).toFixed(0);

  return (
    <div className="routine-summary">
      <div className="body-part-display">
        <MuscleMap selectedTags={routineDetail.parts} />
      </div>
      <div className="summary-text">
        <div className="summary-text__item">
          진행도 : {routineDetail.currentWeek}주차
        </div>
        <div className="summary-text__item">
          부위 : {routineDetail.parts.join(", ")}
        </div>
        <div className="summary-text__item week">
          요일 : <WeekDaySelector selectedDays={allRoutineDays} />
        </div>
        {routineDetail.type === "챌린지" && (
          <div>
            <div className="summary-text__item">
              <p>진행도 : </p>
              <div className="routine-summary__progress-bar-wrapper">
                <div
                  className="routine-summary__progress-bar"
                  style={{ width: `${progressPercent}%` }}
                ></div>
                <span className="routine-summary__progress-label">
                  {progressPercent}%
                </span>
              </div>
            </div>
            <div className="summary-text__item">
              목표주차 : {routineDetail.targetWeek}주차
            </div>
          </div>
        )}
        {/* 모든 운동의 요일을 통합해서 보여주거나, 대표 요일을 보여주도록 수정 필요. */}
      </div>
    </div>
  );
};

export default RoutineSummary;
