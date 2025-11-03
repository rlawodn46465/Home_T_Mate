import "./ExerciseInfoSection.css";
import InstructionList from "./InstructionList";
import MemoArea from "./MemoArea";

const ExerciseInfoSection = ({ description, initialMemo, onMemoSave}) => {

  return (
    <div className="exercise-info-section">
      <InstructionList description={description}/>
      <MemoArea initialMemo={initialMemo} onSave={onMemoSave} />
    </div>
  );
};

export default ExerciseInfoSection;
