import RoutineExerciseItem from "../../../Routine/RoutineForm/RoutineExerciseItem";

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
        <RoutineExerciseItem
          key={exercise.id}
          exercise={exercise}
          onRemove={onRemoveExercise}
          onExerciseUpdate={onExerciseUpdate}
          onSetUpdate={onSetUpdate}
          onAddSet={onAddSet}
          onRemoveSet={onRemoveSet}
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
