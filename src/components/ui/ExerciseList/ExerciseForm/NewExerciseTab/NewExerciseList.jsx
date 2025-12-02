import DailyExerciseItem from "../../../../common/DailyExerciseItem";

const NewExerciseList = ({
  exercises,
  onOpenModal,
  onRemoveExercise,
  onExerciseUpdate,
  onSetUpdate,
  onAddSet,
  onRemoveSet,
}) => {
  return (
    <div className="new-exercise-list">
      {exercises.map((exercise) => (
        <DailyExerciseItem
          key={exercise.id}
          exercise={exercise}
          onRemove={onRemoveExercise}
          onExerciseUpdate={onExerciseUpdate}
          onSetUpdate={onSetUpdate}
          onAddSet={onAddSet}
          onRemoveSet={onRemoveSet}
          isDaySelector={false}
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

export default NewExerciseList;
