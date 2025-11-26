import ExerciseInfoSection from "./ExerciseInfoSection";

import "./ExerciseFormContainer.css";

const ExerciseFormContainer = ({ exerciseId }) => {
  return (
    <div className="exercise-form-container">
      <div className="exercise-form-container__header">
        <h2>운동 기록 추가</h2>
        <button className="form-cancel-button">취소</button>
      </div>
      <ExerciseInfoSection />
    </div>
  );
};

export default ExerciseFormContainer;
