import DailyExerciseItem from "../../../common/DailyExerciseItem";
import styles from "./GoalsExerciseList.module.css";

interface ExerciseSet {
  id: string | number;
  weight: number;
  reps: number;
}

interface GoalExercise {
  id: string;
  name: string;
  sets: ExerciseSet[];
  restTime: number;
  days: string[];
  targetMuscles?: string[];
  duration?: number;
}

interface GoalsExerciseListProps {
  exercises: GoalExercise[];
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

const GoalsExerciseList = ({
  exercises,
  onOpenModal,
  onRemoveExercise,
  onExerciseUpdate,
  onSetUpdate,
  onAddSet,
  onRemoveSet,
}: GoalsExerciseListProps) => {
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
