import RoutineFormContainer from "../../components/ui/Routine/RoutineForm/RoutineFormContainer";

const RoutineFormPage = ({ routineId }) => {
  const isEditMode = !!routineId;

  return (
    <div>
      <RoutineFormContainer routineId={routineId} isEditMode={isEditMode} />
      <p>
        {isEditMode ? `ID: ${routineId} 루틴 수정 중` : "새 루틴 생성 시작"}
      </p>
    </div>
  );
};

export default RoutineFormPage;
