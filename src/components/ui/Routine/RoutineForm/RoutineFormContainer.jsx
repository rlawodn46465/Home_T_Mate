import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RoutineFormContainer.css";
import RoutineExerciseList from "./RoutineExerciseList";
import RoutineInfoSection from "./RoutineInfoSection";
import ExerciseSelectModal from "../../ExerciseSelect/ExerciseSelectModal";
import { useRoutineSave } from "../../../../hooks/useRoutineSave";
import { useRoutineDetail } from "../../../../hooks/useRoutineDetail";
import useRoutineForm from "../../../../hooks/useRoutineForm";

const SCREEN = {
  FORM: "form",
  SELECT: "select",
};

const RoutineFormContainer = ({ routineId, isEditMode }) => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState(SCREEN.FORM);

  // 서버 상세 정보 로딩
  const {
    routine: initialRoutine,
    loading: detailLoading,
    error: detailError,
  } = useRoutineDetail(routineId, isEditMode);

  const {
    routineForm,
    handleInfoChange,
    handleAddExercise,
    handleRemoveExercise,
    handleExerciseUpdate,
    handleSetUpdate,
    handleAddSet,
    handleRemoveSet,
    getRoutineDataForSave,
  } = useRoutineForm(isEditMode, initialRoutine);

  // 저장 로직
  const { isSaving, saveRoutineHandler } = useRoutineSave(
    isEditMode,
    routineId
  );

  // 모달 제어 핸들러
  const handleCloseSelectModal = useCallback(() => {
    setCurrentScreen(SCREEN.FORM);
  }, []);

  const handleOpenSelectModal = useCallback(() => {
    setCurrentScreen(SCREEN.SELECT);
  }, []);

  // 루틴 저장
  const handleSaveRoutine = useCallback(async () => {
    if (isSaving) {
      alert("저장 중이므로 저장을 취소합니다.");
      return;
    }

    const exercises = routineForm.exercises;

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
    const routineDataToSave = getRoutineDataForSave();

    try {
      // 저장
      const response = await saveRoutineHandler(routineDataToSave);
      alert(response.message);
      navigate("/?panel=routine");
      // 저장 성공 후 루틴 목록 페이지로 이동 로직 추가할 것
    } catch (error) {
      alert(error.message);
    }
  }, [
    routineForm,
    isSaving,
    saveRoutineHandler,
    navigate,
    getRoutineDataForSave,
  ]);

  // 로딩 및 에러 상태 처리
  if (detailLoading) {
    return <div className="routine-form-container">로딩 중...</div>;
  }

  if (detailError) {
    return <div className="routine-form-container error">{detailError}</div>;
  }

  if (isEditMode && !initialRoutine) {
    return (
      <div className="routine-form-container">
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
    <div className="routine-form-container">
      <div className="routine-form-container__header">
        <h2>{isEditMode ? "루틴 수정" : "루틴 추가"}</h2>
        <div className="routine-form-container__button-box">
          <button className="cancel-button" onClick={() => navigate(-1)}>
            취소
          </button>
          <button
            className="save-button"
            onClick={handleSaveRoutine}
            disabled={isSaving}
          >
            {isSaving ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>
      <RoutineInfoSection
        info={routineForm.info}
        onInfoChange={handleInfoChange}
      />
      <RoutineExerciseList
        exercises={routineForm.exercises}
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

export default RoutineFormContainer;
