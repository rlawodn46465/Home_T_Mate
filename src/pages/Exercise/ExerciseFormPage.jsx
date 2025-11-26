import ExerciseFormContainer from "../../components/ui/ExerciseList/ExerciseForm/ExerciseFormContainer";

const ExerciseFormPage = ({ exerciseId }) => {
  return (
    <div>
      <ExerciseFormContainer exerciseId={exerciseId} />
    </div>
  );
};

export default ExerciseFormPage;
