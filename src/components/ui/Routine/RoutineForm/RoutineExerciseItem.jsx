import { useEffect, useRef, useState } from "react";
import ToggleComponents from "../../../common/ToggleComponents";
import "./RoutineExerciseItem.css";
import DotsMenuToggle from "../../../common/DotsMenuToggle";
import DropdownMenu from "../../../common/DropdownMenu";
import MuscleMap from "../../../common/MuscleMap";

const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

const RoutineExerciseItem = ({ exercise, onRemove }) => {
  const { id, name, sets, restTime, days, musclePart } = exercise;
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    console.log(exercise);
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 세트 간 휴식 시간 업데이트
  const handleRestTimeChange = (e) => {
    console.log(`휴식 시간 변경: ${e.target.value}초`);
  };

  const handleToggle = (e) => {
    if (e) {
      e.stopPropagation();
    }
    setIsMenuOpen((prev) => !prev);
  };

  const handleMenuItemClick = (action) => {
    console.log(`${action} 버튼이 클릭되었습니다.`);
    setIsMenuOpen(false);
  };

  // 요일 토글
  const toggleDay = (day) => {
    console.log(`요일 토글: ${day}`);
  };

  // 세트 추가
  const handleAddSet = () => {
    console.log("세트 추가");
  };

  // 세트 제거
  const handleRemoveSet = (setId) => {
    console.log(`세트 제거: ${setId}`);
  };

  return (
    <div className="exercise-item-card" ref={containerRef}>
      <div className="item-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="item-header-left">
          <ToggleComponents isUp={isExpanded} />
          <h3 className="exercise-title">
            {name}
            <span className="set-count">{sets.length}세트</span>
          </h3>
        </div>
        <div className="dots-menu-wrapper">
          <DotsMenuToggle onClick={handleToggle} isActive={isMenuOpen} />
          {isMenuOpen && (
            <DropdownMenu position="right">
              <div onClick={() => handleMenuItemClick("시작")}>시작</div>
              <div onClick={() => handleMenuItemClick("수정")}>수정</div>
              <div onClick={() => handleMenuItemClick("삭제")}>삭제</div>
            </DropdownMenu>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="item-details">
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
          <div className="item-info-container">
            <MuscleMap selectedTags={exercise.musclePart}/>
            <div className="item-info-sets">
              <div className="rest-time-group">
                <span className="rest-time-label">세트간 휴식 시간</span>
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
                  <div key={set.id} className="set-row">
                    <span className="set-number">{setIndex + 1}</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      className="item-input"
                      value={set.kg}
                      onChange={() =>
                        console.log(`Set ${setIndex + 1} 무게 변경`)
                      }
                    />
                    <span className="unit-label">kg</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      className="item-input"
                      value={set.reps}
                      onChange={() =>
                        console.log(`Set ${setIndex + 1} 횟수 변경`)
                      }
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

export default RoutineExerciseItem;
