import { useState, useCallback, useEffect } from "react";

// 데이터 가공 헬퍼 함수
const mapServerDataToForm = (serverData) => {
  if (!serverData) return null;

  const goalType = serverData.goalType
    ? serverData.goalType.toLowerCase()
    : "goal";
  return {
    info: {
      name: serverData.name || "새 목표",
      goalType: goalType,
      goalWeeks: serverData.goalWeeks || 1,
    },
    exercises: serverData.exercises
      ? serverData.exercises.map((ex) => ({
          ...ex,
          targetMuscles: ex.targetMuscles || [],
          days: ex.days || [],
          id: ex.id || Date.now() + Math.random(),
          sets: (ex.sets || []).map((set) => ({
            ...set,
            id: set.id || Date.now() + Math.random() + 0.1,
          })),
        }))
      : [],
  };
};

// 폼 초기값 상태
const getDefaultForm = (isEditMode) => ({
  info: {
    name: isEditMode ? "기존 목표 이름" : "새 목표",
    goalType: "routine",
    goalWeeks: 1,
  },
  exercises: [],
});

// 목표 폼의 모든 상태와 핸들러 관리
const useGoalForm = (isEditMode, initialGoal) => {
  const [goalForm, setGoalForm] = useState(() => {
    if (isEditMode && initialGoal) {
      return mapServerDataToForm(initialGoal);
    }
    return getDefaultForm(isEditMode);
  });

  // 초기 데이터 로드 및 매핑
  useEffect(() => {
    if (isEditMode && initialGoal) {
      const mappedData = mapServerDataToForm(initialGoal);
      if (mappedData) {
        setGoalForm(mappedData);
      }
    } else if (!isEditMode) {
      // 추가 모드일 때 초기 상태로 설정
      setGoalForm(getDefaultForm(false));
    }
  }, [isEditMode, initialGoal]);

  // 목표 정보 업데이트 핸들러
  const handleInfoChange = useCallback((field, value) => {
    setGoalForm((prev) => ({
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
      exerciseId: ex._id,
      name: ex.name,
      targetMuscles: ex.targetMuscles,
      equipment: ex.equipment || [],
      sets: [
        {
          id: Date.now() + Math.random() + 0.1,
          weight: 0,
          reps: 10,
        },
      ],
      restTime: 30,
      days: [],
    }));

    // 목표 상태 업데이트
    setGoalForm((prev) => ({
      ...prev,
      exercises: [...prev.exercises, ...exercisesToAdd],
    }));
  }, []);

  // 운동 제거 핸들러
  const handleRemoveExercise = useCallback((exerciseId) => {
    setGoalForm((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((ex) => ex.id !== exerciseId),
    }));
  }, []);

  // 운동 항목 내부 값 업데이트
  const handleExerciseUpdate = useCallback((exerciseId, field, value) => {
    setGoalForm((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) =>
        ex.id === exerciseId ? { ...ex, [field]: value } : ex
      ),
    }));
  }, []);

  // 세트 정보 업데이트
  const handleSetUpdate = useCallback((exerciseId, setId, field, value) => {
    setGoalForm((prev) => ({
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

  // 세트 추가
  const handleAddSet = useCallback((exerciseId) => {
    setGoalForm((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: [
                ...ex.sets,
                { id: Date.now() + Math.random(), weight: 0, reps: 10 },
              ],
            }
          : ex
      ),
    }));
  }, []);

  // 세트 제거 (최소 1개의 세트 유지)
  const handleRemoveSet = useCallback((exerciseId, setId) => {
    setGoalForm((prev) => ({
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

  // 저장을 위해 서버 전송용 데이터로 가공
  const getGoalDataForSave = useCallback(() => {
    return {
      name: goalForm.info.name,
      // 첫 글자만 대문자로 변환
      goalType: goalForm.info.goalType.toUpperCase(),

      durationWeek: goalForm.info.goalWeeks,

      exercises: goalForm.exercises.map((ex) => ({
        exerciseId: ex.exerciseId,
        name: ex.name,
        targetMuscles: ex.targetMuscles || [],
        days: ex.days,
        restTime: ex.restTime,

        sets: ex.sets.map((set, setIndex) => ({
          setNumber: setIndex + 1,
          weight: set.weight,
          reps: set.reps,
        })),
      })),
    };
  }, [goalForm]);

  return {
    goalForm,
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
