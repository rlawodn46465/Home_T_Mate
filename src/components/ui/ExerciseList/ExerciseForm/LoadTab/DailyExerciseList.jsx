import { getDay } from "date-fns";
import DailyExerciseItem from "../../../../common/DailyExerciseItem";

const DailyExerciseList = ({
  goal,
  date,
  onExerciseUpdate,
  onSetUpdate,
  onAddSet,
  onRemoveSet,
}) => {
  // 선택된 날짜의 요일 (예: "월")
  const dayMap = ["일", "월", "화", "수", "목", "금", "토"];
  const currentDayStr = dayMap[getDay(date)];

  // 해당 요일에 배정된 운동만 필터링
  // (실제 데이터 구조에 맞춰 수정 필요)
  const todaysExercises = goal.customExercises.filter(
    (ex) => ex.days && ex.days.includes(currentDayStr)
  );
  return (
    <div className="daily-exercise-list">
      <div className="list-title">운동 목록</div>

      {todaysExercises.length > 0 ? (
        todaysExercises.map((exercise, idx) => (
          <DailyExerciseItem
            key={exercise.id || idx}
            exercise={exercise}
            onExerciseUpdate={onExerciseUpdate}
            onSetUpdate={onSetUpdate}
            onAddSet={onAddSet}
            onRemoveSet={onRemoveSet}
            isDaySelector={false}
          />
        ))
      ) : (
        <div className="empty-message">
          해당 요일에는 계획된 운동이 없습니다.
        </div>
      )}
    </div>
  );
};

export default DailyExerciseList;
