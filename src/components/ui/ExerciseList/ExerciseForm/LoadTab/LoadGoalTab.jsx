import { addWeeks, format } from "date-fns";
import { useEffect, useState, useMemo } from "react";
import SelectedGoalHeader from "./SelectedGoalHeader";
import Calendar from "../../../../common/Calendar";
import DailyExerciseList from "./DailyExerciseList";

import "./LoadGoalTab.css";
import GoalItemCard from "../../../Routine/GoalList/GoalItemCard";
import useGoalsAndDailyRecords from "../../../../../hooks/useGoalsAndDailyRecords";
import useRoutineForm from "../../../../../hooks/useRoutineForm";

const LoadGoalTab = () => {
  const [goals, setGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const initialGoalData = useMemo(() => {
    if (!selectedGoal) return null;

    return {
      name: selectedGoal.name,
      routineType: selectedGoal.goalType,
      goalWeeks: selectedGoal.durationWeek,
      exercises: selectedGoal.customExercises.map((ex) => ({
        ...ex,
        id: ex._id,
        sets: ex.sets.map((set) => ({
          ...set,
          id: set._id || Date.now() + Math.random(),
        })),
      })),
    };
  }, [selectedGoal]);

  const {
    routineForm,
    handleExerciseUpdate,
    handleSetUpdate,
    handleAddSet,
    handleRemoveSet,
  } = useRoutineForm(true, initialGoalData);

  const {
    allGoals: allGoalsFromHook,
    isLoading: isGoalsLoading,
    error: goalsError,
  } = useGoalsAndDailyRecords();

  useEffect(() => {
    if (allGoalsFromHook && allGoalsFromHook.length > 0) {
      console.log("훅에서 로드된 전체 목표:", allGoalsFromHook);
      setGoals(allGoalsFromHook);
    } else if (goalsError) {
      console.error("목표 목록 로딩 실패:", goalsError);
    }
  }, [allGoalsFromHook, goalsError, goals]);

  // 목표 선택
  const handleSelectGoal = async (goalListItem) => {
    try {
      setIsLoading(true);
      if (goalListItem) {
        setSelectedGoal(goalListItem);
        setIsCalendarExpanded(true);
        setSelectedDate(new Date());
      } else {
        throw new Error(goalListItem.message || "목표 상세 정보가 없습니다.");
      }
    } catch (error) {
      console.error("목표 상세 로딩 실패:", error);
      alert("목표 정보를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
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

  // 저장하기
  const handleSave = () => {
    if (!selectedGoal || !selectedDate) return;

    // 여기서 상위 컴포넌트로 데이터를 전달하거나
    // 해당 날짜에 운동 계획을 추가하는 API를 호출합니다.
    const planData = {
      goalId: selectedGoal._id, // UserGoal ID
      date: format(selectedDate, "yyyy-MM-dd"),
      exercises: routineForm.exercises,
    };

    console.log("서버로 전송할 데이터:", planData);
    // 예: saveDailyPlan(planData).then(() => alert('저장 완료'));
  };

  // 챌린지 종료일 계산
  const challengeEndDate =
    selectedGoal?.goalType === "챌린지" && selectedGoal.durationWeek
      ? addWeeks(new Date(selectedGoal.startDate), selectedGoal.durationWeek)
      : null;

  const goalForRender = selectedGoal
    ? {
        ...selectedGoal,
        customExercises: routineForm.exercises,
      }
    : null;

  return (
    <div className="load-goal-container">
      {(isLoading || isGoalsLoading) && (
        <div className="loading-overlay">로딩중...</div>
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
              <div key={goal._id}>
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
              goal={goalForRender}
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
              className={`save-button ${!selectedDate ? "disabled" : ""}`}
              disabled={!selectedDate}
              onClick={handleSave}
            >
              저장하기
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default LoadGoalTab;
