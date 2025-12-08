import ExerciseFormContainer from "../../components/ui/ExerciseList/ExerciseForm/ExerciseFormContainer";

const ExerciseFormPage = ({ recordId }) => {
  return (
    <div>
      <ExerciseFormContainer recordId={recordId} />
    </div>
  );
};

export default ExerciseFormPage;
