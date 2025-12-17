import { useRef, useState } from "react";
import ToggleComponents from "./ToggleComponents";
import MuscleMap from "./MuscleMap";

import "./DailyExerciseItem.css";

const daysOfWeek = ["월", "화", "수", "목", "금", "토", "일"];

const DailyExerciseItem = ({
  exercise,
  onRemove,
  onExerciseUpdate,
  onSetUpdate,
  onAddSet,
  onRemoveSet,
  isDaySelector = true,
  isReadOnly = false,
  isDurationVisible = true,
}) => {
  const { id, name, sets, restTime, days, targetMuscles, duration } = exercise;
  const [isExpanded, setIsExpanded] = useState(true);
  const containerRef = useRef(null);

  // 세트 간 휴식 시간 업데이트
  const handleRestTimeChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 허용
    const numValue = parseInt(rawValue, 10);
    if (rawValue === "" || !isNaN(numValue)) {
      onExerciseUpdate(id, "restTime", rawValue === "" ? 0 : numValue);
    }
  };

  // 운동 시간 업데이트 핸들러
  const handleDurationChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 허용
    const numValue = parseInt(rawValue, 10);
    if (rawValue === "" || !isNaN(numValue)) {
      onExerciseUpdate(id, "duration", rawValue === "" ? 0 : numValue);
    }
  };

  // 요일 토글
  const toggleDay = (day) => {
    const newDays = days.includes(day)
      ? days.filter((d) => d !== day) // 제거
      : [...days, day]; // 추가
    onExerciseUpdate(id, "days", newDays);
  };

  // 세트 추가
  const handleAddSet = () => onAddSet(id);

  // 세트 제거
  const handleRemoveSet = (setId) => onRemoveSet(id, setId);

  // 무게/횟수 변경 핸들러
  const handleSetFieldChange = (setId, field, e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    const numValue = parseInt(rawValue, 10);

    if (rawValue === "" || !isNaN(numValue)) {
      onSetUpdate(id, setId, field, rawValue === "" ? 0 : numValue);
    }
  };

  const renderDaySelectionGroup = () => (
    <div className="day-selection-group">
      <span className="day-label">요일</span>
      <div className="day-buttons">
        {daysOfWeek.map((day) => (
          <button
            key={day}
            className={`day-button ${days.includes(day) ? "active" : ""}`}
            onClick={() => toggleDay(day)}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div
      className={`exercise-item-card ${isReadOnly ? "readonly" : ""}`}
      ref={containerRef}
    >
      <div className="item-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="item-header-left">
          <ToggleComponents isUp={isExpanded} />
          <h3 className="exercise-title">
            {name}
            <span className="set-count">{sets.length}세트</span>
            {!isReadOnly && duration && isDurationVisible > 0 && (
              <span className="duration-preview"> · {duration}분</span>
            )}
          </h3>
        </div>
        {!isReadOnly && (
          <div className="remove-button-wrapper">
            <button
              className="remove-exercise-button"
              onClick={(e) => {
                e.stopPropagation();
                if (typeof onRemove === "function") onRemove(id);
              }}
            >
              &times;
            </button>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="item-details">
          {isDaySelector && renderDaySelectionGroup()}
          <div className="item-info-container">
            <div
              className="time-settings-row"
              style={{ display: "flex", gap: "15px", marginBottom: "10px" }}
            >
              <div className="rest-time-group">
                <span className="rest-time-label">휴식(세트간)</span>
                <input
                  type="text"
                  readOnly={isReadOnly}
                  className="item-input"
                  value={restTime}
                  onChange={!isReadOnly ? handleRestTimeChange : undefined}
                />
                <span className="rest-time-unit">초</span>
              </div>
              {!isReadOnly && isDurationVisible && (
                <div className="duration-group">
                  <span className="rest-time-label">운동 시간</span>
                  <input
                    type="text"
                    className="item-input"
                    value={duration || 0}
                    onChange={handleDurationChange}
                  />
                  <span className="rest-time-unit">분</span>
                </div>
              )}
            </div>
            <div className="item-info-box">
              <MuscleMap selectedTags={targetMuscles?.join(", ")} />
              <div className="item-info-sets">
                <div className="set-list">
                  {sets.map((set, setIndex) => (
                    <div key={set.id} className="set-row">
                      <span className="set-number">{setIndex + 1}</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        className="item-input"
                        value={set.weight}
                        onChange={(e) =>
                          handleSetFieldChange(set.id, "weight", e)
                        }
                      />
                      <span className="unit-label">kg</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        className="item-input"
                        value={set.reps}
                        onChange={(e) =>
                          handleSetFieldChange(set.id, "reps", e)
                        }
                      />
                      <span className="unit-label">회</span>
                      {!isReadOnly && sets.length > 1 && (
                        <button
                          className="remove-set-button"
                          onClick={() => handleRemoveSet(set.id)}
                        >
                          제거
                        </button>
                      )}
                    </div>
                  ))}
                  {!isReadOnly && (
                    <button className="add-set-button" onClick={handleAddSet}>
                      + 세트 추가
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyExerciseItem;
