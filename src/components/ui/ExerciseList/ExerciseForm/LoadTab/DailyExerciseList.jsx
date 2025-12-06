import { getDay } from "date-fns";
import DailyExerciseItem from "../../../../common/DailyExerciseItem";

const DailyExerciseList = ({
  exercises,
  date,
  onExerciseUpdate,
  onSetUpdate,
  onAddSet,
  onRemoveSet,
}) => {
  const todaysExercises = exercises;

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
