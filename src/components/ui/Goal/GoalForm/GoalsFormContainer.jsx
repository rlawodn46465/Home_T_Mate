import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./GoalsFormContainer.css";
import GoalsExerciseList from "./GoalsExerciseList";
import GoalsInfoSection from "./GoalsInfoSection";
import ExerciseSelectModal from "../../ExerciseSelect/ExerciseSelectModal";
import { useGoalSave } from "../../../../hooks/useGoalSave";
import { useGoalDetail } from "../../../../hooks/useGoalDetail";
import useGoalForm from "../../../../hooks/useGoalForm";

const SCREEN = {
  FORM: "form",
  SELECT: "select",
};

const GoalsFormContainer = ({ goalId, isEditMode }) => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState(SCREEN.FORM);

  // 서버 상세 정보 로딩
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

  // 저장 로직
  const { isSaving, saveGoalHandler } = useGoalSave(
    isEditMode,
    goalId
  );

  // 모달 제어 핸들러
  const handleCloseSelectModal = useCallback(() => {
    setCurrentScreen(SCREEN.FORM);
  }, []);

  const handleOpenSelectModal = useCallback(() => {
    setCurrentScreen(SCREEN.SELECT);
  }, []);

  // 루틴 저장
  const handleSaveGoal = useCallback(async () => {
    if (isSaving) {
      alert("저장 중이므로 저장을 취소합니다.");
      return;
    }

    const exercises = goalForm.exercises;

    // 운동 목록이 비어있는지 확인
    if (exercises.length === 0) {
      alert("저장할려면 최소 한 개 이상의 운동을 추가해야합니다.");
      return;
    }

    // 요일 체크 확인
    const isAnyDayMissing = exercises.some((ex) => ex.days.length === 0);
    if (isAnyDayMissing) {
      alert("모든 운동에 요일을 최소 한 개 이상 설정해야 저장할 수 있습니다.");
      return;
    }

    // 전송 데이터 정리
    const goalDataToSave = getGoalDataForSave();

    try {
      // 저장
      const response = await saveGoalHandler(goalDataToSave);
      alert(response.message);
      navigate("/?panel=goal");
      // 저장 성공 후 루틴 목록 페이지로 이동 로직 추가할 것
    } catch (error) {
      alert(error.message);
    }
  }, [
    goalForm,
    isSaving,
    saveGoalHandler,
    navigate,
    getGoalDataForSave,
  ]);

  // 로딩 및 에러 상태 처리
  if (detailLoading) {
    return <div className="goals-form-container">로딩 중...</div>;
  }

  if (detailError) {
    return <div className="goals-form-container error">{detailError}</div>;
  }

  if (isEditMode && !initialGoal) {
    return (
      <div className="goals-form-container">
        루틴 데이터를 불러올 수 없습니다.
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
    <div className="goals-form-container">
      <div className="goals-form-container__header">
        <h2>{isEditMode ? "루틴 수정" : "루틴 추가"}</h2>
        <div className="goals-form-container__button-box">
          <button className="cancel-button" onClick={() => navigate(-1)}>
            취소
          </button>
          <button
            className="save-button"
            onClick={handleSaveGoal}
            disabled={isSaving}
          >
            {isSaving ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>
      <GoalsInfoSection
        info={goalForm.info}
        onInfoChange={handleInfoChange}
      />
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
