import { useState } from "react";
import ToggleComponents from "../../../../common/ToggleComponents";
import MuscleMap from "../../../../common/MuscleMap";

const DailyExerciseItem = ({
  exercise,
  onExerciseUpdate,
  onSetUpdate,
  onAddSet,
  onRemoveSet,
}) => {
  const { name, sets, restTime, targetMuscles, id } = exercise;
  const [isExpanded, setIsExpanded] = useState(true);
  // 세트 추가
  const handleAddSet = () => {
    onAddSet(id);
  };

  // 세트 제거
  const handleRemoveSet = (setId) => {
    onRemoveSet(id, setId);
  };

  // 무게/횟수 변경 핸들러
  const handleSetFieldChange = (setId, field, e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    const numValue = parseInt(rawValue, 10);
    if (rawValue === "" || !isNaN(numValue)) {
      onSetUpdate(id, setId, field, rawValue === "" ? 0 : numValue);
    }
  };

  // 세트간 휴식 시간 업데이트 핸들러
  const handleRestTimeChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, ""); // 숫자 외 제거
    const numValue = parseInt(rawValue, 10);
    if (rawValue === "" || !isNaN(numValue)) {
      // onExerciseUpdate는 부모 컴포넌트로부터 받아야 함
      onExerciseUpdate(id, "restTime", rawValue === "" ? 0 : numValue);
    }
  };

  return (
    <div className="exercise-item-card">
      <div className="item-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="item-header-left">
          <ToggleComponents isUp={isExpanded} />
          <h3 className="exercise-title">
            {name}
            <span className="set-count">{sets.length}세트</span>
          </h3>
        </div>
      </div>

      {isExpanded && (
        <div className="item-details">
          <div className="item-info-container">
            {targetMuscles && (
              <MuscleMap selectedTags={targetMuscles?.join(", ")} />
            )}
            <div className="item-info-sets">
              <div className="rest-time-group">
                <span className="rest-time-label">세트간 휴식 시간:</span>
                <input
                  type="text"
                  inputMode="numeric"
                  className="item-input"
                  value={restTime}
                  onChange={handleRestTimeChange}
                />
                <span className="rest-time-unit">초</span>
              </div>

              <div className="set-list">
                {sets.map((set, setIndex) => (
                  <div key={set.id || setIndex} className="set-row">
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
                      onChange={(e) => handleSetFieldChange(set.id, "reps", e)}
                    />
                    <span className="unit-label">회</span>
                    {sets.length > 1 && (
                      <button
                        className="remove-set-button"
                        onClick={() => handleRemoveSet(set.id)}
                      >
                        제거
                      </button>
                    )}
                  </div>
                ))}
                <button className="add-set-button" onClick={handleAddSet}>
                  + 세트 추가
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyExerciseItem;
