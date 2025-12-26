import styles from "./ExerciseList.module.css";

interface ExerciseSet {
  setNumber?: number;
  weight: number;
  reps: number;
}

interface Exercise {
  exerciseId: string | number;
  name: string;
  sets: ExerciseSet[];
  days: string[];
}

interface ExerciseListProps {
  exercises: Exercise[];
  onSelectExercise?: (id: string | number) => void;
}

const ExerciseList = ({ exercises, onSelectExercise }: ExerciseListProps) => {
  if (!exercises || exercises.length === 0) {
    return <p className={styles.noExercises}>표시할 운동이 없습니다.</p>;
  }
  return (
    <div className={styles.exerciseList}>
      {exercises.map((exercise, index) => (
        <div
          key={`${exercise.name}${index}`}
          className={styles.exerciseItem}
          onClick={() => {
            const id = exercise.exerciseId;
            if (id && onSelectExercise) {
              onSelectExercise(id);
            }
          }}
        >
          <div className={styles.exerciseItemInfo}>
            <div className={styles.exerciseItemInfoTop}>
              <h4>{exercise.name}</h4>
              <p className={styles.exerciseSetSummary}>
                {exercise.sets && exercise.sets.length > 0
                  ? `${exercise.sets.length} 세트`
                  : "세트 정보 없음"}
              </p>
            </div>
            <div className={styles.exerciseItemSets}>
              {exercise.sets &&
                Array.isArray(exercise.sets) &&
                exercise.sets.map((set, index) => (
                  <p
                    key={set.setNumber ?? index}
                    className={styles.exerciseSetDetail}
                  >
                    {set.weight}kg x {set.reps}회
                  </p>
                ))}
            </div>

            <div className={styles.exerciseItemInfoBottom}>
              {exercise.days.map((day, index) => (
                <p key={`${day}${index}`}>{day}</p>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExerciseList;
