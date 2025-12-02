import RoutineFormContainer from "../../components/ui/Routine/RoutineForm/RoutineFormContainer";

const RoutineFormPage = ({ routineId }) => {
  const isEditMode = !!routineId;

  return (
    <div>
      <RoutineFormContainer routineId={routineId} isEditMode={isEditMode} />
    </div>
  );
};

export default RoutineFormPage;
