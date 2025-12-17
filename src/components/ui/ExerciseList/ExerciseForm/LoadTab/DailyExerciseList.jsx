import styles from "./DailyExerciseList.module.css";
import DailyExerciseItem from "../../../../common/DailyExerciseItem";

const DailyExerciseList = ({
  exercises = [],
  onExerciseUpdate,
  onSetUpdate,
  onAddSet,
  onRemoveSet,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>운동 목록</div>

      {exercises.length > 0 ? (
        <div className={styles.listWrapper}>
          {exercises.map((exercise, idx) => (
            <DailyExerciseItem
              key={exercise.id || idx}
              exercise={exercise}
              onExerciseUpdate={onExerciseUpdate}
              onSetUpdate={onSetUpdate}
              onAddSet={onAddSet}
              onRemoveSet={onRemoveSet}
              isDaySelector={false}
            />
          ))}
        </div>
      ) : (
        <div className={styles.emptyMessage}>
          📅 해당 요일에는 계획된 운동이 없습니다.
        </div>
      )}
    </div>
  );
};

export default DailyExerciseList;
