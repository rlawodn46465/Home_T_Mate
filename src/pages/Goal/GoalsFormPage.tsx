import GoalsFormContainer from "../../components/ui/Goal/GoalForm/GoalsFormContainer";

interface GoalsFormPageProps {
  goalId?: string | number | null;
}

const GoalsFormPage = ({ goalId }: GoalsFormPageProps) => {
  const isEditMode = !!goalId;

  return (
    <div>
      <GoalsFormContainer
        goalId={goalId ? String(goalId) : undefined}
        isEditMode={isEditMode}
      />
    </div>
  );
};

export default GoalsFormPage;
