import ExerciseInfoSection from "./ExerciseInfoSection";

import "./ExerciseFormContainer.css";
import { useNavigate } from "react-router-dom";

const ExerciseFormContainer = ({ exerciseId }) => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/?panel=record");
  };

  return (
    <div className="exercise-form-container">
      <div className="exercise-form-container__header">
        <h2>운동 기록 추가</h2>
        <button className="form-cancel-button" onClick={handleCancel}>
          취소
        </button>
      </div>
      <ExerciseInfoSection />
    </div>
  );
};

export default ExerciseFormContainer;
