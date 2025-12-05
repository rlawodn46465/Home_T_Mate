import GoalsFormContainer from "../../components/ui/Goal/GoalForm/GoalsFormContainer";

const GoalsFormPage = ({ goalId }) => {
  const isEditMode = !!goalId;

  return (
    <div>
      <GoalsFormContainer goalId={goalId} isEditMode={isEditMode} />
    </div>
  );
};

export default GoalsFormPage;
