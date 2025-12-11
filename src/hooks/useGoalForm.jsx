import { useState, useCallback, useEffect, useReducer } from "react";
import { createId } from "../utils/guid";

// 폼 초기값 상태
const defaultForm = (isEditMode) => ({
  info: {
    name: isEditMode ? "기존 루틴 이름" : "새 루틴",
    goalType: "goal",
    goalWeeks: 1,
  },
  exercises: [],
});

// 데이터 가공 헬퍼 함수
const mapServerDataToForm = (serverData) => {
  if (!serverData) return defaultForm(false);
  const goalType = serverData.goalType
    ? serverData.goalType.toLowerCase()
    : "goal";
  return {
    info: {
      name: serverData.name || "새 루틴",
      goalType,
      goalWeeks: serverData.goalWeeks || 1,
    },
    exercises: (serverData.exercises || []).map((ex) => ({
      id: createId("ex"),
      exerciseId: ex.id || ex._id,
      name: ex.name,
      targetMuscles: ex.targetMuscles || [],
      equipment: ex.equipment || [],
      sets: (ex.sets || [{ id: createId("set"), weight: 0, reps: 10 }]).map(
        (s) => ({ ...s, id: s.id || createId("set") })
      ),
      restTime: ex.restTime || 30,
      days: ex.days || [],
    })),
  };
};

function reducer(state, action) {
  switch (action.type) {
    case "INIT":
      return action.payload;
    case "SET_INFO":
      return {
        ...state,
        info: { ...state.info, [action.field]: action.value },
      };
    case "ADD_EXERCISES":
      return { ...state, exercises: [...state.exercises, ...action.payload] };
    case "REMOVE_EXERCISE":
      return {
        ...state,
        exercises: state.exercises.filter((ex) => ex.id !== action.payload),
      };
    case "UPDATE_EXERCISE":
      return {
        ...state,
        exercises: state.exercises.map((ex) =>
          ex.id === action.id ? { ...ex, ...action.payload } : ex
        ),
      };
    case "UPDATE_SET":
      return {
        ...state,
        exercises: state.exercises.map((ex) =>
          ex.id === action.exerciseId
            ? {
                ...ex,
                sets: ex.sets.map((s) =>
                  s.id === action.setId
                    ? { ...s, [action.field]: action.value }
                    : s
                ),
              }
            : ex
        ),
      };
    case "ADD_SET":
      return {
        ...state,
        exercises: state.exercises.map((ex) =>
          ex.id === action.exerciseId
            ? {
                ...ex,
                sets: [
                  ...ex.sets,
                  { id: createId("set"), weight: 0, reps: 10 },
                ],
              }
            : ex
        ),
      };
    case "REMOVE_SET":
      return {
        ...state,
        exercises: state.exercises.map((ex) =>
          ex.id === action.exerciseId
            ? {
                ...ex,
                sets:
                  ex.sets.length > 1
                    ? ex.sets.filter((s) => s.id !== action.setId)
                    : ex.sets,
              }
            : ex
        ),
      };
    default:
      return state;
  }
}

// 루틴 폼의 모든 상태와 핸들러 관리
const useGoalForm = (isEditMode = false, initialGoal = null) => {
  const [state, dispatch] = useReducer(reducer, defaultForm(isEditMode));

  // 초기 데이터 로드 및 매핑
  useEffect(() => {
    if (isEditMode && initialGoal)
      dispatch({ type: "INIT", payload: mapServerDataToForm(initialGoal) });
    if (!isEditMode) dispatch({ type: "INIT", payload: defaultForm(false) });
  }, [isEditMode, initialGoal]);

  // 루틴 정보 업데이트 핸들러
  const handleInfoChange = useCallback(
    (field, value) => dispatch({ type: "SET_INFO", field, value }),

    []
  );

  // 운동 추가 핸들러
  const handleAddExercise = useCallback((newExercises) => {
    const exercisesToAdd = newExercises.map((ex) => ({
      id: createId("ex"),
      exerciseId: ex._id,
      name: ex.name,
      targetMuscles: ex.targetMuscles || [],
      equipment: ex.equipment || [],
      sets: [{ id: createId("set"), weight: 0, reps: 10 }],
      restTime: 30,
      days: [],
    }));
    dispatch({ type: "ADD_EXERCISES", payload: exercisesToAdd });
  }, []);

  // 운동 제거 핸들러
  const handleRemoveExercise = useCallback(
    (exerciseId) => dispatch({ type: "REMOVE_EXERCISE", payload: exerciseId }),
    []
  );

  // 운동 항목 내부 값 업데이트
  const handleExerciseUpdate = useCallback(
    (exerciseId, patch) =>
      dispatch({ type: "UPDATE_EXERCISE", id: exerciseId, payload: patch }),
    []
  );

  // 세트 정보 업데이트
  const handleSetUpdate = useCallback(
    (exerciseId, setId, field, value) =>
      dispatch({ type: "UPDATE_SET", exerciseId, setId, field, value }),
    []
  );

  // 세트 추가
  const handleAddSet = useCallback(
    (exerciseId) => dispatch({ type: "ADD_SET", exerciseId }),
    []
  );

  // 세트 제거 (최소 1개의 세트 유지)
  const handleRemoveSet = useCallback(
    (exerciseId, setId) => dispatch({ type: "REMOVE_SET", exerciseId, setId }),
    []
  );

  // 저장을 위해 서버 전송용 데이터로 가공
  const getGoalDataForSave = useCallback(
    () => ({
      name: state.info.name,
      goalType: state.info.goalType.toUpperCase(),
      durationWeek: state.info.goalWeeks,
      exercises: state.exercises.map((ex) => ({
        exerciseId: ex.exerciseId,
        name: ex.name,
        targetMuscles: ex.targetMuscles || [],
        days: ex.days,
        restTime: ex.restTime,
        sets: ex.sets.map((s, idx) => ({
          setNumber: idx + 1,
          weight: s.weight,
          reps: s.reps,
        })),
      })),
    }),
    [state]
  );

  return {
    goalForm: state,
    handleInfoChange,
    handleAddExercise,
    handleRemoveExercise,
    handleExerciseUpdate,
    handleSetUpdate,
    handleAddSet,
    handleRemoveSet,
    getGoalDataForSave,
  };
};

export default useGoalForm;
