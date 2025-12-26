import { useCallback, useState } from "react";
import styles from "./GoalsFormContainer.module.css";
import GoalsExerciseList from "./GoalsExerciseList";
import GoalsInfoSection from "./GoalsInfoSection";
import ExerciseSelectModal from "../../ExerciseSelect/ExerciseSelectModal";
import { useGoalSave } from "../../../../hooks/useGoalSave";
import { useGoalDetail } from "../../../../hooks/useGoalDetail";
import useGoalForm from "../../../../hooks/useGoalForm";
import { usePersistentPanel } from "../../../../hooks/usePersistentPanel";

type ScreenType = "form" | "select";

interface GoalsFormContainerProps {
  goalId?: string;
  isEditMode: boolean;
}

const SCREEN: Record<string, ScreenType> = {
  FORM: "form",
  SELECT: "select",
};

const GoalsFormContainer = ({
  goalId,
  isEditMode,
}: GoalsFormContainerProps) => {
  const { navigateToPanel } = usePersistentPanel();
  const [currentScreen, setCurrentScreen] = useState<ScreenType>(SCREEN.FORM);

  const {
    goal: initialGoal,
    loading: detailLoading,
    error: detailError,
  } = useGoalDetail(goalId, isEditMode);

  const {
    goalForm,
    handleInfoChange,
    handleAddExercise,
    handleRemoveExercise,
    handleExerciseUpdate,
    handleSetUpdate,
    handleAddSet,
    handleRemoveSet,
    getGoalDataForSave,
  } = useGoalForm(isEditMode, initialGoal);

  const { isSaving, saveGoalHandler } = useGoalSave(isEditMode, goalId);

  const handleCloseSelectModal = useCallback(() => {
    setCurrentScreen(SCREEN.FORM);
  }, []);

  const handleOpenSelectModal = useCallback(() => {
    setCurrentScreen(SCREEN.SELECT);
  }, []);

  const handleSaveGoal = useCallback(async () => {
    if (isSaving) return;

    const { exercises } = goalForm;

    if (exercises.length === 0) {
      alert("저장할려면 최소 한 개 이상의 운동을 추가해야합니다.");
      return;
    }

    const isAnyDayMissing = exercises.some((ex) => ex.days.length === 0);
    if (isAnyDayMissing) {
      alert("모든 운동에 요일을 최소 한 개 이상 설정해야 저장할 수 있습니다.");
      return;
    }

    const goalDataToSave = getGoalDataForSave();

    try {
      const response = await saveGoalHandler(goalDataToSave);
      alert(response?.message || "성공적으로 저장되었습니다.");
      navigateToPanel("?panel=goal");
    } catch (error) {
      alert(error.message || "저장 중 오류가 발생했습니다.");
    }
  }, [
    goalForm,
    isSaving,
    saveGoalHandler,
    navigateToPanel,
    getGoalDataForSave,
  ]);

  const handleCancel = useCallback(() => {
    navigateToPanel("?panel=goal");
  }, [navigateToPanel]);

  if (detailLoading) {
    return <div className={styles.goalsFormContainer}>로딩 중...</div>;
  }

  if (detailError) {
    return (
      <div className={`${styles.goalsFormContainer} ${styles.error}`}>
        {detailError}
      </div>
    );
  }

  if (isEditMode && !initialGoal) {
    return (
      <div className={styles.goalsFormContainer}>
        목표 데이터를 불러올 수 없습니다.
      </div>
    );
  }

  if (currentScreen === SCREEN.SELECT) {
    return (
      <ExerciseSelectModal
        onClose={handleCloseSelectModal}
        onSelect={handleAddExercise}
      />
    );
  }

  return (
    <div className={styles.goalsFormContainer}>
      <div className={styles.header}>
        <h2>{isEditMode ? "목표 수정" : "목표 추가"}</h2>
        <div className={styles.buttonBox}>
          <button className={styles.cancelButton} onClick={handleCancel}>
            취소
          </button>
          <button
            className={styles.saveButton}
            onClick={handleSaveGoal}
            disabled={isSaving}
          >
            {isSaving ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>
      <GoalsInfoSection info={goalForm.info} onInfoChange={handleInfoChange} />
      <GoalsExerciseList
        exercises={goalForm.exercises}
        onOpenModal={handleOpenSelectModal}
        onRemoveExercise={handleRemoveExercise}
        onExerciseUpdate={handleExerciseUpdate}
        onSetUpdate={handleSetUpdate}
        onAddSet={handleAddSet}
        onRemoveSet={handleRemoveSet}
      />
    </div>
  );
};

export default GoalsFormContainer;
