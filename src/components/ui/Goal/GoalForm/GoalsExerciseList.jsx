import DailyExerciseItem from "../../../common/DailyExerciseItem";
import styles from "./GoalsExerciseList.module.css";

const GoalsExerciseList = ({
  exercises,
  onOpenModal,
  onRemoveExercise,
  onExerciseUpdate,
  onSetUpdate,
  onAddSet,
  onRemoveSet,
}) => {
  return (
    <div className={styles.goalExerciseList}>
      {exercises.map((exercise) => (
        <DailyExerciseItem
          key={exercise.id}
          exercise={exercise}
          onRemove={onRemoveExercise}
          onExerciseUpdate={onExerciseUpdate}
          onSetUpdate={onSetUpdate}
          onAddSet={onAddSet}
          onRemoveSet={onRemoveSet}
          isDaySelector={true}
          isDurationVisible={false}
        />
      ))}
      <div className={styles.addExerciseArea}>
        <button className={styles.addExerciseButton} onClick={onOpenModal}>
          + 운동 추가
        </button>
      </div>
    </div>
  );
};

export default GoalsExerciseList;
