import { addWeeks, format } from "date-fns";
import { useState, useMemo } from "react";
import { useCreateHistory } from "../../../../../hooks/useHistory";
import SelectedGoalHeader from "./SelectedGoalHeader";
import Calendar from "../../../../common/Calendar";
import DailyExerciseList from "./DailyExerciseList";

import "./LoadGoalTab.css";
import GoalItemCard from "../../../Goal/GoalList/GoalItemCard";
import useGoalForm from "../../../../../hooks/useGoalForm";
import { useGoals } from "../../../../../hooks/useGoals";

const calculateExerciseStats = (exercises) => {
  return exercises.map((ex) => {
    let maxWeight = 0;
    let totalVolume = 0;
    let totalReps = 0;

    const setsArray = ex.sets && Array.isArray(ex.sets) ? ex.sets : [];

    // 세트별 통계 계산
    const setsWithCompletion = setsArray.map((set, index) => {
      const weight = set.weight || 0;
      const reps = set.reps || 0;

      const volume = weight * reps;
      totalVolume += volume;
      totalReps += reps;

      if (weight > maxWeight) maxWeight = weight;

      return {
        setNumber: set.setNumber || index + 1,
        weight: weight,
        reps: reps,
        isCompleted: true,
      };
    });

    return {
      exerciseId: ex.exerciseId,
      name: ex.name,
      sets: setsWithCompletion,
      maxWeight: maxWeight,
      totalVolume: totalVolume,
      totalReps: totalReps,
      duration: (ex.duration || 0) * 60,
    };
  });
};

// 요일 이름을 가져오는 함수
const getDayOfWeekKorean = (date) => {
  const days = ["월", "화", "수", "목", "금", "토", "일"];
  return days[date.getDay()];
};

