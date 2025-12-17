import DailyExerciseItem from "../../../common/DailyExerciseItem";
import "./GoalsExerciseList.css";

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
    <div className="goal-exercise-list">
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
      <div className="add-exercise-area">
        <button className="add-exercise-button" onClick={onOpenModal}>
          + 운동 추가
        </button>
      </div>
    </div>
  );
};

export default GoalsExerciseList;
