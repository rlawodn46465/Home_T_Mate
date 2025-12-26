import { useState, useCallback, useEffect } from "react";
import type {
  GoalDetail,
  CustomExercise,
  SetInfo,
  GoalType,
  CreateGoalRequest,
} from "../types/goal";
import type { ExerciseMaster } from "../types/exercise";

interface UI_SetInfo extends Omit<SetInfo, "isCompleted"> {
  id: string;
}

interface UI_CustomExercise {
  id: string;
  exerciseId: string;
  name: string;
  targetMuscles: string[];
  equipment: string[];
  days: string[];
  restTime: number;
  sets: UI_SetInfo[];
}

interface GoalFormState {
  info: {
    name: string;
    goalType: GoalType;
    goalWeeks: number;
  };
  exercises: UI_CustomExercise[];
}

const generateId = () => Math.random().toString(36).substring(2, 11);

// 데이터 가공 헬퍼 함수
const mapServerDataToForm = (
  serverData: GoalDetail | null
): GoalFormState | null => {
  if (!serverData) return null;

  return {
    info: {
      name: serverData.name || "새 목표",
      goalType: serverData.goalType,
      goalWeeks: serverData.durationWeek || 1,
    },
    exercises: (serverData.exercises || []).map((ex) => ({
      id: generateId(),
      exerciseId: ex.exerciseId,
      name: ex.name || "알 수 없는 운동",
      targetMuscles: ex.targetMuscles || [],
      equipment: [],
      days: ex.days || [],
      restTime: ex.restTime || 30,
      sets: (ex.sets || []).map((set) => ({
        id: generateId(),
        setNumber: set.setNumber,
        weight: set.weight,
        reps: set.reps,
      })),
    })),
  };
};

// 폼 초기값 상태
const getDefaultForm = (): GoalFormState => ({
  info: {
    name: "",
    goalType: "ROUTINE",
    goalWeeks: 1,
  },
  exercises: [],
});

// 목표 폼의 모든 상태와 핸들러 관리
export const useGoalForm = (
  isEditMode: boolean,
  initialGoal: GoalDetail | null
) => {
  const [goalForm, setGoalForm] = useState<GoalFormState>(() => {
    if (isEditMode && initialGoal) {
      return mapServerDataToForm(initialGoal) || getDefaultForm();
    }
    return getDefaultForm();
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
      setGoalForm(getDefaultForm());
    }
  }, [isEditMode, initialGoal]);

  // 목표 정보 업데이트 핸들러
  const handleInfoChange = useCallback(
    <K extends keyof GoalFormState["info"]>(
      field: K,
      value: GoalFormState["info"][K]
    ) => {
      setGoalForm((prev) => ({
        ...prev,
        info: {
          ...prev.info,
          [field]: value,
        },
      }));
    },
    []
  );

  // 운동 추가 핸들러
  const handleAddExercise = useCallback((newExercises: ExerciseMaster[]) => {
    // 새로운 운동 항목 배열 생성
    const exercisesToAdd: UI_CustomExercise[] = newExercises.map((ex) => ({
      id: generateId(),
      exerciseId: ex._id,
      name: ex.name,
      targetMuscles: ex.targetMuscles,
      equipment: ex.equipment || [],
      sets: [
        {
          id: generateId(),
          setNumber: 1,
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
  const handleRemoveExercise = useCallback((exerciseId: string) => {
    setGoalForm((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((ex) => ex.id !== exerciseId),
    }));
  }, []);

  // 운동 항목 내부 값 업데이트
  const handleExerciseUpdate = useCallback(
    <K extends keyof UI_CustomExercise>(
      exerciseId: string,
      field: K,
      value: UI_CustomExercise[K]
    ) => {
      setGoalForm((prev) => ({
        ...prev,
        exercises: prev.exercises.map((ex) =>
          ex.id === exerciseId ? { ...ex, [field]: value } : ex
        ),
      }));
    },
    []
  );

  // 세트 정보 업데이트
  const handleSetUpdate = useCallback(
    <K extends keyof UI_SetInfo>(
      exerciseId: string,
      setId: string,
      field: K,
      value: UI_SetInfo[K]
    ) => {
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
    },
    []
  );

  // 세트 추가
  const handleAddSet = useCallback((exerciseId: string) => {
    setGoalForm((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: [
                ...ex.sets,
                {
                  id: generateId(),
                  setNumber: ex.sets.length + 1,
                  weight: 0,
                  reps: 10,
                },
              ],
            }
          : ex
      ),
    }));
  }, []);

  // 세트 제거 (최소 1개의 세트 유지)
  const handleRemoveSet = useCallback((exerciseId: string, setId: string) => {
    setGoalForm((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) => {
        if (ex.id !== exerciseId || ex.sets.length <= 1) return ex;
        const filteredSets = ex.sets.filter((s) => s.id !== setId);
        const reorderedSets = filteredSets.map((s, idx) => ({
          ...s,
          setNumber: idx + 1,
        }));
        return { ...ex, sets: reorderedSets };
      }),
    }));
  }, []);

  // 저장을 위해 서버 전송용 데이터로 가공
  const getGoalDataForSave = useCallback((): CreateGoalRequest => {
    return {
      name: goalForm.info.name,
      // 첫 글자만 대문자로 변환
      goalType: goalForm.info.goalType,
      durationWeek: goalForm.info.goalWeeks,
      exercises: goalForm.exercises.map((ex) => ({
        exerciseId: ex.exerciseId,
        name: ex.name,
        targetMuscles: ex.targetMuscles || [],
        days: ex.days,
        restTime: ex.restTime,
        sets: ex.sets.map((set, setIndex) => ({
          setNumber: setIndex + 1,
          weight: Number(set.weight),
          reps: Number(set.reps),
        })),
      })),
      isUserPublic: true,
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