const LoadGoalTab = () => {
  const { goals, loading: isGoalsLoading, error: goalsError } = useGoals();

  const [selectedGoal, setSelectedGoal] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(true);
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  const { isSaving, saveError, createHistory } = useCreateHistory();

  const initialGoalData = useMemo(() => {
    if (!selectedGoal) return null;
    return {
      name: selectedGoal.name,
      goalType: selectedGoal.goalTypeLabel,
      goalWeeks: selectedGoal.durationWeek,
      exercises: selectedGoal.customExercises.map((ex) => ({
        ...ex,
        id: ex.exerciseId,
        duration: ex.duration || 0,
        sets: ex.sets.map((set) => ({
          ...set,
          id: set._id || Date.now() + Math.random(),
        })),
      })),
    };
  }, [selectedGoal]);

  const {
    goalForm,
    handleExerciseUpdate,
    handleSetUpdate,
    handleAddSet,
    handleRemoveSet,
  } = useGoalForm(true, initialGoalData);

  // 목표 선택
  const handleSelectGoal = (goalListItem) => {
    if (goalListItem) {
      setSelectedGoal(goalListItem);
      setIsCalendarExpanded(true);
      setSelectedDate(new Date());
    }
  };

  // 목표 취소(x버튼)
  const handleDeselectGoal = () => {
    setSelectedGoal(null);
    setSelectedDate(null);
  };

  // 날짜 선택
  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setIsCalendarExpanded(false);
  };

  // 달력 토글 (접힌 날짜 클릭 시)
  const toggleCalendar = () => {
    setIsCalendarExpanded((prev) => !prev);
  };

  // 운동 목록 계산
  const exercisesForSelectedDay = useMemo(() => {
    if (!selectedDate || !goalForm.exercises) return [];

    const currentDay = getDayOfWeekKorean(selectedDate);

    return goalForm.exercises.filter(
      (ex) => ex.days && ex.days.includes(currentDay)
    );
  }, [selectedDate, goalForm.exercises]);

  // 저장하기
  const handleSave = async () => {
    if (!selectedGoal || !selectedDate || isSaving) return;

    // 필터된 운동 목록
    const exercisesToSave = exercisesForSelectedDay;

    if (exercisesToSave.length === 0) {
      alert("⚠️ 선택한 날짜에 해당하는 운동 루틴이 없습니다.");
      return;
    }

    // 데이터 가공
    const processedExercises = calculateExerciseStats(exercisesToSave);

    // totalTime 계산(임시)
    const calculatedTotalSeconds = processedExercises.reduce(
      (acc, curr) => acc + (curr.duration || 0),
      0
    );

    const finalTotalTime =
      calculatedTotalSeconds > 0
        ? calculatedTotalSeconds
        : processedExercises.length * 10 * 60;

    const planData = {
      date: format(selectedDate, "yyyy-MM-dd"),
      userGoalId: selectedGoal._id,
      type: selectedGoal.goalType.toUpperCase(),
      title: selectedGoal.name,
      totalTime: finalTotalTime,
      exercises: processedExercises,
    };

    console.log("서버로 전송할 데이터:", planData);

    // API 호출
    const success = await createHistory(planData);

    if (success) {
      alert("✅ 운동 기록이 성공적으로 저장되었습니다!");
      handleDeselectGoal();
    } else {
      alert(
        `❌ 운동 기록 저장에 실패했습니다: ${saveError || "알 수 없는 오류"}`
      );
    }
  };

  // 챌린지 종료일 계산
  const challengeEndDate =
    selectedGoal?.goalTypeLabel === "챌린지" && selectedGoal.durationWeek
      ? addWeeks(new Date(selectedGoal.startDate), selectedGoal.durationWeek)
      : null;

  return (
    <div className="load-goal-container">
      {(isGoalsLoading || isSaving) && (
        <div className="loading-overlay">
          {isSaving ? "운동 기록 저장 중..." : "로딩중..."}
        </div>
      )}
      {/* 목표 리스트 */}
      {!selectedGoal && (
        <div className="goal-list-wrapper">
          {goalsError && (
            <div className="error-text">
              ❌ 목표 목록을 불러오지 못했습니다.
            </div>
          )}

          {!isGoalsLoading && goals.length > 0 ? (
            goals.map((goal) => (
              <div key={goal.id}>
                <GoalItemCard
                  goals={goal}
                  onClickOverride={() => handleSelectGoal(goal)}
                  hidenMenu={true}
                />
              </div>
            ))
          ) : (
            <div className="no-data-text">등록된 루틴이 없습니다.</div>
          )}
        </div>
      )}
      {/* 목표 선택 후 화면 */}
      {selectedGoal && (
        <>
          {/* 상단 고정 헤더 */}
          <SelectedGoalHeader
            goal={selectedGoal}
            onClose={handleDeselectGoal}
          />
          {/* 날짜 선택 */}
          <div className="date-selection-section">
            <div className="section-title">날짜 선택</div>
            {/* 달력(펼친 상태)*/}
            {isCalendarExpanded ? (
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
              // 달력(접힌 상태)
              <div className="collapsed-calendar-view" onClick={toggleCalendar}>
                <span className="selected-date-text">
                  {selectedDate
                    ? format(selectedDate, "yyyy년 MM월 dd일")
                    : "날짜 선택"}
                </span>
                <span className="toggle-icon">▼</span>
              </div>
            )}
          </div>
          {/* 운동 목록 */}
          {selectedDate && (
            <DailyExerciseList
              exercises={exercisesForSelectedDay}
              date={selectedDate}
              onExerciseUpdate={handleExerciseUpdate}
              onSetUpdate={handleSetUpdate}
              onAddSet={handleAddSet}
              onRemoveSet={handleRemoveSet}
            />
          )}

          {/* 저장 버튼 */}
          <div className="bottom-action-area">
            <button
              className={`save-button ${
                !selectedDate || isSaving ? "disabled" : ""
              }`}
              disabled={!selectedDate || isSaving}
              onClick={handleSave}
            >
              {isSaving ? "저장 중..." : "저장하기"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default LoadGoalTab;
