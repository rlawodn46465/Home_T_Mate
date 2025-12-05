import "./ExerciseList.css";

const ExerciseList = ({ exercises, onSelectExercise }) => {
  if (!exercises || exercises.length === 0) {
    return <p className="no-exercises">표시할 운동이 없습니다.</p>;
  }
  console.log(exercises);
  return (
    <div className="exercise-list">
      {exercises.map((exercise, index) => (
        <div
          key={`${exercise.name}${index}`}
          className="exercise-item"
          onClick={() => {
            const id = exercise.exerciseId;
            if (id && onSelectExercise) {
              onSelectExercise(id);
            }
          }}
        >
          <div className="exercise-item-info">
            <div className="exercise-item-info__top">
              <h4>{exercise.name}</h4>
              <p className="exercise-set-summary">
                {exercise.sets && exercise.sets.length > 0
                  ? `${exercise.sets.length} 세트`
                  : "세트 정보 없음"}
              </p>
            </div>
            <div className="exercise-item-sets">
              {exercise.sets &&
                Array.isArray(exercise.sets) &&
                exercise.sets.map((set, index) => (
                  <p
                    key={set.setNumber ?? index}
                    className="exercise-set-detail"
                  >
                    {set.weight}kg x {set.reps}회
                  </p>
                ))}
            </div>

            <div className="exercise-item-info__bottom">
              {exercise.days.map((day, index) => (
                <p key={`${day}${index}`}>{day}</p>
              ))}
            </div>
          </div>
          {/* 추가 정보 (예: 운동 완료 체크박스 등)는 여기에 */}
        </div>
      ))}
    </div>
  );
};

export default ExerciseList;
