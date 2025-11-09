import { useCallback, useState } from "react";
import RoutineExerciseList from "./RoutineExerciseList";
import "./RoutineFormContainer.css";
import RoutineInfoSection from "./RoutineInfoSection";
import ExerciseSelectModal from "../../ExerciseSelect/ExerciseSelectModal";

const SCREEN = {
  FORM: "form",
  SELECT: "select",
};

const RoutineFormContainer = ({ routineId, isEditMode }) => {
  const [currentScreen, setCurrentScreen] = useState(SCREEN.FORM);

  const [routineForm, setRoutineForm] = useState({
    info: {
      name: isEditMode ? "기존 루틴 이름" : "새 루틴",
      routineType: "routine",
      goalWeeks: 4,
    },
    exercises: [
      {
        id: 1,
        name: "런지",
        sets: [
          { id: 1, kg: 10, reps: 100 },
          { id: 2, kg: 10, reps: 100 },
        ],
        restTime: 15,
        days: ["월", "화", "수", "금"],
        musclePart: "대퇴사두",
      },
    ],
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
    const exercisesToAdd = newExercises.map((ex) => ({
      id: Date.now() + Math.random(),
      name: ex.name + (ex.tool === "맨몸" ? "" : ` (${ex.tool})`),
      sets: [{ id: Date.now() + Math.random() + 0.1, kg: 0, reps: 0 }],
      restTime: 30,
      days: [],
      musclePart: ex.musclePart,
    }));

    setRoutineForm((prev) => ({
      ...prev,
      exercises: [...prev.exercises, ...exercisesToAdd],
    }));
    setCurrentScreen(SCREEN.FORM);
  }, []);

  // 운동 제거 핸들러
  const handleRemoveExercise = useCallback((exerciseId) => {
    setRoutineForm((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((ex) => ex.id !== exerciseId),
    }));
  }, []);

  // 운동 추가 버튼 핸들러
  const handleOpenSelectModal = useCallback(() => {
    setCurrentScreen(SCREEN.SELECT);
  }, []);

  const handleCloseSelectModal = useCallback(() => {
    setCurrentScreen(SCREEN.FORM);
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
          <button className="save-button">저장</button>
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
      />
      {/* <p className="routine-form-container__add-exercise">+운동 추가</p> */}
    </div>
  );
};

export default RoutineFormContainer;
