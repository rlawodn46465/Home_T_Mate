import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { addWeeks, format } from "date-fns";
import styles from "./LoadGoalTab.module.css";
import SelectedGoalHeader from "./SelectedGoalHeader";
import Calendar from "../../../../common/Calendar";
import DailyExerciseList from "./DailyExerciseList";
import GoalItemCard from "../../../Goal/GoalList/GoalItemCard";
import {
  useCreateHistory,
  useUpdateHistory,
} from "../../../../../hooks/useHistory";
import useGoalForm from "../../../../../hooks/useGoalForm";
import { useGoals } from "../../../../../hooks/useGoals";
import { calculateExerciseStats } from "../../../../../utils/exerciseStats";

interface LoadGoalTabProps {
  recordId?: string;
  initialData?: any;
  initialDate?: Date;
}

interface GoalSummary {
  id: string | number;
  name: string;
  goalTypeLabel: string;
  goalType: string;
  durationWeek: number;
  startDate: string;
  activeDays: string[];
  parts: string[];
  creator: string;
  customExercises?: any[];
}

const getDayOfWeekKorean = (date: Date): string => {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return days[date.getDay()];
};

const LoadGoalTab = ({
  recordId,
  initialData,
  initialDate,
}: LoadGoalTabProps) => {
  const navigate = useNavigate();
  const { goals, loading: isGoalsLoading, error: goalsError } = useGoals();

  const initialGoalValue = useMemo<GoalSummary | null>(() => {
    if (!recordId || !initialData) return null;
    return {
      id: initialData.userGoalId,
      name: initialData.title,
      goalTypeLabel: initialData.type,
      goalType: initialData.type,
      durationWeek: initialData.durationWeek,
      startDate: initialData.startDate,
      activeDays: initialData.activeDays,
      parts: initialData.categoryGroup || [],
      creator: "나",
    };
  }, [recordId, initialData]);

  const [selectedGoal, setSelectedGoal] = useState<GoalSummary | null>(
    initialGoalValue
  );
  const [selectedDate, setSelectedDate] = useState<Date>(
    initialDate || new Date()
  );
  const [isCalendarExpanded, setIsCalendarExpanded] = useState<boolean>(
    !recordId
  );
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(
    initialDate || new Date()
  );

  const {
    createHistory,
    isSaving: isCreating,
    saveError: createError,
  } = useCreateHistory();
  const { updateHistory, isUpdating, updateError } = useUpdateHistory(
    recordId || ""
  );

  const isSaving = recordId ? isUpdating : isCreating;
  const currentError = recordId ? updateError : createError;

  const initialGoalData = useMemo(() => {
    if (recordId && initialData) {
      return {
        id: initialData.userGoalId,
        name: initialData.title,
        goalType: initialData.type,
        exercises: initialData.exercises.map((ex: any) => ({
          ...ex,
          id: ex.exerciseId,
          duration: (ex.totalTime || 0) / 60,
          sets: ex.sets.map((set: any, idx: number) => ({
            ...set,
            id: set._id || idx + 1,
          })),
        })),
      };
    }
    if (!selectedGoal) return null;
    return {
      name: selectedGoal.name,
      goalType: selectedGoal.goalTypeLabel,
      goalWeeks: selectedGoal.durationWeek,
      exercises: (selectedGoal.customExercises || []).map((ex) => ({
        ...ex,
        id: ex.exerciseId,
        duration: ex.duration || 0,
        sets: ex.sets.map((set: any) => ({
          ...set,
          id: Date.now() + Math.random(),
        })),
      })),
    };
  }, [selectedGoal, recordId, initialData]);

  const {
    goalForm,
    handleExerciseUpdate,
    handleSetUpdate,
    handleAddSet,
    handleRemoveSet,
  } = useGoalForm(true, initialGoalData as any);

  const handleSelectGoal = (goal: any) => {
    if (recordId) return;
    setSelectedGoal(goal);
    setIsCalendarExpanded(true);
    setSelectedDate(new Date());
  };

  const handleDeselectGoal = () => {
    if (recordId) return navigate("/?panel=record");
    setSelectedGoal(null);
  };

  const handleSelectDate = (date: Date) => {
    if (recordId) return;
    setSelectedDate(date);
    setIsCalendarExpanded(false);
  };

  const exercisesForSelectedDay = useMemo(() => {
    if (!goalForm.exercises) return [];
    if (recordId) return goalForm.exercises;

    const currentDay = getDayOfWeekKorean(selectedDate);
    return goalForm.exercises.filter((ex) => ex.days?.includes(currentDay));
  }, [selectedDate, goalForm.exercises, recordId]);

  const handleSave = async () => {
    const currentGoal =
      selectedGoal ||
      (recordId
        ? {
            id: initialData?.userGoalId,
            name: initialData?.title,
            goalType: initialData?.type,
          }
        : null);
    if (!currentGoal || !selectedDate || isSaving) return;

    if (exercisesForSelectedDay.length === 0) {
      alert("⚠️ 해당 날짜에 설정된 운동 목표가 없습니다.");
      return;
    }

    const processedExercises = calculateExerciseStats(exercisesForSelectedDay);
    const totalTime =
      processedExercises.reduce((acc, curr) => acc + (curr.duration || 0), 0) ||
      processedExercises.length * 600;

    const payload = {
      date: format(selectedDate, "yyyy-MM-dd"),
      userGoalId: currentGoal.id,
      type: currentGoal.goalType.toUpperCase(),
      title: currentGoal.name,
      totalTime,
      exercises: processedExercises,
    };

    const success = recordId
      ? await updateHistory(payload)
      : await createHistory(payload);
    if (success) {
      alert(`✅ 기록이 ${recordId ? "수정" : "저장"}되었습니다.`);
      handleDeselectGoal();
    } else {
      alert(`❌ 실패: ${currentError || "오류 발생"}`);
    }
  };

  const isGoalActive = selectedGoal || recordId;
  const challengeEndDate =
    selectedGoal?.goalTypeLabel === "챌린지"
      ? addWeeks(new Date(selectedGoal.startDate), selectedGoal.durationWeek)
      : null;

  return (
    <div className={styles.container}>
      {(isGoalsLoading || isSaving) && (
        <div className={styles.loadingOverlay}>
          {isSaving ? "처리 중..." : "목표 불러오는 중..."}
        </div>
      )}

      {!isGoalActive && (
        <div className={styles.goalListWrapper}>
          {goalsError && (
            <div className={styles.errorText}>목표를 불러오지 못했습니다.</div>
          )}
          {goals.map((goal: any) => (
            <GoalItemCard
              key={goal.id}
              goals={goal}
              onClickOverride={() => handleSelectGoal(goal)}
              hidenMenu
            />
          ))}
          {!isGoalsLoading && goals.length === 0 && (
            <div className="no-data-text">등록된 목표가 없습니다.</div>
          )}
        </div>
      )}

      {isGoalActive && (
        <>
          <SelectedGoalHeader
            goal={selectedGoal || initialData}
            onClose={handleDeselectGoal}
          />

          <section className={styles.dateSection}>
            <h4 className="section-title">날짜 선택</h4>
            {!recordId && isCalendarExpanded ? (
              <Calendar
                startDate={selectedGoal.startDate}
                endDate={challengeEndDate}
                activeDays={selectedGoal.activeDays}
                selectedDate={selectedDate}
                onSelectDate={handleSelectDate}
                currentMonth={currentMonthDate}
                onMonthChange={setCurrentMonthDate}
              />
            ) : (
              <div
                className={styles.collapsedCalendar}
                onClick={() => !recordId && setIsCalendarExpanded(true)}
                style={{ cursor: recordId ? "default" : "pointer" }}
              >
                <span className={styles.selectedDateText}>
                  {format(selectedDate, "yyyy년 MM월 dd일")}
                </span>
                {!recordId && <span className={styles.toggleIcon}>▼</span>}
              </div>
            )}
          </section>

          <DailyExerciseList
            exercises={exercisesForSelectedDay}
            date={selectedDate}
            onExerciseUpdate={handleExerciseUpdate}
            onSetUpdate={handleSetUpdate}
            onAddSet={handleAddSet}
            onRemoveSet={handleRemoveSet}
          />

          <div className={styles.actionArea}>
            <button
              className={styles.saveButton}
              disabled={!selectedDate || isSaving}
              onClick={handleSave}
            >
              {isSaving ? "저장 중..." : recordId ? "수정하기" : "저장하기"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default LoadGoalTab;
