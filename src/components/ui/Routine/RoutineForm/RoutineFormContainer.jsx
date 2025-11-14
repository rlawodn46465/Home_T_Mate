import { useCallback, useState } from "react";
import RoutineExerciseList from "./RoutineExerciseList";
import "./RoutineFormContainer.css";
import RoutineInfoSection from "./RoutineInfoSection";
import ExerciseSelectModal from "../../ExerciseSelect/ExerciseSelectModal";
import { useRoutineSave } from "../../../../hooks/useRoutineSave";

const SCREEN = {
  FORM: "form",
  SELECT: "select",
};

const RoutineFormContainer = ({ routineId, isEditMode }) => {
  const [currentScreen, setCurrentScreen] = useState(SCREEN.FORM);

  const { isSaving, saveRoutineHandler } = useRoutineSave(
    isEditMode,
    routineId
  );

  const [routineForm, setRoutineForm] = useState({
    info: {
      name: isEditMode ? "기존 루틴 이름" : "새 루틴",
      routineType: "routine",
      goalWeeks: 4,
    },
    exercises: [],
  });

  // 루틴 정보 업데이트 핸들러
  const handleInfoChange = useCallback((field, value) => {
    setRoutineForm((prev) => ({
      ...prev,
      info: {
        ...prev.info,
        [field]: value,
      },
    }));
  }, []);

  // 운동 추가 핸들러
  const handleAddExercise = useCallback((newExercises) => {
    // 새로운 운동 항목 배열 생성
    const exercisesToAdd = newExercises.map((ex) => ({
      id: Date.now() + Math.random(),
      name: ex.name,
      targetMuscles: ex.targetMuscles,
      equipment: ex.equipment || [],
      sets: [
        {
          id: Date.now() + Math.random() + 0.1,
          kg: 0,
          reps: 10,
        },
      ],
      restTime: 30,
      days: [],
    }));

    // 루틴 상태 업데이트
    setRoutineForm((prev) => ({
      ...prev,
      exercises: [...prev.exercises, ...exercisesToAdd],
    }));
    // 모달 닫기
    setCurrentScreen(SCREEN.FORM);
  }, []);

  // 모달 닫기
  const handleCloseSelectModal = useCallback(() => {
    setCurrentScreen(SCREEN.FORM);
  }, []);

  // 운동 제거 핸들러
  const handleRemoveExercise = useCallback((exerciseId) => {
    setRoutineForm((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((ex) => ex.id !== exerciseId),
    }));
  }, []);

  // 운동 항목 내부 값 업데이트
  const handleExerciseUpdate = useCallback((exerciseId, field, value) => {
    setRoutineForm((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) =>
        ex.id === exerciseId ? { ...ex, [field]: value } : ex
      ),
    }));
  }, []);

  // 세트 정보 업데이트
  const handleSetUpdate = useCallback((exerciseId, setId, field, value) => {
    setRoutineForm((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.map((set) =>
                set.id === setId ? { ...set, [field]: value } : set
              ),
            }
          : ex
      ),
    }));
  }, []);

  const handleAddSet = useCallback((exerciseId) => {
    setRoutineForm((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: [
                ...ex.sets,
                { id: Date.now() + Math.random(), kg: 0, reps: 10 },
              ],
            }
          : ex
      ),
    }));
  }, []);

  // 세트 제거
  const handleRemoveSet = useCallback((exerciseId, setId) => {
    setRoutineForm((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) =>
        ex.id === exerciseId && ex.sets.length > 1
          ? {
              ...ex,
              sets: ex.sets.filter((set) => set.id !== setId),
            }
          : ex
      ),
    }));
  }, []);

  // 루틴 저장
  const handleSaveRoutine = useCallback(async () => {
    if (isSaving || routineForm.exercises.length === 0) {
      console.log("저장 중이거나 운동 목록이 비어있어 저장을 취소합니다.");
      return;
    }

    // 전송 데이터 정리
    const routineDataToSave = {
      name: routineForm.info.name,
      routineType:
        routineForm.info.routineType.charAt(0).toUpperCase() +
        routineForm.info.routineType.slice(1),

      goalWeeks: routineForm.info.goalWeeks,

      exercises: routineForm.exercises.map((ex, exIndex) => ({
        name: ex.name,
        targetMuscles: ex.targetMuscles || [],
        days: ex.days,
        restTime: ex.restTime,

        sets: ex.sets.map((set, setIndex) => ({
          setNumber: setIndex + 1, 
          weight: set.kg, 
          reps: set.reps,
        })),
      })),
    };
    // 테스트
    console.log("--- 전송 직전 루틴 데이터 (routineDataToSave) ---");
    console.log("전송 데이터:", routineDataToSave);
    console.log("JSON 문자열:", JSON.stringify(routineDataToSave, null, 2));
    try {
      // 저장
      const response = await saveRoutineHandler(routineDataToSave);

      // UI 피드백 및 라우팅 처리
      alert(response.message);
      // 저장 성공 후 루틴 목록 페이지로 이동 로직 추가할 것
    } catch (error) {
      alert(error.message);
    }
  }, [routineForm, isSaving, saveRoutineHandler]);

  // 운동 추가 버튼 핸들러
  const handleOpenSelectModal = useCallback(() => {
    setCurrentScreen(SCREEN.SELECT);
  }, []);

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
          <button className="cancel-button">취소</button>
          <button
            className="save-button"
            onClick={handleSaveRoutine}
            disabled={isSaving || routineForm.exercises.length === 0}
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
