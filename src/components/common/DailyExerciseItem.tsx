import { useState } from "react";
import type { ChangeEvent, MouseEvent } from "react";
import ToggleComponents from "./ToggleComponents";
import MuscleMap from "./MuscleMap";
import styles from "./DailyExerciseItem.module.css";

interface ExerciseSet {
  id: string | number;
  weight: number;
  reps: number;
}

interface DailyExerciseItemProps {
  exercise: {
    id: string;
    name: string;
    sets: ExerciseSet[];
    restTime: number;
    days: string[];
    targetMuscles?: string[];
    duration?: number;
  };
  onRemove?: (id: string) => void;
  onExerciseUpdate?: (id: string, field: string, value: any) => void;
  onSetUpdate?: (
    id: string,
    setId: string | number,
    field: string,
    value: number
  ) => void;
  onAddSet?: (id: string) => void;
  onRemoveSet?: (id: string, setId: string | number) => void;
  isDaySelector?: boolean;
  isReadOnly?: boolean;
  isDurationVisible?: boolean;
}

const DAYS_OF_WEEK = ["월", "화", "수", "목", "금", "토", "일"];

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
}: DailyExerciseItemProps) => {
  const { id, name, sets, restTime, days, targetMuscles, duration } = exercise;
  const [isExpanded, setIsExpanded] = useState(true);

  // 숫자 전용 입력 핸들러 (유틸리티성 함수)
  const handleNumericChange =
    (callback: (val: number) => void) => (e: ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/[^0-9]/g, "");
      callback(rawValue === "" ? 0 : parseInt(rawValue, 10));
    };

  // 요일 토글 로직
  const toggleDay = (day: string) => {
    const newDays = days.includes(day)
      ? days.filter((d) => d !== day)
      : [...days, day];
    onExerciseUpdate(id, "days", newDays);
  };

  // 요일 선택 영역 렌더링
  const renderDaySelection = () => (
    <div className={styles.daySelectionGroup}>
      <span className={styles.dayLabel}>요일</span>
      <div className={styles.dayButtons}>
        {DAYS_OF_WEEK.map((day) => (
          <button
            key={day}
            className={`${styles.dayButton} ${
              days.includes(day) ? styles.dayButtonActive : ""
            }`}
            onClick={(e: MouseEvent) => {
              e.stopPropagation();
              toggleDay(day);
            }}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`${styles.card} ${isReadOnly ? styles.readonly : ""}`}>
      {/* 카드 헤더: 클릭 시 접기/펴기 */}
      <div className={styles.header} onClick={() => setIsExpanded(!isExpanded)}>
        <div className={styles.headerLeft}>
          <ToggleComponents isUp={isExpanded} />
          <h3 className={styles.title}>
            {name}
            <span className={styles.setCount}>{sets.length}세트</span>
            {!isReadOnly && duration > 0 && isDurationVisible && (
              <span className={styles.setCount}> · {duration}분</span>
            )}
          </h3>
        </div>
        {!isReadOnly && (
          <button
            className={styles.removeExerciseBtn}
            onClick={(e: MouseEvent) => {
              e.stopPropagation();
              onRemove(id);
            }}
          >
            &times;
          </button>
        )}
      </div>

      {/* 상세 정보 영역 */}
      {isExpanded && (
        <div
          className={styles.details}
          onClick={(e: MouseEvent) => e.stopPropagation()}
        >
          {isDaySelector && renderDaySelection()}

          <div className={styles.infoContainer}>
            {/* 설정 행: 휴식 시간 및 운동 시간 */}
            <div
              className={styles.settingsRow}
              style={{ display: "flex", gap: "15px", marginBottom: "10px" }}
            >
              <div className={styles.group}>
                <span className={styles.label}>휴식(세트간)</span>
                <input
                  type="text"
                  className={styles.itemInput}
                  value={restTime}
                  readOnly={isReadOnly}
                  onChange={handleNumericChange((val) =>
                    onExerciseUpdate(id, "restTime", val)
                  )}
                />
                <span className={styles.unit}>초</span>
              </div>
              {!isReadOnly && isDurationVisible && (
                <div className={styles.group}>
                  <span className={styles.label}>운동 시간</span>
                  <input
                    type="text"
                    className={styles.itemInput}
                    value={duration || 0}
                    onChange={handleNumericChange((val) =>
                      onExerciseUpdate(id, "duration", val)
                    )}
                  />
                  <span className={styles.unit}>분</span>
                </div>
              )}
            </div>

            {/* 근육 지도 및 세트 리스트 */}
            <div
              className={styles.infoBox}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <MuscleMap selectedTags={targetMuscles} />

              <div className={styles.setList}>
                {sets.map((set, idx) => (
                  <div key={set.id} className={styles.setRow}>
                    <span className={styles.setNumber}>{idx + 1}</span>
                    <input
                      className={styles.itemInput}
                      value={set.weight}
                      onChange={handleNumericChange((val) =>
                        onSetUpdate(id, set.id, "weight", val)
                      )}
                    />
                    <span className={styles.unitLabel}>kg</span>
                    <input
                      className={styles.itemInput}
                      value={set.reps}
                      onChange={handleNumericChange((val) =>
                        onSetUpdate(id, set.id, "reps", val)
                      )}
                    />
                    <span className={styles.unitLabel}>회</span>
                    {!isReadOnly && sets.length > 1 && (
                      <button
                        className={styles.removeSetBtn}
                        onClick={() => onRemoveSet(id, set.id)}
                      >
                        제거
                      </button>
                    )}
                  </div>
                ))}
                {!isReadOnly && (
                  <button
                    className={styles.addSetBtn}
                    onClick={() => onAddSet(id)}
                  >
                    + 세트 추가
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyExerciseItem;
