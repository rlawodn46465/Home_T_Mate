import DailyExerciseItem from "../../../../common/DailyExerciseItem";
import "./NewExerciseList.css";

interface NewExerciseListProps {
  exercises: any[];
  onOpenModal: () => void;
  onRemoveExercise: (id: string) => void;
  onExerciseUpdate: (id: string, field: string, value: any) => void;
  onSetUpdate: (
    id: string,
    setId: string | number,
    field: string,
    value: number
  ) => void;
  onAddSet: (id: string) => void;
  onRemoveSet: (id: string, setId: string | number) => void;
}

const NewExerciseList = ({
  exercises,
  onOpenModal,
  onRemoveExercise,
  onExerciseUpdate,
  onSetUpdate,
  onAddSet,
  onRemoveSet,
}: NewExerciseListProps) => {
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
