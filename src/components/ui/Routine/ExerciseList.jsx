import "./ExerciseList.css"; // 상세 페이지 CSS 재활용

const ExerciseList = ({ exercises }) => {
  if (!exercises || exercises.length === 0) {
    return <p className="no-exercises">표시할 운동이 없습니다.</p>;
  }

  return (
    <div className="exercise-list">
      {exercises.map((exercise) => (
        <div
          key={exercise.id}
          className="exercise-item"
          onClick={() => {
            console.log(exercises);
          }}
        >
          <div className="exercise-item-info">
            <div className="exercise-item-info__top">
              <h4>{exercise.name}</h4>
              <p>
                {exercise.sets} x {exercise.reps}
              </p>
            </div>
            <div className="exercise-item-info__bottom">
              {exercise.days.map((day) => (
                <p>{day}</p>
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
