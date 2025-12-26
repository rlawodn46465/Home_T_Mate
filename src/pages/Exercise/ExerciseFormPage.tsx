import ExerciseFormContainer from "../../components/ui/ExerciseList/ExerciseForm/ExerciseFormContainer";

interface ExerciseFormPageProps {
  recordId?: string | number;
}

const ExerciseFormPage = ({ recordId }: ExerciseFormPageProps) => {
  return (
    <div>
      <ExerciseFormContainer
        recordId={recordId !== undefined ? String(recordId) : undefined}
      />
    </div>
  );
};

export default ExerciseFormPage;
