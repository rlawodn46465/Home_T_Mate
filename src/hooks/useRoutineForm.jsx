import { useState, useCallback, useEffect } from "react";

// 데이터 가공 헬퍼 함수
const mapServerDataToForm = (serverData) => {
  if (!serverData) return null;

  const routineType = serverData.routineType
    ? serverData.routineType.toLowerCase()
    : "routine";
  return {
    info: {
      name: serverData.name || "새 루틴",
      routineType: routineType,
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
    name: isEditMode ? "기존 루틴 이름" : "새 루틴",
    routineType: "routine",
    goalWeeks: 1,
  },
  exercises: [],
});

// 루틴 폼의 모든 상태와 핸들러 관리
const useRoutineForm = (isEditMode, initialRoutine) => {
  const [routineForm, setRoutineForm] = useState(() => {
    if (isEditMode && initialRoutine) {
      return mapServerDataToForm(initialRoutine);
    }
    return getDefaultForm(isEditMode);
  });

  // 초기 데이터 로드 및 매핑
  useEffect(() => {
    if (isEditMode && initialRoutine) {
      const mappedData = mapServerDataToForm(initialRoutine);
      if (mappedData) {
        setRoutineForm(mappedData);
      }
    } else if (!isEditMode) {
      // 추가 모드일 때 초기 상태로 설정
      setRoutineForm(getDefaultForm(false));
    }
  }, [isEditMode, initialRoutine]);

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
    console.log(newExercises);
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

    // 루틴 상태 업데이트
    setRoutineForm((prev) => ({
      ...prev,
      exercises: [...prev.exercises, ...exercisesToAdd],
    }));
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

  // 세트 추가
  const handleAddSet = useCallback((exerciseId) => {
    setRoutineForm((prev) => ({
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

  // 저장을 위해 서버 전송용 데이터로 가공
  const getRoutineDataForSave = useCallback(() => {
    console.log(routineForm);
    return {
      name: routineForm.info.name,
      // 첫 글자만 대문자로 변환
      goalType:
        routineForm.info.routineType.toUpperCase(),

      durationWeek: routineForm.info.goalWeeks,

      exercises: routineForm.exercises.map((ex) => ({
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
  }, [routineForm]);

  return {
    routineForm,
    handleInfoChange,
    handleAddExercise,
    handleRemoveExercise,
    handleExerciseUpdate,
    handleSetUpdate,
    handleAddSet,
    handleRemoveSet,
    getRoutineDataForSave,
  };
};

export default useRoutineForm;
